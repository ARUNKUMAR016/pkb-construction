import React from 'react';
import { content } from '../data/content';

/**
 * Logo component for BuildCo.
 * Centralized in a single file so that replacing it with an SVG or image logo later is simple.
 */
export default function Logo({ className = '' }) {
  return (
    <a href="#" className={`flex items-center gap-2 group focus:outline-none ${className}`}>
      {/* Heavy geometric icon placeholder to represent concrete block / engineering */}
      <span className="bg-accent text-primary p-2 font-heading font-bold text-lg md:text-xl tracking-tighter transition-colors duration-200 group-hover:bg-accentDark">
        B
      </span>
      <span className="font-heading text-lg md:text-2xl font-bold tracking-wider text-textLight uppercase">
        BUILD<span className="text-accent group-hover:text-accentDark transition-colors duration-200">CO</span>
      </span>
    </a>
  );
}
