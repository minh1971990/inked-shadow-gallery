
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center relative">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3')",
            filter: "grayscale(100%) contrast(1.1)"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl mb-6 font-bold">
            MASTERS OF <span className="block md:inline">BLACK & GREY</span>
          </h1>
          <p className="text-gray-200 text-xl md:text-2xl mb-8 leading-relaxed">
            Premium tattoo artistry specializing in black and white designs,
            bringing your vision to life with precision and creativity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="text-lg py-6 px-8" size="lg">
              View Gallery
            </Button>
            <Button variant="outline" className="text-lg py-6 px-8 text-white border-white hover:bg-white/10" size="lg">
              Book Consultation
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <p className="text-white text-sm mb-2">Scroll to Explore</p>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
