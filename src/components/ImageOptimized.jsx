import React, { useState } from 'react';

/**
 * ImageOptimized component for performance-critical image loading.
 * Features:
 * - Lazy loads images using native loading="lazy".
 * - Shows an animated concrete-grey skeleton loader while loading to avoid layout shifts.
 * - Smoothly fades in the image once it finishes loading.
 * - Ready for simple replacement with Cloudinary or WebP URLs in the future.
 */
export default function ImageOptimized({ src, alt, className = '', ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-secondary ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 w-full h-full bg-panel/30 animate-pulse flex items-center justify-center">
          {/* Subtle structural texture or logo icon in skeleton */}
          <div className="w-12 h-12 rounded border-2 border-panel/50 border-t-accent animate-spin" />
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
