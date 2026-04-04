import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#fdf6f7] shadow-md border-b border-[#e8c8cf] sticky top-0 z-50">
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7d1d3f]/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <Image src="/logo.png" alt="Kaif by Fifi" width={70} height={70} className="object-contain" priority />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-2">
            {[['/', 'Home'], ['/products', 'Collections'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-[#7d1d3f] hover:text-[#3b0a1f] font-medium px-4 py-2 rounded-lg hover:bg-[#f2dde1] transition-all duration-300 text-sm tracking-wide"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-[#f2dde1] transition-colors duration-300">
            <svg className="w-6 h-6 text-[#7d1d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
}
