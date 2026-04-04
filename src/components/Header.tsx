import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 backdrop-blur-md shadow-xl border-b border-amber-200/50 sticky top-0 z-50 relative overflow-hidden">
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 via-transparent to-yellow-100/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(251,191,36,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1),transparent_50%)]"></div>
      </div>

      {/* Decorative border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-24">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">💎</span>
            </div>
            <Link href="/" className="text-4xl font-semibold italic text-stone-900 font-playfair tracking-wide hover:text-amber-600 transition-all duration-300 transform hover:scale-105">
              Kaif by Fifi
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-stone-700 hover:text-amber-600 font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-amber-50/50">
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/products" className="text-stone-700 hover:text-amber-600 font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-amber-50/50">
              <span className="relative z-10">Collections</span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/about" className="text-stone-700 hover:text-amber-600 font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-amber-50/50">
              <span className="relative z-10">About</span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/contact" className="text-stone-700 hover:text-amber-600 font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-amber-50/50">
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button className="md:hidden p-2 rounded-lg hover:bg-amber-50/50 transition-colors duration-300">
              <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}