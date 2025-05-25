import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiSparkleFill } from "react-icons/pi";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
      </div>

      {/* Top wave separator */}
      <div className="relative h-16 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-black"></div>
        <svg
          className="absolute bottom-0 w-full text-black"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 mr-2 relative hidden sm:block">
                  <div className="absolute inset-0 bg-white rounded-full opacity-10"></div>
                  <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                    <PiSparkleFill className="text-white/80 text-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    ART LLLEX
                  </h3>
                  <div className="text-[10px] text-white/60 uppercase tracking-widest -mt-1">
                    Tattoo Artistry
                  </div>
                </div>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                Premium black & grey tattoo artistry crafted with precision and
                passion. Creating unique, personalized designs that tell your
                story through ink.
              </p>
              <div className="flex space-x-4 mb-8">
                <motion.a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-white/30 mr-3"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Gallery", href: "#gallery", id: "gallery" },
                  { name: "About", href: "#about", id: "about" },
                  {
                    name: "Booking Information",
                    href: "#policies",
                    id: "policies",
                  },
                  { name: "Contact", href: "#contact", id: "contact" },
                ].map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors flex items-center group"
                    >
                      <ArrowRight
                        size={14}
                        className="mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                      />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-white/30 mr-3"></span>
                Visit Us
              </h4>
              <address className="text-white/70 not-italic space-y-4">
                <div className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-3 text-white/50 mt-1 flex-shrink-0"
                  />
                  <div>
                    8607 2nd Ave
                    <br />
                    Silver Spring, MD 20910, US
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone
                    size={18}
                    className="mr-3 text-white/50 flex-shrink-0"
                  />
                  <span>(301) 232-8339</span>
                </div>
                <div className="flex items-center">
                  <Mail
                    size={18}
                    className="mr-3 text-white/50 flex-shrink-0"
                  />
                  <span>artlllex.official@gmail.com</span>
                </div>
              </address>

              <div className="mt-8">
                <h5 className="text-white/90 font-medium mb-2">Studio Hours</h5>
                <ul className="text-white/70 space-y-1">
                  <li className="flex justify-between">
                    <span>Tuesday - Friday</span>
                    <span className="text-white/90">12:00 PM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-white/90">10:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday - Monday</span>
                    <span className="text-white/50">Closed</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-white/30 mr-3"></span>
                Stay Updated
              </h4>
              <p className="text-white/70 mb-4">
                Subscribe to our newsletter for the latest designs, artist
                spotlights, and exclusive offers.
              </p>

              {isSubscribed ? (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-white mr-3 h-5 w-5" />
                    <p className="text-white/90 text-sm">
                      Thanks for subscribing! Check your inbox for a
                      confirmation email.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-1 top-1 bottom-1 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                  <p className="text-white/50 text-xs">
                    We respect your privacy and will never share your
                    information.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {currentYear} Artlllex. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">
            Website designed and developed by{" "}
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors"
            >
              Duck & DMinh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
