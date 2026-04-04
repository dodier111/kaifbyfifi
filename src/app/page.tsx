import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').order('id').limit(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-50 text-stone-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-light italic mb-6 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent font-playfair">
            Kaif by Fifi
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-stone-600 leading-relaxed">
            Discover exquisite jewelry pieces crafted with elegance and passion.
            Find the perfect piece to express your unique style.
          </p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-yellow-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-stone-800 font-playfair italic">
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
              className="inline-block bg-gradient-to-r from-stone-800 to-stone-700 text-white px-8 py-4 rounded-full font-semibold hover:from-stone-700 hover:to-stone-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
