import { supabase } from '@/lib/supabase';

export default async function Footer() {
  const { data } = await supabase.from('settings').select('*').single();
  const email = data?.email || 'info@kaifbyfifi.com';
  const phone = data?.phone || '(123) 456-7890';
  const location = data?.location || 'New York, NY';

  return (
    <footer className="bg-[#f2dde1] text-[#3b0a1f] border-t border-[#e8c8cf]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-light italic mb-4 font-playfair text-[#7d1d3f]">Kaif by Fifi</h3>
            <p className="text-[#3b0a1f]/70 leading-relaxed text-sm">
              Tradition Meets Modern — elegant jewelry crafted with passion and precision. Each piece tells a story of timeless beauty.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 text-[#7d1d3f]">Quick Links</h3>
            <ul className="space-y-3">
              {[['/', 'Home'], ['/products', 'Collections'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-[#3b0a1f]/70 hover:text-[#7d1d3f] transition-colors duration-300 text-sm">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 text-[#7d1d3f]">Contact</h3>
            <div className="space-y-3 text-sm text-[#3b0a1f]/70">
              <p>✉ {email}</p>
              <p>📞 {phone}</p>
              <p>📍 {location}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#e8c8cf] text-center">
          <p className="text-[#3b0a1f]/50 text-sm">&copy; {new Date().getFullYear()} Kaif by Fifi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
