'use client';

import { useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Link from 'next/link';

const FRAME_COUNT = 240;

const frames = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/images/scroll/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`
);

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Preload all frames
  useEffect(() => {
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = images;

    frames.forEach((src, i) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        images[i] = img;
        // Draw first frame once loaded
        if (i === 0) {
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d')?.drawImage(img, 0, 0);
        }
      };
    });
  }, []);

  // Update canvas frame on scroll
  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      const index = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
      if (index === currentFrameRef.current) return;
      currentFrameRef.current = index;

      const canvas = canvasRef.current;
      const img = imagesRef.current[index];
      if (!canvas || !img) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (canvas.width !== img.naturalWidth) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    });
  }, [scrollYProgress]);

  // Text phase opacities
  const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.22, 0.32], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.05], [40, 0]);

  const taglineOpacity = useTransform(scrollYProgress, [0.28, 0.38, 0.52, 0.60], [0, 1, 1, 0]);
  const taglineY = useTransform(scrollYProgress, [0.28, 0.38], [30, 0]);

  const featureOpacity = useTransform(scrollYProgress, [0.56, 0.66, 0.80, 0.88], [0, 1, 1, 0]);
  const featureY = useTransform(scrollYProgress, [0.56, 0.66], [30, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.95], [30, 0]);

  return (
    // Tall scroll container — sticky inner div stays pinned
    <div ref={containerRef} style={{ height: '350vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#fdf6f7]">
        {/* Canvas — full bleed, covers the sticky section */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
        />

        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Phase 1 — Brand name */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="text-6xl md:text-8xl font-light italic text-white font-playfair drop-shadow-xl">
            Kaif by Fifi
          </h1>
          <p className="mt-4 text-white/80 text-lg md:text-xl tracking-widest uppercase font-light drop-shadow">
            Fine Jewelry
          </p>
        </motion.div>

        {/* Phase 2 — Tagline */}
        <motion.div
          style={{ opacity: taglineOpacity, y: taglineY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-2xl md:text-4xl font-light italic text-white font-playfair drop-shadow-xl max-w-2xl leading-relaxed">
            Tradition Meets Modern
          </p>
          <div className="mt-4 w-16 h-px bg-white/60 mx-auto" />
          <p className="mt-4 text-white/70 text-base md:text-lg tracking-wide font-light drop-shadow">
            Where heritage inspires every design
          </p>
        </motion.div>

        {/* Phase 3 — Features */}
        <motion.div
          style={{ opacity: featureOpacity, y: featureY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-2xl md:text-4xl font-light italic text-white font-playfair drop-shadow-xl max-w-2xl leading-relaxed">
            Crafted with Passion &amp; Precision
          </p>
          <div className="mt-8 flex gap-10 md:gap-16 text-white/80 text-sm md:text-base tracking-widest uppercase font-light">
            <span>Handcrafted</span>
            <span>·</span>
            <span>Timeless</span>
            <span>·</span>
            <span>Elegant</span>
          </div>
        </motion.div>

        {/* Phase 4 — CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-3xl md:text-5xl font-light italic text-white font-playfair drop-shadow-xl mb-8">
            Discover the Collection
          </p>
          <Link
            href="/products"
            className="bg-white text-[#7d1d3f] px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#f2dde1] transition-all duration-300 shadow-xl hover:scale-105 transform"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Scroll indicator — visible only at top */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/40 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
