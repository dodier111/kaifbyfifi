'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}


const emptyForm = { name: '', description: '', price: '', image: '', category: '', customCategory: '' };

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [contact, setContact] = useState({ email: '', phone: '', location: '', instagram: '' });
  const [contactSaving, setContactSaving] = useState(false);
  const [contactMsg, setContactMsg] = useState('');

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
  const [categoryMsg, setCategoryMsg] = useState('');

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data ?? []);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!authed) return;
    fetchProducts();
    fetchCategories();
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) setContact({ email: data.email || '', phone: data.phone || '', location: data.location || '', instagram: data.instagram || '' });
    });
  }, [authed, fetchProducts, fetchCategories]);

  if (!mounted) return <div className="min-h-screen bg-[#fdf6f7]" />;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setPasswordError('');

    // Validate against the server (which reads from .env.local)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': passwordInput },
      body: JSON.stringify({ __authCheck: true }),
    });

    setLoginLoading(false);

    if (res.status === 401) {
      setPasswordError('Incorrect password.');
    } else {
      // Any non-401 response (even 400 for missing fields) means the password is correct
      setPassword(passwordInput);
      setAuthed(true);
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    const isKnown = categories.some(c => c.name === product.category);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: isKnown ? product.category : 'Other',
      customCategory: isKnown ? '' : product.category,
    });
    setFormError('');
    setSuccessMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    const resolvedCategory = form.category === 'Other' ? form.customCategory.trim() : form.category;

    if (!form.name.trim() || !form.price || !resolvedCategory) {
      setFormError('Name, price, and category are required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      image: form.image.trim(),
      category: resolvedCategory,
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setFormError(err.error || 'Something went wrong.');
      return;
    }

    setSuccessMsg(editingId ? 'Product updated!' : 'Product added!');
    setForm(emptyForm);
    setEditingId(null);
    fetchProducts();
  }


  async function handleContactSave(e: React.FormEvent) {
    e.preventDefault();
    setContactSaving(true);
    setContactMsg('');
    const { error } = await supabase.from('settings').update(contact).eq('id', 1);
    setContactSaving(false);
    setContactMsg(error ? 'Failed to save.' : 'Saved!');
    setTimeout(() => setContactMsg(''), 3000);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const { error } = await supabase.from('categories').insert([{ name: newCategory.trim() }]);
    if (!error) { setNewCategory(''); fetchCategories(); setCategoryMsg('Category added!'); }
    else setCategoryMsg(error.message);
    setTimeout(() => setCategoryMsg(''), 3000);
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory) return;
    const { error } = await supabase.from('categories').update({ name: editingCategory.name }).eq('id', editingCategory.id);
    if (!error) { setEditingCategory(null); fetchCategories(); setCategoryMsg('Category updated!'); }
    else setCategoryMsg(error.message);
    setTimeout(() => setCategoryMsg(''), 3000);
  }

  async function handleDeleteCategory(id: number, name: string) {
    if (!confirm(`Delete category "${name}"? Products in this category won't be deleted.`)) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setFormError('');
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(filename, file, { upsert: true });
    if (error) {
      setFormError('Upload failed: ' + error.message);
    } else {
      const { data } = supabase.storage.from('products').getPublicUrl(filename);
      setForm(f => ({ ...f, image: data.publicUrl }));
    }
    setUploadingImage(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setSuccessMsg('');
    setFormError('');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        setSuccessMsg('Product deleted.');
        fetchProducts();
      } else {
        const err = await res.json().catch(() => ({}));
        setFormError(`Delete failed (${res.status}): ${err.error || 'Unknown error'}`);
      }
    } catch (e) {
      setFormError(`Delete failed: ${e instanceof Error ? e.message : 'Network error'}`);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f7] to-[#f7eef0] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm border border-[#e8c8cf]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#7d1d3f] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">💎</span>
            </div>
            <h1 className="text-2xl font-semibold text-stone-800">Admin Panel</h1>
            <p className="text-stone-500 text-sm mt-1">Kaif by Fifi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full border border-[#e8c8cf] rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
              data-lpignore="true"
              data-1p-ignore
              autoFocus
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#7d1d3f] text-white py-3 rounded-xl font-semibold hover:bg-[#3b0a1f] transition-all duration-300 disabled:opacity-60"
            >
              {loginLoading ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f7] to-[#f7eef0] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-stone-800">Admin Panel</h1>
            <p className="text-stone-500 text-sm mt-1">Manage your jewelry collection</p>
          </div>
          <button
            onClick={() => { setAuthed(false); setPassword(''); }}
            className="text-stone-500 hover:text-red-500 text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Add / Edit Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e8c8cf] p-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
                placeholder="e.g. Diamond Ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value, customCategory: '' }))}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f] bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
                <option value="Other">+ Other</option>
              </select>
              {form.category === 'Other' && (
                <input
                  type="text"
                  value={form.customCategory}
                  onChange={e => setForm(f => ({ ...f, customCategory: e.target.value }))}
                  className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f] mt-2"
                  placeholder="Enter custom category"
                  autoFocus
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Price (USD) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#e8c8cf] rounded-xl cursor-pointer hover:border-[#7d1d3f] hover:bg-[#fdf6f7] transition-all duration-200 relative overflow-hidden">
                {form.image ? (
                  <img src={form.image} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="flex flex-col items-center text-[#7d1d3f]/40 gap-1">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
              {form.image && (
                <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} className="mt-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                  Remove image
                </button>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f] resize-none"
                placeholder="Short description of the piece..."
              />
            </div>

            {formError && <p className="md:col-span-2 text-red-500 text-sm">{formError}</p>}
            {successMsg && <p className="md:col-span-2 text-green-600 text-sm font-medium">{successMsg}</p>}

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-[#7d1d3f] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#3b0a1f] transition-all duration-300 shadow-md"
              >
                {editingId ? 'Save Changes' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-8 py-3 rounded-xl font-semibold border border-stone-300 text-stone-600 hover:bg-stone-50 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e8c8cf] overflow-hidden">
          <div className="p-6 border-b border-[#e8c8cf]">
            <h2 className="text-xl font-semibold text-stone-800">
              Products <span className="text-stone-400 font-normal text-base">({products.length})</span>
            </h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-stone-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-stone-400">No products yet. Add one above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f7eef0] text-[#7d1d3f] uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2dde1]">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-[#f7eef0]/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image && (product.image.startsWith('/') || product.image.startsWith('http')) ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#e8c8cf] flex-shrink-0">
                              <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#f2dde1] flex items-center justify-center text-xl flex-shrink-0">💎</div>
                          )}
                          <div>
                            <p className="font-medium text-stone-800">{product.name}</p>
                            <p className="text-stone-400 text-xs line-clamp-1 max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-stone-800">${product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="text-[#7d1d3f] hover:text-[#3b0a1f] font-medium px-3 py-1.5 rounded-lg hover:bg-[#f7eef0] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e8c8cf] p-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">Categories</h2>

          {/* Add new */}
          <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
            />
            <button type="submit" className="bg-[#7d1d3f] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#3b0a1f] transition-all duration-300">
              Add
            </button>
          </form>

          {categoryMsg && <p className="text-green-600 text-sm mb-4">{categoryMsg}</p>}

          {/* List */}
          <div className="divide-y divide-[#f2dde1]">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 py-3">
                {editingCategory?.id === cat.id ? (
                  <form onSubmit={handleSaveCategory} className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="flex-1 border border-[#e8c8cf] rounded-lg px-3 py-1.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f] text-sm"
                      autoFocus
                    />
                    <button type="submit" className="text-[#7d1d3f] font-medium text-sm hover:text-[#3b0a1f] px-2">Save</button>
                    <button type="button" onClick={() => setEditingCategory(null)} className="text-stone-400 text-sm hover:text-stone-600 px-2">Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1 text-stone-800">{cat.name}</span>
                    <button onClick={() => setEditingCategory(cat)} className="text-[#7d1d3f] hover:text-[#3b0a1f] font-medium text-sm px-3 py-1 rounded-lg hover:bg-[#f7eef0] transition-colors">Edit</button>
                    <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-red-500 hover:text-red-600 font-medium text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                  </>
                )}
              </div>
            ))}
            {categories.length === 0 && <p className="text-stone-400 text-sm py-4">No categories yet.</p>}
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e8c8cf] p-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">Contact Info</h2>
          <form onSubmit={handleContactSave} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
              <input
                type="text"
                value={contact.email}
                onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
                placeholder="info@kaifbyfifi.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Phone</label>
              <input
                type="text"
                value={contact.phone}
                onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
                placeholder="(123) 456-7890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Location</label>
              <input
                type="text"
                value={contact.location}
                onChange={e => setContact(c => ({ ...c, location: e.target.value }))}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
                placeholder="New York, NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Instagram</label>
              <input
                type="text"
                value={contact.instagram}
                onChange={e => setContact(c => ({ ...c, instagram: e.target.value }))}
                className="w-full border border-[#e8c8cf] rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7d1d3f]"
                placeholder="@kaifbyfifi"
              />
            </div>
            <div className="md:col-span-3 flex items-center gap-4">
              <button
                type="submit"
                disabled={contactSaving}
                className="bg-[#7d1d3f] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#3b0a1f] transition-all duration-300 shadow-md disabled:opacity-60"
              >
                {contactSaving ? 'Saving...' : 'Save Contact Info'}
              </button>
              {contactMsg && <span className="text-green-600 text-sm font-medium">{contactMsg}</span>}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
