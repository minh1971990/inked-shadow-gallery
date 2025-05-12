
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Contact: React.FC = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message received",
      description: "Thank you for your inquiry. We'll get back to you shortly.",
    });
  };

  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Book a Consultation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready to start your tattoo journey? Fill out the form below to schedule 
              a consultation, and I'll get back to you within 48 hours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-4">Studio Hours</h3>
              <div className="mb-6">
                <p className="mb-1"><strong>Tuesday - Friday:</strong> 12:00 PM - 8:00 PM</p>
                <p className="mb-1"><strong>Saturday:</strong> 10:00 AM - 6:00 PM</p>
                <p><strong>Sunday - Monday:</strong> Closed</p>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 mb-6">
                <p><strong>Email:</strong> info@inkandshadow.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Location:</strong> 123 Art District, Creative City</p>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover-effect">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover-effect">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover-effect">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 bg-background p-6 rounded-md shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input id="name" placeholder="Your name" required />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input id="email" type="email" placeholder="your.email@example.com" required />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (optional)</label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              
              <div>
                <label htmlFor="tattoo-idea" className="block text-sm font-medium mb-1">Tattoo Idea</label>
                <Textarea 
                  id="tattoo-idea" 
                  placeholder="Please describe your tattoo idea, desired size and placement" 
                  rows={4}
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
