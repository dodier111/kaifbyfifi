import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const { data: products } = await supabase.from('products').select('*').order('id');

  return (
    <div className="min-h-screen bg-[#fdf6f7] py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <h1 className="text-5xl font-light text-center mb-16 text-[#7d1d3f] font-playfair italic">
          Our Collections
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(products ?? []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
