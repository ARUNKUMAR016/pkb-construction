import React from 'react';
import { content } from '../data/content';
import BeforeAfterSlider from './BeforeAfterSlider';
import { ShieldCheck, HardHat, Award, BadgeCheck } from 'lucide-react';

export default function WhyChooseUs() {
  const { whyChooseUs } = content;

  // Let's map each trust point to an icon for rich aesthetics
  const icons = [
    BadgeCheck, // No Hidden Costs
    Award,       // Industrial-Grade Quality
    ShieldCheck, // Direct Owner Accountability
    HardHat      // Zero-Incident Safety Record
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 bg-primary border-t border-panel/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Tagline and Signature Before/After Moment (Span 7) */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-[2px] w-6 bg-accent" />
                <span className="font-heading text-accent text-sm font-semibold tracking-widest uppercase">
                  Our Standards
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-textLight uppercase mb-4">
                {whyChooseUs.sectionTitle}
              </h2>
              <p className="font-body text-base text-textMuted max-w-2xl leading-relaxed">
                {whyChooseUs.sectionSubtitle}
              </p>
            </div>

            {/* Signature visual moment embedded here */}
            <div className="mt-8 border border-panel bg-secondary p-2 shadow-2xl">
              <BeforeAfterSlider />
            </div>
          </div>

          {/* Right Side: Trust Points (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            {whyChooseUs.items.map((item, index) => {
              const Icon = icons[index] || BadgeCheck;

              return (
                <div
                  key={index}
                  className="p-6 bg-secondary border-l-4 border-accent border-y border-r border-panel flex items-start gap-4 transition-all duration-300 hover:bg-secondary/80 hover:translate-x-1"
                >
                  <div className="bg-panel p-2.5 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-textLight uppercase tracking-wider mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs text-textMuted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
