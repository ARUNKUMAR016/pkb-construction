import React from 'react';
import { content } from '../data/content';
import { images } from '../data/images';
import ImageOptimized from './ImageOptimized';
import { Home, Building2, Hammer, LayoutGrid } from 'lucide-react';

const iconMap = {
  Home: Home,
  Briefcase: Building2,
  Wrench: Hammer,
  Layout: LayoutGrid,
};

export default function Services() {
  const { services } = content;

  // Layout styles for asymmetric grid:
  // Item 1 (Residential) -> Span 2 cols on desktop
  // Item 2 (Commercial) -> Span 1 col on desktop
  // Item 3 (Renovation) -> Span 1 col on desktop
  // Item 4 (Interior) -> Span 2 cols on desktop
  const gridClasses = [
    'md:col-span-2 flex-col md:flex-row', // Item 1
    'md:col-span-1 flex-col',             // Item 2
    'md:col-span-1 flex-col',             // Item 3
    'md:col-span-2 flex-col md:flex-row', // Item 4
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-primary border-t border-panel/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[2px] w-6 bg-accent" />
            <span className="font-heading text-accent text-sm font-semibold tracking-widest uppercase">
              What We Do
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-textLight uppercase mb-4">
            {services.sectionTitle}
          </h2>
          <p className="font-body text-base text-textMuted max-w-2xl leading-relaxed">
            {services.sectionSubtitle}
          </p>
        </div>

        {/* Asymmetric Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.items.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Home;
            const gridLayout = gridClasses[index] || 'md:col-span-1';
            const imgKey = service.id; // residential, commercial, renovation, interior
            const imageSrc = images.services[imgKey];

            return (
              <div
                key={service.id}
                className={`flex bg-secondary border border-panel hover:border-accent/40 transition-all duration-300 group overflow-hidden ${gridLayout}`}
              >
                
                {/* Visual Area (Half width on multi-span layout, full height on others) */}
                <div className={`relative overflow-hidden w-full ${gridLayout.includes('md:col-span-2') ? 'md:w-1/2 min-h-[220px]' : 'h-48'}`}>
                  <ImageOptimized
                    src={imageSrc}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle dark industrial screen overlay */}
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-all duration-300" />
                </div>

                {/* Content Area */}
                <div className={`p-6 md:p-8 flex flex-col justify-between ${gridLayout.includes('md:col-span-2') ? 'md:w-1/2' : 'w-full'}`}>
                  <div>
                    {/* Header: Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-panel p-3 text-accent group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-textLight uppercase tracking-wide">
                        {service.title}
                      </h3>
                    </div>

                    <p className="font-body text-sm text-textMuted leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Bullet features */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 border-t border-panel/50 pt-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-textLight font-heading font-medium tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
