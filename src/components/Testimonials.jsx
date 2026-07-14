import React from 'react';
import { content } from '../data/content';
import { images } from '../data/images';
import ImageOptimized from './ImageOptimized';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const { testimonials } = content;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-secondary border-t border-panel/50 relative overflow-hidden">
      {/* Decorative architectural layout grid lines */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-accent" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-accent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-[2px] w-6 bg-accent" />
            <span className="font-heading text-accent text-sm font-semibold tracking-widest uppercase">
              CLIENT TESTIMONY
            </span>
            <span className="h-[2px] w-6 bg-accent" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-textLight uppercase">
            {testimonials.sectionTitle}
          </h2>
        </div>

        {/* Premium Single Featured Quote Block */}
        <div className="bg-primary border border-panel relative p-8 md:p-14 shadow-2xl">
          
          {/* Top Quote Icon */}
          <div className="absolute -top-6 left-8 md:left-14 bg-accent p-4 text-primary shadow-lg">
            <Quote className="h-6 w-6 transform rotate-180" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start pt-4">
            
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-none border border-panel overflow-hidden p-1 bg-secondary">
                <ImageOptimized
                  src={images.testimonialAuthor}
                  alt={testimonials.author}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Quote details */}
            <div className="flex-grow text-center md:text-left">
              <blockquote className="font-heading font-medium text-lg md:text-2xl text-textLight tracking-wide leading-relaxed mb-6 italic">
                "{testimonials.quote}"
              </blockquote>
              
              {/* Divider */}
              <div className="h-[1px] w-12 bg-accent/40 my-4 mx-auto md:mx-0" />

              <div>
                <cite className="not-italic font-heading text-base md:text-lg font-bold text-accent tracking-wider uppercase block">
                  {testimonials.author}
                </cite>
                <span className="font-heading text-xs text-textMuted tracking-wider uppercase mt-1 block">
                  {testimonials.role} &mdash; <span className="text-textLight">{testimonials.location}</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
