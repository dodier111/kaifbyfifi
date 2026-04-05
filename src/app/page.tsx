import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ScrollHero from '@/components/ScrollHero';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').order('id').limit(3);

  return (
    <div className="min-h-screen bg-[#fdf6f7]">
      {/* Scroll-based Hero */}
      <ScrollHero />

      {/* Featured Products */}
      <section className="py-20 bg-[#fdf6f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-[#7d1d3f] font-playfair italic">
            Best Sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(products ?? []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-block bg-[#7d1d3f] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#3b0a1f] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
