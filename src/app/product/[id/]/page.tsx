import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const { data: product } = await supabase.from('products').select('*').eq('id', Number(id)).single();

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-light text-stone-800 mb-6 font-dancing-script">{product.name}</h1>
            <p className="text-stone-600 mb-8 text-lg leading-relaxed">{product.description}</p>
            <div className="text-4xl font-bold text-stone-800">${product.price.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
