import React, { useState, useRef, useEffect } from 'react';
import { images } from '../data/images';
import ImageOptimized from './ImageOptimized';

/**
 * BeforeAfterSlider: An interactive project image slider.
 * Allows users to drag a slider handle to compare a construction site
 * from its raw phase (Before) to its completed phase (After).
 * This serves as the signature visual moment for the website.
 */
export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Structural Card Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden border border-panel bg-secondary aspect-[16/10] md:aspect-[16/9] cursor-ew-resize select-none"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX);
          }
        }}
      >
        {/* "After" Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={images.beforeAfter.after} 
            alt={images.beforeAfter.afterLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-primary/80 border border-panel px-3 py-1 text-xs md:text-sm font-heading font-semibold tracking-wider text-accent uppercase">
            {images.beforeAfter.afterLabel}
          </div>
        </div>

        {/* "Before" Image (Foreground with Clip Path) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
        >
          <img 
            src={images.beforeAfter.before} 
            alt={images.beforeAfter.beforeLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-primary/80 border border-panel px-3 py-1 text-xs md:text-sm font-heading font-semibold tracking-wider text-textLight uppercase">
            {images.beforeAfter.beforeLabel}
          </div>
        </div>

        {/* Interactive Handle Line */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-accent cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Drag Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-accent border-4 border-secondary shadow-lg flex items-center justify-center cursor-ew-resize hover:scale-105 active:scale-95 transition-transform"
          >
            {/* Minimal architectural arrows */}
            <svg 
              className="w-5 h-5 text-primary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 4 4 4m8-8l4 4-4 4" />
            </svg>
          </div>
        </div>

        {/* Instructions overlay (Fades out when drag starts) */}
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-primary/90 border border-panel text-[10px] md:text-xs font-heading font-semibold tracking-wider px-4 py-2 uppercase text-textMuted pointer-events-none transition-opacity duration-300 ${sliderPosition !== 50 || isDragging ? 'opacity-0' : 'opacity-100'}`}>
          Drag handle to inspect build quality
        </div>
      </div>
    </div>
  );
}
