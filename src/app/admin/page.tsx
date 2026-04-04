'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const CATEGORIES = [
  'Rings',
  'Earrings',
  'Necklaces',
  'Bracelets',
  'Pendants',
  'Bangles',
  'Anklets',
  'Brooches',
  'Other',
];

const emptyForm = { name: '', description: '', price: '', image: '', category: '', customCategory: '' };

export default function AdminPage() {
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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed, fetchProducts]);

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
    const isKnown = CATEGORIES.includes(product.category);
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm border border-amber-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">💎</span>
            </div>
            <h1 className="text-2xl font-semibold text-stone-800">Admin Panel</h1>
            <p className="text-stone-500 text-sm mt-1">Kaif by Fifi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 disabled:opacity-60"
            >
              {loginLoading ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-12 px-4">
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
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
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
                className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="e.g. Diamond Ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value, customCategory: '' }))}
                className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {form.category === 'Other' && (
                <input
                  type="text"
                  value={form.customCategory}
                  onChange={e => setForm(f => ({ ...f, customCategory: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 mt-2"
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
                className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="https://drive.google.com/uc?export=view&id=..."
              />
              <p className="text-xs text-stone-400 mt-1">
                Google Drive: Share → Anyone with link → copy ID → <span className="font-mono">...uc?export=view&id=YOUR_ID</span>
              </p>
              {form.image && (
                <img src={form.image} alt="preview" className="mt-2 h-24 rounded-lg object-cover border border-amber-100" />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                placeholder="Short description of the piece..."
              />
            </div>

            {formError && <p className="md:col-span-2 text-red-500 text-sm">{formError}</p>}
            {successMsg && <p className="md:col-span-2 text-green-600 text-sm font-medium">{successMsg}</p>}

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 shadow-md"
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
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="p-6 border-b border-amber-100">
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
                <thead className="bg-amber-50 text-stone-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-amber-100 flex-shrink-0">
                              <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">💎</div>
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
                          className="text-amber-600 hover:text-amber-700 font-medium px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
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
      </div>
    </div>
  );
}
