import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import CategoriesDropdown from './CategoriesDropdown';
import MobileMenu from './MobileMenu';

export default async function Header() {
  const { data: categories } = await supabase.from('categories').select('id, name').order('name');

  return (
    <header className="bg-[#fdf6f7] shadow-md border-b border-[#e8c8cf] sticky top-0 z-50 relative">
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7d1d3f]/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">

          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <Image src="/logo2.png" alt="Kaif by Fifi" width={140} height={140} className="object-contain" priority />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className="text-[#7d1d3f] hover:text-[#3b0a1f] font-medium px-4 py-2 rounded-lg hover:bg-[#f2dde1] transition-all duration-300 text-sm tracking-wide">
              Home
            </Link>
            <CategoriesDropdown categories={categories ?? []} />
            <Link href="/about" className="text-[#7d1d3f] hover:text-[#3b0a1f] font-medium px-4 py-2 rounded-lg hover:bg-[#f2dde1] transition-all duration-300 text-sm tracking-wide">
              About
            </Link>
            <Link href="/contact" className="text-[#7d1d3f] hover:text-[#3b0a1f] font-medium px-4 py-2 rounded-lg hover:bg-[#f2dde1] transition-all duration-300 text-sm tracking-wide">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu */}
          <MobileMenu categories={categories ?? []} />

        </div>
      </div>
    </header>
  );
}
