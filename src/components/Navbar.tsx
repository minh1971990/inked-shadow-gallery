
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full z-50 bg-background/90 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-heading font-bold tracking-tighter">
          INK & SHADOW
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#gallery" className="hover-effect font-medium">Gallery</a>
          <a href="#about" className="hover-effect font-medium">About</a>
          <a href="#contact" className="hover-effect font-medium">Contact</a>
          <Button variant="outline" className="ml-4 hover:bg-primary hover:text-primary-foreground">
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-foreground mb-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-foreground mb-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a href="#gallery" className="py-2 hover-effect font-medium" onClick={toggleMenu}>Gallery</a>
            <a href="#about" className="py-2 hover-effect font-medium" onClick={toggleMenu}>About</a>
            <a href="#contact" className="py-2 hover-effect font-medium" onClick={toggleMenu}>Contact</a>
            <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground mt-2">
              Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
