import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  const { data: products } = await supabase.from('products').select('*').eq('category', name).order('id');

  return (
    <div className="min-h-screen bg-[#fdf6f7] py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <div className="mb-10">
          <Link href="/categories" className="text-[#7d1d3f]/60 hover:text-[#7d1d3f] text-sm transition-colors">
            ← All Categories
          </Link>
        </div>
        <h1 className="text-5xl font-light text-center mb-16 text-[#7d1d3f] font-playfair italic">
          {name}
        </h1>
        {(products ?? []).length === 0 ? (
          <p className="text-center text-[#3b0a1f]/50 text-lg">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(products ?? []).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
