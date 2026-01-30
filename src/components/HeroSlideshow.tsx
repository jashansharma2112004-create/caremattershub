import { useState, useEffect, useCallback, memo } from 'react';
import heroImage from '@/assets/hero-care-compressed.webp';
import heroSlide1 from '@/assets/hero-slide-1-compressed.webp';
import heroSlide2 from '@/assets/hero-slide-2-compressed.webp';
import heroSlide3 from '@/assets/hero-slide-3-compressed.webp';

// Slide data type
interface Slide {
  src: string;
  alt: string;
}

// All slides loaded immediately for fastest first paint
const SLIDES: Slide[] = [
  { src: heroImage, alt: 'Quality care and support services' },
  { src: heroSlide1, alt: 'Independence and mobility support' },
  { src: heroSlide2, alt: 'Community participation and social activities' },
  { src: heroSlide3, alt: 'Personalized care assistance' },
];

const HeroSlideshow = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    if (SLIDES.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <>
      {/* First slide - always render immediately for LCP */}
      <img
        src={SLIDES[0].src}
        alt={SLIDES[0].alt}
        width={1920}
        height={1080}
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
          currentSlide === 0 ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Remaining slides */}
      {SLIDES.slice(1).map((slide, index) => (
        <img
          key={index + 1}
          src={slide.src}
          alt={slide.alt}
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            index + 1 === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Slide indicators */}
      {SLIDES.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {SLIDES.map((_, index) => (
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
