'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Props {
  categories: { id: number; name: string }[];
}

export default function MobileMenu({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-[#f2dde1] transition-colors duration-300"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-6 h-6 text-[#7d1d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-[#7d1d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#fdf6f7] border-b border-[#e8c8cf] shadow-lg z-50">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-[#7d1d3f] font-medium px-4 py-3 rounded-lg hover:bg-[#f2dde1] transition-colors text-sm"
            >
              Home
            </Link>

            {/* Categories accordion */}
            <div>
              <button
                onClick={() => setCatsOpen(o => !o)}
                className="w-full text-left text-[#7d1d3f] font-medium px-4 py-3 rounded-lg hover:bg-[#f2dde1] transition-colors text-sm flex items-center justify-between"
              >
                Categories
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${catsOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {catsOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/categories/${encodeURIComponent(cat.name)}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[#3b0a1f] hover:bg-[#f2dde1] hover:text-[#7d1d3f] rounded-lg transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="text-[#7d1d3f] font-medium px-4 py-3 rounded-lg hover:bg-[#f2dde1] transition-colors text-sm"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-[#7d1d3f] font-medium px-4 py-3 rounded-lg hover:bg-[#f2dde1] transition-colors text-sm"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
