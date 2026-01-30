import { useState, useEffect, useCallback, memo, useRef } from 'react';

// First slide - eagerly loaded for instant LCP
import heroSlide1 from '@/assets/hero-slide-1.webp';

// Slide data type
interface Slide {
  src: string;
  alt: string;
}

// First slide loaded statically, rest loaded dynamically
const FIRST_SLIDE: Slide = { 
  src: heroSlide1, 
  alt: 'Quality care and support services' 
};

// Paths for lazy-loaded slides
const LAZY_SLIDE_IMPORTS = [
  () => import('@/assets/hero-slide-2.webp'),
  () => import('@/assets/hero-slide-3.webp'),
  () => import('@/assets/hero-slide-4.webp'),
];

const LAZY_SLIDE_ALTS = [
  'Community participation and creative activities',
  'Social activities and community connection',
  'Personalized nursing care assistance',
];

const HeroSlideshow = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lazySlides, setLazySlides] = useState<Slide[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([true]); // First slide is always loaded
  const [isPageReady, setIsPageReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Wait for page to be fully rendered before starting slideshow
  useEffect(() => {
    // Use requestAnimationFrame to ensure first paint is complete
    const raf = requestAnimationFrame(() => {
      // Then use a small timeout to ensure everything is settled
      const timer = setTimeout(() => {
        setIsPageReady(true);
      }, 100);
      return () => clearTimeout(timer);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lazy load remaining slides after initial render
  useEffect(() => {
    if (!isPageReady) return;

    const loadSlides = async () => {
      const slides: Slide[] = [];
      const loadedStates: boolean[] = [true]; // First slide already loaded
      
      for (let i = 0; i < LAZY_SLIDE_IMPORTS.length; i++) {
        try {
          const module = await LAZY_SLIDE_IMPORTS[i]();
          const src = module.default;
          slides.push({ src, alt: LAZY_SLIDE_ALTS[i] });
          loadedStates.push(false); // Will be set true when image actually loads
        } catch (error) {
          console.error(`Failed to load slide ${i + 2}:`, error);
        }
      }
      
      setLazySlides(slides);
      setImagesLoaded(loadedStates);
    };

    loadSlides();
  }, [isPageReady]);

  // All slides combined
  const allSlides = [FIRST_SLIDE, ...lazySlides];

  // Auto-advance slideshow only after page is ready and we have slides
  useEffect(() => {
    if (!isPageReady || allSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPageReady, allSlides.length]);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0"
      style={{ 
        // Warm neutral fallback matching the image tones - prevents flash
        backgroundColor: '#f5f0eb' 
      }}
    >
      {/* First slide - always render immediately for LCP, no overlay */}
      <div className="absolute inset-0">
        {/* Blur placeholder for first slide */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            imagesLoaded[0] ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundColor: '#f5f0eb',
            filter: 'blur(20px)',
          }}
        />
        <img
          src={FIRST_SLIDE.src}
          alt={FIRST_SLIDE.alt}
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          onLoad={() => handleImageLoad(0)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            currentSlide === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Lazy-loaded slides with blur-up effect */}
      {lazySlides.map((slide, index) => {
        const slideIndex = index + 1;
        const isLoaded = imagesLoaded[slideIndex] ?? false;
        
        return (
          <div 
            key={slideIndex}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Blur placeholder */}
            <div 
              className={`absolute inset-0 transition-opacity duration-500 ${
                isLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                backgroundColor: '#f5f0eb',
                filter: 'blur(20px)',
              }}
            />
            <img
              src={slide.src}
              alt={slide.alt}
              width={1920}
              height={1080}
              loading="lazy"
              decoding="async"
              onLoad={() => handleImageLoad(slideIndex)}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        );
      })}

      {/* Slide indicators - only show when we have multiple slides */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideClick(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8 shadow-lg'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

HeroSlideshow.displayName = 'HeroSlideshow';

export default HeroSlideshow;
