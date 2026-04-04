import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdf6f7]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f2dde1] via-[#f7e8ea] to-[#fdf6f7] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,29,63,0.08),transparent_60%)]"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-light italic mb-6 text-[#7d1d3f] font-playfair">
            About Us
          </h1>
          <p className="text-lg text-[#3b0a1f]/70 leading-relaxed">
            The story behind Kaif by Fifi
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full bg-[#f2dde1] border-4 border-[#e8c8cf] flex items-center justify-center overflow-hidden shadow-xl">
                <Image
                  src="/logo2.png"
                  alt="Kaif by Fifi"
                  width={220}
                  height={220}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="space-y-6 text-[#3b0a1f]/80 leading-relaxed">
              <h2 className="text-3xl font-light italic text-[#7d1d3f] font-playfair">Tradition Meets Modern</h2>
              <p>
                Kaif by Fifi was born from a deep love of jewelry and a desire to bring timeless craftsmanship to the modern woman. Each piece is thoughtfully designed to celebrate elegance, culture, and individuality.
              </p>
              <p>
                We believe jewelry is more than an accessory — it is a reflection of who you are, a story you carry with you. That is why every piece in our collection is crafted with care, precision, and passion.
              </p>
              <p>
                From delicate earrings to statement rings, our collections blend traditional inspiration with contemporary design, creating pieces that are both meaningful and beautiful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#f2dde1]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light italic text-center text-[#7d1d3f] font-playfair mb-14">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Craftsmanship', desc: 'Every piece is made with attention to detail, ensuring the highest quality in design and finish.' },
              { title: 'Elegance', desc: 'We create jewelry that is timeless — refined, graceful, and always in style.' },
              { title: 'Passion', desc: 'Jewelry is our art form. Each collection is created with genuine love and creative dedication.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8c8cf] text-center">
                <h3 className="text-xl font-semibold text-[#7d1d3f] mb-4">{title}</h3>
                <p className="text-[#3b0a1f]/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
