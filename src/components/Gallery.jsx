import React, { useState, useMemo } from 'react';
import { images } from '../data/images';
import ImageOptimized from './ImageOptimized';
import { X, ChevronLeft, ChevronRight, MapPin, ZoomIn } from 'lucide-react';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null); // Track absolute index in filtered list

  // Centralized categories for filtering
  const categories = [
    { label: 'ALL BUILDS', value: 'all' },
    { label: 'COMMERCIAL', value: 'commercial' },
    { label: 'RESIDENTIAL', value: 'residential' },
    { label: 'RENOVATIONS', value: 'renovation' },
    { label: 'INTERIORS', value: 'interior' },
  ];

  // Memoize filtered project items
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return images.gallery;
    return images.gallery.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  // Navigation handlers for Lightbox
  const handlePrev = (e) => {
    e.stopPropagation();
    if (selectedProjectIndex === null) return;
    setSelectedProjectIndex((prev) => 
      prev === 0 ? filteredProjects.length - 1 : prev - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (selectedProjectIndex === null) return;
    setSelectedProjectIndex((prev) => 
      prev === filteredProjects.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-secondary border-t border-panel/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-xl mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[2px] w-6 bg-accent" />
              <span className="font-heading text-accent text-sm font-semibold tracking-widest uppercase">
                Project Showcase
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-textLight uppercase">
              RECENT WORK SITES
            </h2>
          </div>

          {/* Filters (min touch target 44px) */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveFilter(cat.value);
                  setSelectedProjectIndex(null);
                }}
                className={`px-4 py-2.5 font-heading text-xs font-semibold tracking-wider uppercase transition-colors duration-150 min-h-[44px] ${
                  activeFilter === cat.value
                    ? 'bg-accent text-primary'
                    : 'border border-panel bg-primary hover:bg-panel text-textLight'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-Style Grid using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => setSelectedProjectIndex(idx)}
              className="break-inside-avoid mb-6 bg-primary border border-panel hover:border-accent/40 transition-colors duration-300 group cursor-pointer overflow-hidden flex flex-col"
            >
              {/* Image optimized */}
              <div className="relative overflow-hidden w-full aspect-[4/3] md:aspect-auto">
                <ImageOptimized
                  src={project.src}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Heavy hover shadow / overlay */}
                <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-accent text-primary p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Title / Description */}
              <div className="p-5 border-t border-panel/50">
                <div className="flex items-center gap-1.5 text-[10px] font-heading font-semibold text-accent tracking-widest uppercase mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{project.location}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-textLight uppercase tracking-wide mb-1">
                  {project.title}
                </h3>
                <p className="font-body text-xs text-textMuted line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Lightbox Modal */}
        {selectedProjectIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-primary/95 flex flex-col justify-between items-center p-4 md:p-8 backdrop-blur-sm"
            onClick={() => setSelectedProjectIndex(null)}
          >
            {/* Top Bar: Close Button (tap target >= 44px) */}
            <div className="w-full flex justify-end">
              <button
                onClick={() => setSelectedProjectIndex(null)}
                className="bg-secondary p-3 text-textLight hover:text-accent hover:bg-panel transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Stage: Carousel Navigation + Image */}
            <div className="relative w-full max-w-4xl flex-grow flex items-center justify-center py-4">
              
              {/* Prev Button (tap target >= 44px) */}
              <button
                onClick={handlePrev}
                className="absolute left-0 md:-left-16 bg-secondary/80 p-3.5 text-textLight hover:text-accent hover:bg-panel transition-colors duration-150 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Lightbox image content */}
              <div 
                className="max-h-[60vh] md:max-h-[70vh] max-w-full flex items-center justify-center bg-secondary border border-panel"
                onClick={(e) => e.stopPropagation()} // Stop propagation to avoid close on image click
              >
                <img
                  src={filteredProjects[selectedProjectIndex].src}
                  alt={filteredProjects[selectedProjectIndex].title}
                  className="max-h-[60vh] md:max-h-[70vh] object-contain w-full"
                />
              </div>

              {/* Next Button (tap target >= 44px) */}
              <button
                onClick={handleNext}
                className="absolute right-0 md:-right-16 bg-secondary/80 p-3.5 text-textLight hover:text-accent hover:bg-panel transition-colors duration-150 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom details card */}
            <div
              className="w-full max-w-2xl bg-secondary border border-panel p-5 md:p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-heading font-semibold text-accent tracking-widest uppercase mb-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{filteredProjects[selectedProjectIndex].location}</span>
              </div>
              <h4 className="font-heading text-xl md:text-2xl font-bold text-textLight uppercase mb-2">
                {filteredProjects[selectedProjectIndex].title}
              </h4>
              <p className="font-body text-sm text-textMuted max-w-xl mx-auto">
                {filteredProjects[selectedProjectIndex].description}
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
