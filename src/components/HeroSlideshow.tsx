import { useState, useEffect, useCallback } from 'react';
import heroImage from '@/assets/hero-care-optimized.webp';

// Defer loading other slides to reduce LCP blocking
const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Array<{ src: string; alt: string }>>([
    { src: heroImage, alt: 'Quality care and support services' },
  ]);

  // Load remaining slides after initial paint
  useEffect(() => {
    const loadRemainingSlides = async () => {
      const [slide1, slide2, slide3] = await Promise.all([
        import('@/assets/hero-slide-1-optimized.webp'),
        import('@/assets/hero-slide-2-optimized.webp'),
        import('@/assets/hero-slide-3-optimized.webp'),
      ]);
      
      setLoadedSlides([
        { src: heroImage, alt: 'Quality care and support services' },
        { src: slide1.default, alt: 'Independence and mobility support' },
        { src: slide2.default, alt: 'Community participation and social activities' },
        { src: slide3.default, alt: 'Personalized care assistance' },
      ]);
    };

    // Delay loading until after LCP - use setTimeout as fallback for Safari
    let timer: ReturnType<typeof setTimeout> | number;
    
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window && typeof (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback === 'function') {
      timer = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => loadRemainingSlides());
    } else {
      timer = setTimeout(loadRemainingSlides, 2000);
    }

    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && typeof (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback === 'function') {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(timer as number);
      } else {
        clearTimeout(timer);
      }
    };
  }, []);

  useEffect(() => {
    if (loadedSlides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % loadedSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [loadedSlides.length]);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <>
      {loadedSlides.map((slide, index) => (
        <img
          key={index}
          src={slide.src}
          alt={slide.alt}
          width={1920}
          height={1080}
          fetchPriority={index === 0 ? 'high' : undefined}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding={index === 0 ? 'sync' : 'async'}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {/* Slide indicators - only show when all slides loaded */}
      {loadedSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {loadedSlides.map((_, index) => (
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
};

export default HeroSlideshow;
