"use client";
import { useState, useRef } from "react";

export default function CategorySlider({ categories = [], activeCategory = 0, onCategoryChange }) {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 220, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  const onPointerDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4;
    if (Math.abs(x - startX.current) > 4) hasDragged.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
    updateScrollState();
  };

  const onPointerUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleCategoryClick = (id) => {
    if (!hasDragged.current) {
      onCategoryChange?.(id);
    }
  };

  const btnBase = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "1px solid rgba(242,140,40,0.45)",
    background: "rgba(13,13,18,0.9)",
    color: "#f28c28",
    fontSize: "20px",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(6px)",
    transition: "background 0.2s, box-shadow 0.2s, opacity 0.2s",
    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
    padding: 0,
  };

  return (
    <div className="category-slider-root" style={{ position: "relative", width: "100%", userSelect: "none" }}>
      {/* Left edge gradient */}
      <div
        className="category-slider-fade category-slider-fade--left"
        style={{
          opacity: canScrollLeft ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      {/* Right edge gradient */}
      <div
        className="category-slider-fade category-slider-fade--right"
        style={{
          opacity: canScrollRight ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Left nav button */}
      <button
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        style={{
          ...btnBase,
          left: 0,
          opacity: canScrollLeft ? 1 : 0,
          pointerEvents: canScrollLeft ? "auto" : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(242,140,40,0.18)";
          e.currentTarget.style.boxShadow = "0 0 14px rgba(242,140,40,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(13,13,18,0.9)";
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.5)";
        }}
      >
        ‹
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="category-slider-track"
        onScroll={updateScrollState}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ cursor: "grab" }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`category-slider-pill${isActive ? " category-slider-pill--active" : ""}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Right nav button */}
      <button
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        style={{
          ...btnBase,
          right: 0,
          opacity: canScrollRight ? 1 : 0,
          pointerEvents: canScrollRight ? "auto" : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(242,140,40,0.18)";
          e.currentTarget.style.boxShadow = "0 0 14px rgba(242,140,40,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(13,13,18,0.9)";
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.5)";
        }}
      >
        ›
      </button>
    </div>
  );
}
