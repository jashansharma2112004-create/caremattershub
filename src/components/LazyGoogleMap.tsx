import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface LazyGoogleMapProps {
  src: string;
  title: string;
  height?: number;
  className?: string;
}

const LazyGoogleMap = ({ src, title, height = 300, className = '' }: LazyGoogleMapProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before it comes into view
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative bg-muted ${className}`}
      style={{ height }}
    >
      {!isVisible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <MapPin className="h-8 w-8 mb-2" />
          <span className="text-sm">Loading map...</span>
        </div>
      )}
      {isVisible && (
        <iframe
          src={src}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className={`pointer-events-none transition-opacity duration-300 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setHasLoaded(true)}
        />
      )}
    </div>
  );
};

export default LazyGoogleMap;
