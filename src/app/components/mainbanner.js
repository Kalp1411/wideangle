'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { FaClock, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTicketAlt, FaGlobe } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "@/store/movieSlice";
import Link from "next/link";

const ACCENT = '#F28C28';
const AUTO_PLAY_DURATION = 7000;

function formatDuration(duration) {
  if (!duration) return '';
  const parts = duration.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function MainBanner() {
  const dispatch = useDispatch();
  const { nowstreamingmovies, loading } = useSelector((state) => state.movies);
  const slides = nowstreamingmovies || [];

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef(null);
  const startTimeRef = useRef(null);
  const slideRef = useRef(null);
  const contentRef = useRef(null);
  const gsapRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMovies({ is_now_streaming: 1 }));
  }, [dispatch]);

  useEffect(() => {
    const loadGsap = async () => {
      if (typeof window === 'undefined') return;
      try {
        const gsapModule = await import('gsap');
        gsapRef.current = gsapModule.gsap || gsapModule.default;
      } catch (e) {}
    };
    loadGsap();
  }, []);

  const animateContentIn = useCallback(() => {
    const gsap = gsapRef.current;
    if (!gsap || !contentRef.current) return;
    const el = contentRef.current;
    const items = el.querySelectorAll('.slide-tag, .title-word, .slide-desc, .slide-meta, .slide-btn-group');
    gsap.killTweensOf(items);
    gsap.set(items, { opacity: 0, y: 30, filter: 'blur(10px)' });
    gsap.to(items, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.05, ease: 'power3.out' });
  }, []);

  const animateContentOut = useCallback((onComplete) => {
    const gsap = gsapRef.current;
    if (!gsap || !contentRef.current) { onComplete?.(); return; }
    const el = contentRef.current;
    const items = el.querySelectorAll('.slide-tag, .title-word, .slide-desc, .slide-meta, .slide-btn-group');
    gsap.to(items, { opacity: 0, y: -20, filter: 'blur(10px)', duration: 0.4, stagger: 0.02, ease: 'power2.in', onComplete });
  }, []);

  const goTo = useCallback((nextIndex, dir) => {
    if (animating || nextIndex === current || slides.length < 2) return;
    setAnimating(true);
    animateContentOut(() => {
      setPrev(current);
      setCurrent(nextIndex);
      setProgress(0);
      startTimeRef.current = performance.now();
      setTimeout(() => {
        setAnimating(false);
        setPrev(null);
        animateContentIn();
      }, 50);
    });
  }, [animating, current, slides.length, animateContentOut, animateContentIn]);

  const next = useCallback(() => {
    if (!slides.length) return;
    goTo((current + 1) % slides.length, 1);
  }, [current, slides.length, goTo]);

  const goBack = useCallback(() => {
    if (!slides.length) return;
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (!slides.length) return;
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
  }, [next, slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    const t = setTimeout(() => animateContentIn(), 100);
    return () => clearTimeout(t);
  }, [slides.length]);

  if (loading.nowstreamingmovies) {
    return (
      <section style={{ height: '100vh', minHeight: '620px', background: '#080808' }} />
    );
  }

  if (!slides.length) return null;

  const slide = slides[current];
  const titleWords = slide.movie_name?.split(' ') || [];
  const categories = slide.category?.map(c => c.category_name) || [];
  const languages = slide.language?.map(l => l.language_name) || [];
  const movieTypes = slide.movie_type?.map(t => t.type_name) || [];
  const year = slide.start_date?.split('-')[0] || '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        .main-banner-root {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 620px;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        .banner-slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          transition: opacity 0.8s ease-in-out;
          opacity: 0;
          z-index: 0;
        }
        .banner-slide-bg.active {
          opacity: 1;
          z-index: 1;
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

        .banner-grain {
          position: absolute;
          inset: 0;
          z-index: 3;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

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

        .banner-inner {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          align-items: flex-end;
          padding-bottom: 140px;
        }

        .slide-content-wrap {
          max-width: 1420px;
          width: 100%;
        }

        .slide-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${ACCENT};
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
          margin: 0 0 28px;
          letter-spacing: 0.01em;
        }
        .title-word {
          display: inline-block;
          margin-right: 6px;
          will-change: transform, opacity, filter;
        }
        .title-word.highlight {
          color: ${ACCENT};
        }

        .slide-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 34px;
          will-change: transform, opacity, filter;
        }
        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 4px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .meta-badge.rating {
          border-color: ${ACCENT};
          color: ${ACCENT};
          background: ${ACCENT}18;
        }
        .meta-badge.type {
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6);
        }
        .meta-badge svg { opacity: 0.75; }
        .meta-divider {
          width: 4px; height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .meta-cats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .meta-cat {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
        }
        .meta-cat:not(:last-child)::after {
          content: ' /';
          color: rgba(255,255,255,0.2);
        }

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
          background: ${ACCENT};
          color: #fff;
          box-shadow: 0 8px 30px ${ACCENT}55;
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
        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px; height: 22px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .banner-nav {
          position: absolute;
          z-index: 20;
          top: 50%;
          transform: translateY(-50%);
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
          background: ${ACCENT};
          border-color: ${ACCENT};
          color: #fff;
          box-shadow: 0 6px 24px ${ACCENT}55;
          transform: scale(1.06);
        }
        .nav-btn:active { transform: scale(0.96); }

        .banner-indicators {
          position: relative;
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
          background: ${ACCENT};
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
          color: ${ACCENT};
        }

        .banner-counter {
          position: relative;
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
        }

        .banner-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 15;
          height: 120px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%);
          pointer-events: none;
        }

        .banner_controls {
          padding: 0 3vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Poster thumbnail strip */
        .slide-poster {
          position: absolute;
          bottom: 120px;
          right: 80px;
          z-index: 15;
          width: 120px;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
          border: 2px solid rgba(255,255,255,0.08);
          display: none;
        }
        .slide-poster img {
          width: 100%;
          height: auto;
          display: block;
        }

        @media (max-width: 768px) {
          .banner-inner { padding-bottom: 120px; }
          .banner-ui-overlay { bottom: 20px; }
          .slide-title { font-size: clamp(40px, 12vw, 70px); }
          .banner-nav.nav-left { left: 14px; }
          .banner-nav.nav-right { right: 14px; }
          .nav-btn { width: 40px; height: 40px; }
          .slide-poster { display: none; }
        }

        @media (min-width: 1024px) {
          .slide-poster { display: block; }
        }
      `}</style>

      <section className="main-banner-root" ref={slideRef}>

        {/* Background layers */}
        {slides.map((s, i) => {
          const bg = s.banner_image?.thumbnail?.['1920x1024'] || s.banner_image?.original || '';
          return (
            <div
              key={s.id}
              className={`banner-slide-bg ${i === current ? 'active' : i === prev ? 'exiting' : ''}`}
              style={{
                backgroundImage: bg ? `url(${bg})` : undefined,
                backgroundColor: '#0a0a14',
                opacity: i === current ? 1 : i === prev ? 0 : 0,
              }}
            />
          );
        })}

        {/* Side gradient overlay */}
        <div
          className="banner-overlay"
          style={{ background: 'linear-gradient(105deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.82) 38%, rgba(5,5,15,0.35) 68%, transparent 100%)' }}
        />

        {/* Bottom vignette */}
        <div
          className="banner-overlay"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)', zIndex: 4 }}
        />

        {/* Grain */}
        <div className="banner-grain" />

        {/* Top fade */}
        <div className="banner-topbar" />

        {/* Poster thumbnail */}
        {slide.image?.thumbnail?.['317x422'] && (
          <div className="slide-poster" style={{ zIndex: 15 }}>
            <img src={slide.image.thumbnail['317x422']} alt={slide.movie_name} />
          </div>
        )}

        {/* Content */}
        <div className="banner-inner">
          <div className="container custom-container">
            <div className="slide-content-wrap" ref={contentRef}>

              <span className="slide-tag">Now Streaming</span>

              <h2 className="slide-title">
                {titleWords.map((word, i) => (
                  <span
                    key={i}
                    className={`title-word ${i === titleWords.length - 1 ? 'highlight' : ''}`}
                  >
                    {word}
                  </span>
                //   <span
                //     key={i}
                //     className={`title-word ${i === slide.titleHighlight ? 'highlight' : i === slide.title.length - 1 ? 'outline' : ''}`}
                // >
                //     {word}
                // </span>
                ))}
              </h2>

              <div className="slide-meta">
                {slide.rating && (
                  <span className="meta-badge rating">{slide.rating}</span>
                )}
                {movieTypes.map(t => (
                  <span key={t} className="meta-badge type">{t}</span>
                ))}
                {categories.length > 0 && (
                  <>
                    <span className="meta-divider" />
                    <div className="meta-cats">
                      {categories.map((cat, i) => (
                        <span key={i} className="meta-cat">{cat}</span>
                      ))}
                    </div>
                  </>
                )}
                <span className="meta-divider" />
                {slide.totalduration && (
                  <span className="meta-badge">
                    <FaClock size={10} style={{ color: ACCENT }} />
                    {formatDuration(slide.totalduration)}
                  </span>
                )}
                {year && (
                  <span className="meta-badge">
                    <FaCalendarAlt size={10} style={{ color: ACCENT }} />
                    {year}
                  </span>
                )}
                {languages.length > 0 && (
                  <span className="meta-badge">
                    <FaGlobe size={10} style={{ color: ACCENT }} />
                    {languages.join(' / ')}
                  </span>
                )}
              </div>

              <div className="slide-btn-group">
                <Link href={`/movie/${slide.slug}`} className="slide-btn btn-primary">
                  <span className="btn-icon"><FaTicketAlt size={9} /></span>
                  Book Tickets
                </Link>
                <Link href={`/movie/${slide.slug}`} className="slide-btn btn-secondary">
                  More Info
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* UI overlay — counter + indicators */}
        <div className="banner-ui-overlay">
          <div className="banner_controls">
            <div className="banner-counter">
              <span className="counter-current">0{current + 1}</span>
              <span className="counter-sep">/</span>
              <span className="counter-total">0{slides.length}</span>
            </div>
            <div className="banner-indicators">
              {slides.map((s, i) => (
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
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Nav */}
        {slides.length > 1 && (
          <div className="banner-nav nav-left">
            <button className="nav-btn" onClick={goBack} aria-label="Previous slide">
              <FaChevronLeft size={16} />
            </button>
          </div>
        )}

        {/* Right Nav */}
        {slides.length > 1 && (
          <div className="banner-nav nav-right">
            <button className="nav-btn" onClick={next} aria-label="Next slide">
              <FaChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Scroll hint */}
        <div className="banner-scroll">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line" />
        </div>

      </section>
    </>
  );
}

export default MainBanner;
