import { useState, useEffect } from 'react';
import heroSlide1 from '@/assets/hero-slide-1.png';
import heroSlide2 from '@/assets/hero-slide-2.png';
import heroSlide3 from '@/assets/hero-slide-3.png';
import heroImage from '@/assets/hero-care.jpg';

const slides = [
  { src: heroImage, alt: 'Quality care and support services' },
  { src: heroSlide1, alt: 'Independence and mobility support' },
  { src: heroSlide2, alt: 'Community participation and social activities' },
  { src: heroSlide3, alt: 'Personalized care assistance' },
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.src}
          alt={slide.alt}
          fetchPriority={index === 0 ? 'high' : undefined}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default HeroSlideshow;
