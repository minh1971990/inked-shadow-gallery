
import React from 'react';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="aspect-[3/4] relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Tattoo Artist" 
                className="w-full h-full object-cover rounded-md filter grayscale"
              />
            </div>
            <div className="absolute top-6 -right-6 w-full h-full border-2 border-primary rounded-md -z-10"></div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About the Artist</h2>
            <p className="text-lg mb-4 text-muted-foreground">
              With over 15 years of experience in fine art and 10 years specializing in tattoo design, 
              I've developed a distinctive style focused on black and grey realism with contemporary elements.
            </p>
            <p className="text-lg mb-6 text-muted-foreground">
              My work has been featured in international tattoo publications and exhibitions. 
              I believe in creating custom pieces that not only look stunning but carry personal 
              significance for each client.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Specialties</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 bg-secondary rounded-full text-sm">Black & Grey</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-sm">Dotwork</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-sm">Line Art</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-sm">Geometric</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-sm">Minimalist</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-sm">Realism</span>
            </div>
            
            <Button>Read Full Bio</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
