import React from 'react';
import { motion } from 'framer-motion';
import { content } from '../data/content';
import { images } from '../data/images';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const { hero, business } = content;

  // Orchestrated motion container settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center bg-primary overflow-hidden pt-20">
      {/* Background Image with heavy industrial grid/gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={images.heroBg}
          alt="BuildCo construction worker welding structural steel site"
          className="w-full h-full object-cover object-center filter brightness-[0.35]"
        />
        {/* Architectural layout overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Accent Label */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="font-heading text-accent text-sm md:text-base font-semibold tracking-widest uppercase">
              {hero.subtitle}
            </span>
          </motion.div>

          {/* Large Architectural Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-textLight uppercase leading-[0.95] mb-6"
          >
            {hero.title}
          </motion.h1>

          {/* Business description */}
          <motion.p
            variants={itemVariants}
            className="font-body text-base md:text-lg text-textMuted max-w-xl mb-8 leading-relaxed"
          >
            {business.description}
          </motion.p>

          {/* CTA Buttons (min touch target 44px) */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href={hero.ctaLink}
              className="bg-accent hover:bg-accentDark text-primary font-heading font-bold text-sm tracking-wider uppercase px-6 py-4 flex items-center justify-center gap-2 transition-colors duration-200 min-h-[44px]"
            >
              {hero.ctaText}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="border border-panel bg-secondary/35 hover:bg-secondary text-textLight font-heading font-bold text-sm tracking-wider uppercase px-6 py-4 text-center transition-colors duration-200 min-h-[44px]"
            >
              Our Capabilities
            </a>
          </motion.div>

          {/* Stat panel at the base (Orchestrated entrance) */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 border-l-2 border-accent/40 pl-6 gap-6 md:gap-12"
          >
            {hero.stats.map((stat, idx) => (
              <div key={idx}>
                <div className="font-heading text-2xl md:text-4xl font-bold text-accent">
                  {stat.value}
                </div>
                <div className="font-heading text-[10px] md:text-xs text-textMuted tracking-wider uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
