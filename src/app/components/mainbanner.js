'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.css';
import { FaClock, FaCalendarAlt, FaPlay, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const SLIDES = [
  {
    id: 0,
    bg: 'assets/img/banner/banner01.jpg',
    accentColor: '#F28C28',
    tag: 'Featured',
    title: ['Unlimited', 'Movie,', 'Shows &', 'More.'],
    titleHighlight: 0,
    description: 'Dive into an ocean of blockbusters, award-winning originals, and timeless classics — all in stunning 4K.',
    rating: 'PG 18',
    quality: 'HDR',
    categories: ['Romance', 'Drama'],
    year: '2021',
    duration: '3 Hrs',
    //stars: 4.8,
    videoId: 'R2gbPxeNk2E',
    overlayGradient: 'linear-gradient(105deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.82) 40%, rgba(5,5,15,0.25) 75%, transparent 100%)',
  },
  {
    id: 1,
    bg: 'assets/img/banner/banner02.webp',
    accentColor: '#F28C28',
    tag: 'New Release',
    title: ['Epic', 'Adventures', 'Await', 'You.'],
    titleHighlight: 1,
    description: 'Heart-pounding action. Breathtaking visuals. Stories that stay with you long after the credits roll.',
    rating: 'PG 13',
    quality: '4K',
    categories: ['Action', 'Sci-Fi'],
    year: '2024',
    duration: '2h 45m',
    //stars: 4.6,
    videoId: 'R2gbPxeNk2E',
    overlayGradient: 'linear-gradient(105deg, rgba(8,3,3,0.97) 0%, rgba(8,3,3,0.82) 40%, rgba(8,3,3,0.25) 75%, transparent 100%)',
  },
  {
    id: 2,
    bg: 'assets/img/banner/banner03.jpg',
    accentColor: '#F28C28',
    tag: 'Trending',
    title: ['Original', 'Series', 'Binge-', 'Watch.'],
    titleHighlight: 2,
    description: 'Exclusive originals you won\'t find anywhere else. Every episode crafted to keep you hooked.',
    rating: 'PG 16',
    quality: 'ULTRA HD',
    categories: ['Thriller', 'Mystery'],
    year: '2023',
    duration: '8 Episodes',
    //stars: 4.9,
    videoId: 'R2gbPxeNk2E',
    overlayGradient: 'linear-gradient(105deg, rgba(2,8,5,0.97) 0%, rgba(2,8,5,0.82) 40%, rgba(2,8,5,0.25) 75%, transparent 100%)',
  },
];

const AUTO_PLAY_DURATION = 7000;

function StarRating({ value }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F5C518', fontSize: '12px', fontWeight: 700 }}>
      <FaStar size={12} />
      {value.toFixed(1)}
    </span>
  );
}

