import React, { useState } from 'react';
import { content } from '../data/content';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { contact, business } = content;
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please fill in your Name and Phone Number.");
      return;
    }
    
    setIsLoading(true);
    // Simulate API request submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', message: '' });
    }, 1200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-primary border-t border-panel/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Industrial Spec Sheet Contact Details (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-[2px] w-6 bg-accent" />
                <span className="font-heading text-accent text-sm font-semibold tracking-widest uppercase">
                  Get in touch
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-textLight uppercase mb-4">
                {contact.sectionTitle}
              </h2>
              <p className="font-body text-base text-textMuted leading-relaxed mb-8">
                {contact.sectionSubtitle}
              </p>
            </div>

            {/* Spec Sheet layout for info */}
            <div className="space-y-4 border border-panel bg-secondary/35 p-6 mb-8 lg:mb-0">
              <h3 className="font-heading text-sm text-accent font-semibold tracking-widest uppercase mb-4 border-b border-panel pb-2">
                Operational Specifications
              </h3>
              
              <div className="flex items-start gap-4">
                <div className="text-accent mt-0.5"><Phone className="h-5 w-5" /></div>
                <div>
                  <span className="font-heading text-xs text-textMuted tracking-wider uppercase block">Phone Hotline</span>
                  <a href={`tel:${business.phone}`} className="font-heading text-lg font-bold text-textLight hover:text-accent transition-colors duration-150 mt-1 block">
                    {business.phoneFormatted}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-panel/30 pt-4">
                <div className="text-accent mt-0.5"><Mail className="h-5 w-5" /></div>
                <div>
                  <span className="font-heading text-xs text-textMuted tracking-wider uppercase block">Email Address</span>
                  <a href={`mailto:${business.email}`} className="font-body text-sm font-medium text-textLight hover:text-accent transition-colors duration-150 mt-1 block">
                    {business.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-panel/30 pt-4">
                <div className="text-accent mt-0.5"><MapPin className="h-5 w-5" /></div>
                <div>
                  <span className="font-heading text-xs text-textMuted tracking-wider uppercase block">Headquarters</span>
                  <p className="font-body text-xs text-textLight leading-relaxed mt-1">
                    {business.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-panel/30 pt-4">
                <div className="text-accent mt-0.5"><Clock className="h-5 w-5" /></div>
                <div>
                  <span className="font-heading text-xs text-textMuted tracking-wider uppercase block">Yard & Office Hours</span>
                  <p className="font-body text-xs text-textLight mt-1">
                    {business.workingHours}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Premium Form Card (Span 7) */}
          <div className="lg:col-span-7">
            <div className="bg-secondary border border-panel p-6 md:p-10 h-full flex flex-col justify-center">
              {isSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="bg-accent/10 p-4 rounded-full text-accent mb-4">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-textLight uppercase tracking-wide mb-2">
                    Estimate Request Sent
                  </h3>
                  <p className="font-body text-sm text-textMuted max-w-md mx-auto leading-relaxed">
                    We have registered your details in our estimator queue. A construction engineer will review your project dimensions and contact you within 48 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 border border-panel bg-primary hover:bg-panel text-textLight px-6 py-2.5 font-heading text-xs tracking-wider uppercase transition-colors duration-150 min-h-[44px]"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field (Min height tap target 44px) */}
                  <div>
                    <label htmlFor="name" className="font-heading text-xs text-textLight tracking-wider uppercase block mb-2 font-semibold">
                      {contact.form.nameLabel} <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Karthik Raja"
                      className="w-full bg-primary border border-panel focus:border-accent p-3 text-sm text-textLight focus:outline-none min-h-[44px] placeholder-textMuted/60 transition-colors"
                    />
                  </div>

                  {/* Phone field (Min height tap target 44px) */}
                  <div>
                    <label htmlFor="phone" className="font-heading text-xs text-textLight tracking-wider uppercase block mb-2 font-semibold">
                      {contact.form.phoneLabel} <span className="text-accent">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98456 32100"
                      className="w-full bg-primary border border-panel focus:border-accent p-3 text-sm text-textLight focus:outline-none min-h-[44px] placeholder-textMuted/60 transition-colors"
                    />
                  </div>

                  {/* Message field (Min height tap target 44px) */}
                  <div>
                    <label htmlFor="message" className="font-heading text-xs text-textLight tracking-wider uppercase block mb-2 font-semibold">
                      {contact.form.messageLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Specify project site, approx dimensions, expected start date..."
                      className="w-full bg-primary border border-panel focus:border-accent p-3 text-sm text-textLight focus:outline-none min-h-[44px] placeholder-textMuted/60 transition-colors resize-y"
                    />
                  </div>

                  {/* Submit button (Min height tap target 44px) */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent hover:bg-accentDark text-primary p-4 font-heading font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50 min-h-[44px]"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>{contact.form.submitButton}</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
