import { useState, useEffect } from "react";
import { getSlides, subscribeToStore } from "../lib/dataStore";
import type { SlideData } from "../lib/dataStore";

export default function Slideshow() {
  const [slides, setSlides] = useState<SlideData[]>(getSlides());
  const [index, setIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    return subscribeToStore((store) => {
      setSlides(store.slides);
      setIndex(1); // Reset index to avoid edge index out of bounds
    });
  }, []);

  const displaySlides = slides.length > 0 
    ? [slides[slides.length - 1], ...slides, slides[0]] 
    : [];

  // Handle seamless looping reset
  useEffect(() => {
    if (slides.length === 0) return;
    if (index === displaySlides.length - 1) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(1);
      }, 700);
      return () => clearTimeout(timeout);
    }
    if (index === 0) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(slides.length);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [index, displaySlides.length, slides.length]);

  // Autoplay timer
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [index, slides.length]); // Reset timer when index or slides count changes

  const handleNext = () => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setIndex((prev) => {
      if (prev >= displaySlides.length - 1) return prev;
      return prev + 1;
    });
  };

  const handlePrev = () => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setIndex((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
  };

  const getActiveDotIndex = () => {
    if (slides.length === 0) return 0;
    if (index === 0) return slides.length - 1;
    if (index === displaySlides.length - 1) return 0;
    return index - 1;
  };

  if (slides.length === 0) return null;

  return (
    <section className="slideshow-section page-section">
      <div className="container">
        <div className="slideshow-container animate-on-scroll">
          <div 
            className="slideshow-track" 
            style={{ 
              transform: `translateX(-${index * 100}%)`,
              transition: isTransitioning ? 'transform 0.65s cubic-bezier(0.45, 0, 0.15, 1)' : 'none',
              display: 'flex'
            }}
          >
            {displaySlides.map((slide, i) => (
              <div key={i} className={`slide ${i === index ? 'slide--active' : ''}`} style={{ flex: '0 0 100%' }}>
                <img src={slide.img.startsWith("images/") ? `/${slide.img}` : slide.img} alt={`Slide ${i}`} />
                <div className="slide__caption">{slide.caption}</div>
              </div>
            ))}
          </div>

          <button className="slideshow-btn prev-btn" aria-label="Previous Slide" onClick={handlePrev}>❮</button>
          <button className="slideshow-btn next-btn" aria-label="Next Slide" onClick={handleNext}>❯</button>

          <div className="slideshow-dots">
            {slides.map((_, i) => (
              <span 
                key={i} 
                className={`dot ${i === getActiveDotIndex() ? 'dot--active' : ''}`} 
                onClick={() => {
                  setIsTransitioning(true);
                  setIndex(i + 1);
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
