import React from 'react';
import Logo from './Logo';
import { content } from '../data/content';
import { ArrowUp, HardHat } from 'lucide-react';

export default function Footer() {
  const { business } = content;
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary border-t border-panel text-textLight">
      
      {/* Top Footer Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Logo & Description block (Span 5) */}
          <div className="md:col-span-5 space-y-4">
            <Logo />
            <p className="font-body text-xs text-textMuted max-w-sm leading-relaxed pt-2">
              Licensed general contractor and structural engineers specializing in industrial shell construction, warehouse expansion, and deep foundation pours across South India.
            </p>
            
            {/* License details */}
            <div className="inline-flex items-center gap-2 bg-secondary/80 border border-panel px-3 py-1.5 text-[10px] font-heading font-medium tracking-widest text-textLight uppercase">
              <HardHat className="h-3.5 w-3.5 text-accent" />
              <span>Lic No: TN-MDU-625020-A1</span>
            </div>
          </div>

          {/* Quick links block (Span 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-xs text-accent font-semibold tracking-widest uppercase mb-4">
              Structural Navigation
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <a href="#services" className="font-heading text-xs text-textMuted hover:text-accent tracking-wider uppercase transition-colors">
                Capabilities
              </a>
              <a href="#portfolio" className="font-heading text-xs text-textMuted hover:text-accent tracking-wider uppercase transition-colors">
                Work Sites
              </a>
              <a href="#why-us" className="font-heading text-xs text-textMuted hover:text-accent tracking-wider uppercase transition-colors">
                Standards
              </a>
              <a href="#testimonials" className="font-heading text-xs text-textMuted hover:text-accent tracking-wider uppercase transition-colors">
                Trust
              </a>
              <a href="#contact" className="font-heading text-xs text-textMuted hover:text-accent tracking-wider uppercase transition-colors">
                Get Estimate
              </a>
            </div>
          </div>

          {/* Social connection block (Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading text-xs text-accent font-semibold tracking-widest uppercase mb-4">
              Connect With Us
            </h4>
            <p className="font-body text-xs text-textMuted leading-relaxed">
              We share site updates, heavy lift clips, and steel framing progress on our professional channels.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="LinkedIn"
                className="bg-secondary p-2.5 border border-panel text-textLight hover:text-accent hover:border-accent/40 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="bg-secondary p-2.5 border border-panel text-textLight hover:text-accent hover:border-accent/40 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Panel */}
      <div className="bg-secondary border-t border-panel py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-[10px] md:text-xs font-heading font-medium tracking-widest text-textMuted uppercase text-center sm:text-left">
            &copy; {currentYear} {business.name}. All Rights Reserved. &bull; Designed for Heavy Construction.
          </div>

          {/* Scroll to Top (tap target >= 44px) */}
          <button
            onClick={handleScrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-1.5 border border-panel bg-primary hover:bg-panel text-textLight px-4 py-2 font-heading text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors min-h-[44px]"
          >
            <span>Top of Site</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>

        </div>
      </div>

    </footer>
  );
}
