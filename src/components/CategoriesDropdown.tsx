'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  categories: { id: number; name: string }[];
}

export default function CategoriesDropdown({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[#7d1d3f] hover:text-[#3b0a1f] font-medium px-4 py-2 rounded-lg hover:bg-[#f2dde1] transition-all duration-300 text-sm tracking-wide flex items-center gap-1"
      >
        Categories
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#e8c8cf] rounded-2xl shadow-xl overflow-hidden z-50">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/categories/${encodeURIComponent(cat.name)}`}
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-sm text-[#3b0a1f] hover:bg-[#f2dde1] hover:text-[#7d1d3f] transition-colors duration-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
