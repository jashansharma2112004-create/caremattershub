import { useState, useEffect, useCallback, memo } from 'react';
import heroImage from '@/assets/hero-care-compressed.webp';

// Slide data type
interface Slide {
  src: string;
  alt: string;
}

// Static first slide for immediate LCP
const INITIAL_SLIDE: Slide = {
  src: heroImage,
  alt: 'Quality care and support services',
};

// Defer loading other slides to reduce LCP blocking
const HeroSlideshow = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allSlidesLoaded, setAllSlidesLoaded] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([INITIAL_SLIDE]);

  // Load remaining slides after initial paint using IntersectionObserver
  useEffect(() => {
    let cancelled = false;

    const loadRemainingSlides = async () => {
      try {
        const [slide1, slide2, slide3] = await Promise.all([
          import('@/assets/hero-slide-1-compressed.webp'),
          import('@/assets/hero-slide-2-compressed.webp'),
          import('@/assets/hero-slide-3-compressed.webp'),
        ]);

        if (cancelled) return;

        setSlides([
          INITIAL_SLIDE,
          { src: slide1.default, alt: 'Independence and mobility support' },
          { src: slide2.default, alt: 'Community participation and social activities' },
          { src: slide3.default, alt: 'Personalized care assistance' },
        ]);
        setAllSlidesLoaded(true);
      } catch (error) {
        console.error('Failed to load slideshow images:', error);
      }
    };

    // Use requestIdleCallback with fallback for Safari/mobile
    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => loadRemainingSlides(), { timeout: 3000 });
        return () => window.cancelIdleCallback(id);
      } else {
        const timer = setTimeout(loadRemainingSlides, 1500);
        return () => clearTimeout(timer);
      }
    };

    const cleanup = scheduleLoad();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // Auto-advance slideshow only after all slides loaded
  useEffect(() => {
    if (!allSlidesLoaded || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allSlidesLoaded, slides.length]);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <>
      {/* First slide - always render immediately for LCP */}
      <img
        src={INITIAL_SLIDE.src}
        alt={INITIAL_SLIDE.alt}
        width={1920}
        height={1080}
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
          currentSlide === 0 ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Remaining slides - only render after loaded */}
      {allSlidesLoaded &&
        slides.slice(1).map((slide, index) => (
          <img
            key={index + 1}
            src={slide.src}
            alt={slide.alt}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
              index + 1 === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

      {/* Slide indicators - only show when all slides loaded */}
      {allSlidesLoaded && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideClick(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
});

HeroSlideshow.displayName = 'HeroSlideshow';

export default HeroSlideshow;
