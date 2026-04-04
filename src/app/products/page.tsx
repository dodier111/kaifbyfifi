import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const { data: products } = await supabase.from('products').select('*').order('id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-light text-center mb-16 text-stone-800 font-dancing-script">
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
