import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').order('id').limit(3);

  return (
    <div className="min-h-screen bg-[#fdf6f7]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f2dde1] via-[#f7e8ea] to-[#fdf6f7] py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,29,63,0.08),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-light italic mb-6 text-[#7d1d3f] font-playfair">
            Kaif by Fifi
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-[#3b0a1f]/70 leading-relaxed">
            Tradition Meets Modern — discover exquisite jewelry crafted with elegance and passion.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#7d1d3f] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#3b0a1f] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#fdf6f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-[#7d1d3f] font-playfair italic">
            Featured Collection
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
              View All Collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
