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
                Kaif By FiFi was created from a deep love for jewelry and a vision to make stylish, high-quality pieces accessible to everyone especially students.
              </p>
              <p>
                Our collections are carefully selected to bring you a mix of timeless designs and modern trends that fit everyday life, special occasions and everything in between.
              </p>
              <p>
                We believe you shouldn&apos;t have to choose between quality and affordability. That&apos;s why our goal is simple: to offer beautiful, durable, 18k plated and on-trend jewelry at prices that feel comfortable for real lifestyles. From everyday essentials to statement pieces, Kaif By FiFi is here to help you express your style with confidence.
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
              { title: 'Quality', desc: 'We carefully select pieces made from durable materials designed for everyday wear.' },
              { title: 'Affordability', desc: 'Our mission is to offer stylish jewelry at student-friendly prices without compromising on quality.' },
              { title: 'Style', desc: 'We bring together modern trends and timeless designs so you can find pieces for every occasion.' },
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
