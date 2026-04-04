'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

function Lightbox({ product, onClose }: { product: Product; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const pinch = useRef<{ dist: number; startZoom: number } | null>(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const clamp = (v: number) => Math.min(Math.max(+v.toFixed(2), 0.5), 4);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoom(z => clamp(z + 0.25));
      if (e.key === '-') setZoom(z => clamp(z - 0.25));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Non-passive touch + wheel on the overlay
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const dist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinch.current = { dist: dist(e.touches), startZoom: zoomRef.current };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinch.current) {
        e.preventDefault();
        const ratio = dist(e.touches) / pinch.current.dist;
        setZoom(clamp(pinch.current.startZoom * ratio));
      }
    };
    const onTouchEnd = () => { pinch.current = null; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(z => clamp(z + (e.deltaY < 0 ? 0.15 : -0.15)));
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd);
    el.addEventListener('wheel',      onWheel,      { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
      el.removeEventListener('wheel',      onWheel);
    };
  }, []);

  return createPortal(
    <div
      ref={overlayRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}
      onClick={onClose}
    >
      {/* Controls */}
      <div
        style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}
        onClick={e => e.stopPropagation()}
      >
        {[['−', () => setZoom(z => clamp(z - 0.25))], ['+', () => setZoom(z => clamp(z + 0.25))]].map(([label, fn]) => (
          <button
            key={label as string}
            onTouchEnd={e => { e.stopPropagation(); (fn as () => void)(); }}
            onClick={e => { e.stopPropagation(); (fn as () => void)(); }}
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 22, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >{label as string}</button>
        ))}
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, minWidth: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button
          onTouchEnd={e => { e.stopPropagation(); onClose(); }}
          onClick={e => { e.stopPropagation(); onClose(); }}
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 20, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >✕</button>
      </div>

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
          transition: pinch.current ? 'none' : 'transform 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={900}
          height={900}
          style={{ maxWidth: '88vw', maxHeight: '82vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: 12, userSelect: 'none' }}
          draggable={false}
          priority
        />
      </div>

      {/* Label */}
      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, background: 'rgba(0,0,0,0.45)', padding: '6px 16px', borderRadius: 999 }}>
          {product.name} — ${product.price.toLocaleString()}
        </span>
      </div>
    </div>,
    document.body,
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const openLightbox = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpen(true);
  }, []);

  return (
    <>
      <div className="bg-amber-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-amber-200 group">
        <button
          type="button"
          className="relative h-72 w-full overflow-hidden block"
          onClick={openLightbox}
          onTouchEnd={openLightbox}
          style={{ cursor: 'zoom-in', WebkitTapHighlightColor: 'transparent' }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Tap to zoom</span>
          </div>
        </button>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-stone-800 mb-2">{product.name}</h3>
          <p className="text-stone-600 text-sm mb-4 leading-relaxed">{product.description}</p>
          <span className="text-2xl font-bold text-stone-800">${product.price.toLocaleString()}</span>
        </div>
      </div>

      {mounted && open && <Lightbox product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