function MainBanner() {
  const [isOpen, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState('R2gbPxeNk2E');
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const autoPlayRef = useRef(null);
  const startTimeRef = useRef(null);
  const slideRef = useRef(null);
  const contentRef = useRef(null);
  const gsapRef = useRef(null);
  const tlRef = useRef(null);

  // Load GSAP
  useEffect(() => {
    const loadGsap = async () => {
      if (typeof window === 'undefined') return;
      try {
        const gsapModule = await import('gsap');
        gsapRef.current = gsapModule.gsap || gsapModule.default;
      } catch (e) {
        // GSAP not available, fallback to CSS
      }
    };
    loadGsap();
  }, []);

  const animateContentIn = useCallback((direction = 1) => {
  const gsap = gsapRef.current;
  if (!gsap || !contentRef.current) return;
  
  const el = contentRef.current;
  const items = el.querySelectorAll('.slide-tag, .title-word, .slide-desc, .slide-meta, .slide-btn-group');

  // Kill any existing animations to prevent flickering
  gsap.killTweensOf(items);

  // Set initial state: Slightly down, blurred, and invisible
  gsap.set(items, { 
    opacity: 0, 
    y: 30, 
    filter: 'blur(10px)' 
  });

  // Animate In: Move to original position, remove blur
  gsap.to(items, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.8,
    stagger: 0.05,
    ease: 'power3.out',
  });
}, []);

  const animateContentOut = useCallback((direction = 1, onComplete) => {
  const gsap = gsapRef.current;
  if (!gsap || !contentRef.current) {
    onComplete?.();
    return;
  }
  
  const el = contentRef.current;
  const items = el.querySelectorAll('.slide-tag, .title-word, .slide-desc, .slide-meta, .slide-btn-group');

  // Animate Out: Move slightly up, blur, and fade out
  gsap.to(items, {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    duration: 0.4,
    stagger: 0.02,
    ease: 'power2.in',
    onComplete: onComplete
  });
}, []);

  const goTo = useCallback((nextIndex, dir) => {
  if (animating || nextIndex === current) return;
  setAnimating(true);

  // 1. Fade the current content OUT
  animateContentOut(dir, () => {
    // 2. Update state to the new slide
    setPrev(current);
    setCurrent(nextIndex);
    setDirection(dir);
    setProgress(0);
    startTimeRef.current = performance.now();

    // 3. Small delay to allow React to render the new slide text/meta
    setTimeout(() => {
      setAnimating(false);
      setPrev(null);
      // 4. Fade the new content IN
      animateContentIn(dir);
    }, 50); // Reduced delay for snappier feel
  });
}, [animating, current, animateContentOut, animateContentIn]);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1);
  }, [current, goTo]);

  const goBack = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    startTimeRef.current = performance.now();
    const tick = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const pct = Math.min((elapsed / AUTO_PLAY_DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= AUTO_PLAY_DURATION) {
        next();
        startTimeRef.current = performance.now();
      }
      autoPlayRef.current = requestAnimationFrame(tick);
    };
    autoPlayRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(autoPlayRef.current);
  }, [next]);

  // Animate content in on mount
  useEffect(() => {
    const t = setTimeout(() => animateContentIn(1), 100);
    return () => clearTimeout(t);
  }, []);

  const slide = SLIDES[current];
  const accent = slide.accentColor;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --accent: ${accent};
          --transition: 0.65s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .main-banner-root {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 620px;
          overflow: hidden;
          
          font-family: 'Outfit', sans-serif;
        }

        /* ─── Slide Layers ─── */
        .banner-slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          /* This transition handles the background cross-fade */
          transition: opacity 0.8s ease-in-out; 
          opacity: 0;
          z-index: 0;
        }
        .banner-slide-bg.active {
          opacity: 1;
          z-index: 1;
          /* Optional: Keep the slow zoom for a cinematic effect */
          animation: slowZoom 10s ease-out forwards;
        }
        .banner-slide-bg.exiting {
          opacity: 0;
          z-index: 0;
          transition: opacity 0.8s ease-in-out;
        }
        @keyframes slowZoom {
          from { transform: scale(1.1); }
          to   { transform: scale(1.0); }
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        /* Noise grain texture */
        .banner-grain {
          position: absolute;
          inset: 0;
          z-index: 3;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* New UI Overlay Layer */
        .banner-ui-overlay {
            position: absolute;
            bottom: 40px;
            left: 0;
            right: 0;
            z-index: 20;
            pointer-events: none;
        }

        .banner-ui-overlay .container {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            pointer-events: auto;
        }

        /* ─── Content ─── */
        .banner-inner {
            position: relative;
            z-index: 10;
            height: 100%;
            display: flex;
            align-items: flex-end;
            padding-bottom: 140px; /* Increased to make room for counter/indicators */
        }

        .slide-content-wrap {
          max-width: 1420px;
          width: 100%;
        }

        .slide-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${accent};
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 2px;
          margin-bottom: 20px;
          will-change: transform, opacity;
        }
        .slide-tag::before {
          content: '';
          width: 6px; height: 6px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          display: inline-block;
        }

        .slide-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 8.5vw, 110px);
          line-height: 0.95;
          color: #fff;
          margin: 0 0 22px;
          letter-spacing: 0.01em;
        }
        .title-word {
          margin-right: 6px;
          will-change: transform, opacity, filter;
        }
        .title-word.highlight {
          color: ${accent};
          -webkit-text-stroke: 0px;
        }
        .title-word.outline {
          -webkit-text-stroke: 1.5px rgba(255,255,255,1);
          color: transparent;
        }

        .slide-desc {
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,1);
          line-height: 1.65;
          max-width: 440px;
          margin-bottom: 28px;
          will-change: transform, opacity, filter;
        }

        .slide-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 34px;
          will-change: transform, opacity, filter;
        }
        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1px solid rgba(255,255,255,1);
          border-radius: 4px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .meta-badge.quality {
          border-color: ${accent};
          color: ${accent};
          background: ${accent}18;
        }
        .meta-badge svg { opacity: 0.65; }
        .meta-divider {
          width: 4px; height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
        }
        .meta-cats {
          display: flex;
          gap: 8px;
        }
        .meta-cat {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
        }
        .meta-cat:hover { color: ${accent}; }
        .meta-cat:not(:last-child)::after {
          content: ' /';
          color: rgba(255,255,255,0.2);
        }

        /* ─── Buttons ─── */
        .slide-btn-group {
          display: flex;
          align-items: center;
          gap: 16px;
          will-change: transform, opacity, filter;
        }
        .slide-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 3px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          border: none;
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
          text-decoration: none;
          white-space: nowrap;
        }
        .btn-primary {
          background: ${accent};
          color: #fff;
          box-shadow: 0 8px 30px ${accent}55;
        }
        .btn-primary:hover {
          background: #fff;
          color: #111;
          box-shadow: 0 12px 40px rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          transform: translateY(-2px);
        }
        .btn-play-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px; height: 22px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ─── Navigation ─── */
        .banner-nav {
          position: absolute;
          z-index: 20;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .banner-nav.nav-left { left: 32px; }
        .banner-nav.nav-right { right: 32px; }

        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px; height: 52px;
          border-radius: 3px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.25s ease;
          backdrop-filter: blur(12px);
        }
        .nav-btn:hover {
          background: ${accent};
          border-color: ${accent};
          color: #fff;
          box-shadow: 0 6px 24px ${accent}55;
          transform: scale(1.06);
        }
        .nav-btn:active { transform: scale(0.96); }

        /* ─── Slide Indicators & Progress ─── */
        .banner-indicators {
            position: relative; /* Changed from absolute */
            bottom: auto;
            right: auto;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .indicator-item {
          position: relative;
          cursor: pointer;
        }
        .indicator-track {
          width: 48px;
          height: 2px;
          background: rgba(255,255,255,0.18);
          border-radius: 2px;
          overflow: hidden;
          transition: width 0.3s ease;
        }
        .indicator-item.active .indicator-track {
          width: 72px;
        }
        .indicator-fill {
          height: 100%;
          background: ${accent};
          border-radius: 2px;
          transition: width 0.1s linear;
        }
        .indicator-num {
          display: block;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          margin-bottom: 5px;
          text-align: center;
          transition: color 0.3s;
        }
        .indicator-item.active .indicator-num {
          color: ${accent};
        }

        /* ─── Slide Counter ─── */
        .banner-counter {
            position: relative; /* Changed from absolute */
            bottom: auto;
            left: auto;
            display: flex;
            align-items: baseline;
            gap: 2px;
        }
        .counter-current {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          line-height: 1;
          color: rgba(255,255,255,0.12);
          letter-spacing: 0.02em;
          transition: color 0.5s;
        }
        .counter-sep {
          font-size: 13px;
          color: rgba(255,255,255,0.15);
          margin: 0 2px;
        }
        .counter-total {
          font-size: 13px;
          color: rgba(255,255,255,0.25);
          font-weight: 300;
        }

        /* ─── Scroll indicator ─── */
        .banner-scroll {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.4;
          animation: scrollBob 2.2s ease-in-out infinite;
        }
        @keyframes scrollBob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(242,140,40,0.85));
        }
        .scroll-text {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          writing-mode: horizontal-tb;
        }

        /* ─── Top bar ─── */
        .banner-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 15;
          height: 120px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%);
          pointer-events: none;
        }
        .banner_controls{
            padding: 0 3vw;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .banner-inner {
            padding-bottom: 120px;
          }
          .banner-ui-overlay {
            bottom: 20px;
        }
          .slide-title {
            font-size: clamp(40px, 12vw, 70px);
          }
          .banner-nav.nav-left { left: 14px; }
          .banner-nav.nav-right { right: 14px; }
          .nav-btn { width: 40px; height: 40px; }
        }
      `}</style>

      <ModalVideo
        channel='youtube'
        autoplay
        isOpen={isOpen}
        videoId={activeVideo}
        onClose={() => setOpen(false)}
      />

      <section className="main-banner-root" ref={slideRef}>

        {/* Background layers */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`banner-slide-bg ${i === current ? 'active' : i === prev ? 'exiting' : ''}`}
            style={{
              backgroundImage: `url(${s.bg})`,
              opacity: i === current ? 1 : i === prev ? 0 : 0,
            }}
          />
        ))}

        {/* Gradient overlay — changes with slide */}
        

        {/* Bottom vignette */}
        <div
          className="banner-overlay"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 180%)', zIndex: 4 }}
        />

        {/* Grain */}
        <div className="banner-grain" />

        {/* Top fade */}
        <div className="banner-topbar" />

        {/* ── Content ── */}
        <div className="banner-inner">
        <div className="container custom-container"> {/* Bootstrap container for horizontal alignment */}
            <div className="slide-content-wrap" ref={contentRef}>
            <span className="slide-tag">{slide.tag}</span>

            <h2 className="slide-title">
                {slide.title.map((word, i) => (
                <span
                    key={i}
                    className={`title-word ${i === slide.titleHighlight ? 'highlight' : i === slide.title.length - 1 ? 'outline' : ''}`}
                >
                    {word}
                </span>
                ))}
            </h2>

            <p className="slide-desc">{slide.description}</p>

            <div className="slide-meta">
                <span className="meta-badge quality">{slide.quality}</span>
                <span className="meta-badge">{slide.rating}</span>
                <span className="meta-divider" />
                <div className="meta-cats">
                {slide.categories.map((cat, i) => (
                    <a href="#" key={i} className="meta-cat">{cat}</a>
                ))}
                </div>
                <span className="meta-divider" />
                <span className="meta-badge">
                <FaCalendarAlt size={10} style={{ color: accent }} /> {slide.year}
                </span>
                <span className="meta-badge">
                <FaClock size={10} style={{ color: accent }} /> {slide.duration}
                </span>
                
            </div>

            <div className="slide-btn-group">
                <button
                className="slide-btn btn-primary"
                onClick={() => { setActiveVideo(slide.videoId); setOpen(true); }}
                >
                <span className="btn-play-icon"><FaPlay size={8} /></span>
                Watch Now
                </button>
                
            </div>
            </div>
        </div>
        </div>

        {/* ── UI Overlay Controls (Relative to Container) ── */}
        <div className="banner-ui-overlay">
        <div className="banner_controls">
            {/* Slide Counter aligned to left gutter */}
            <div className="banner-counter">
            <span className="counter-current">0{current + 1}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">0{SLIDES.length}</span>
            </div>

            {/* Progress Indicators aligned to right gutter */}
            <div className="banner-indicators">
            {SLIDES.map((s, i) => (
                <div
                key={s.id}
                className={`indicator-item ${i === current ? 'active' : ''}`}
                onClick={() => i !== current && goTo(i, i > current ? 1 : -1)}
                role="button"
                >
                <span className="indicator-num">0{i + 1}</span>
                <div className="indicator-track">
                    <div
                    className="indicator-fill"
                    style={{
                        width: i === current ? `${progress}%` : i < current ? '100%' : '0%',
                        background: SLIDES[i].accentColor,
                    }}
                    />
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>

        {/* ── Left Nav ── */}
        <div className="banner-nav nav-left">
          <button className="nav-btn" onClick={goBack} aria-label="Previous slide">
            <FaChevronLeft size={16} />
          </button>
        </div>

        {/* ── Right Nav ── */}
        <div className="banner-nav nav-right">
          <button className="nav-btn" onClick={next} aria-label="Next slide">
            <FaChevronRight size={16} />
          </button>
        </div>

        {/* ── Slide Counter ── */}
        <div className="banner-counter">
          <span className="counter-current">0{current + 1}</span>
          <span className="counter-sep">/</span>
          <span className="counter-total">0{SLIDES.length}</span>
        </div>

        {/* ── Progress Indicators ── */}
        <div className="banner-indicators">
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={`indicator-item ${i === current ? 'active' : ''}`}
              onClick={() => i !== current && goTo(i, i > current ? 1 : -1)}
              role="button"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span className="indicator-num">0{i + 1}</span>
              <div className="indicator-track">
                <div
                  className="indicator-fill"
                  style={{
                    width: i === current ? `${progress}%` : i < current ? '100%' : '0%',
                    background: SLIDES[i].accentColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Scroll Hint ── */}
        <div className="banner-scroll">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line" />
        </div>

      </section>
    </>
  );
}

export default MainBanner;