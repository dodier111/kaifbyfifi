import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const { data } = await supabase.from('settings').select('*').single();
  const email = data?.email || '';
  const phone = data?.phone || '';
  const location = data?.location || '';
  const instagram = data?.instagram || '';

  return (
    <div className="min-h-screen bg-[#fdf6f7]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f2dde1] via-[#f7e8ea] to-[#fdf6f7] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,29,63,0.08),transparent_60%)]"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-light italic mb-6 text-[#7d1d3f] font-playfair">
            Contact Us
          </h1>
          <p className="text-lg text-[#3b0a1f]/70 leading-relaxed">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-sm border border-[#e8c8cf] p-10 md:p-14">
            <h2 className="text-2xl font-light italic text-[#7d1d3f] font-playfair mb-10 text-center">
              Get in Touch
            </h2>
            <div className="space-y-8">
              {email && (
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-full bg-[#f2dde1] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#7d1d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#7d1d3f] font-semibold mb-1">Email</p>
                    <a href={`mailto:${email}`} className="text-[#3b0a1f] hover:text-[#7d1d3f] transition-colors text-base">
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-full bg-[#f2dde1] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#7d1d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#7d1d3f] font-semibold mb-1">Phone</p>
                    <a href={`tel:${phone}`} className="text-[#3b0a1f] hover:text-[#7d1d3f] transition-colors text-base">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {location && (
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-full bg-[#f2dde1] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#7d1d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#7d1d3f] font-semibold mb-1">Location</p>
                    <p className="text-[#3b0a1f] text-base">{location}</p>
                  </div>
                </div>
              )}

              {instagram && (
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-full bg-[#f2dde1] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#7d1d3f]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#7d1d3f] font-semibold mb-1">Instagram</p>
                    <a
                      href={`https://instagram.com/${instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3b0a1f] hover:text-[#7d1d3f] transition-colors text-base"
                    >
                      {instagram.startsWith('@') ? instagram : `@${instagram}`}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
