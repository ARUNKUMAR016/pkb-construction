import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-primary text-textLight font-body min-h-screen flex flex-col">
      {/* Sticky Header & Navigation */}
      <Header />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Hero Banner Section */}
        <Hero />
        
        {/* Services Capability Grid */}
        <Services />
        
        {/* Masonry Project Gallery */}
        <Gallery />
        
        {/* Value Props & Before/After Interactive Slider */}
        <WhyChooseUs />
        
        {/* Testimonials Blockquote */}
        <Testimonials />
        
        {/* Contact Estimator Form */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
