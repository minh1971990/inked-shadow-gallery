import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { PiSparkleFill } from "react-icons/pi";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links
  const navLinks = [
    { name: "Gallery", href: "#gallery", id: "gallery" },
    { name: "About", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="relative group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center">
            {/* Ink splatter logo effect */}
            <div className="w-10 h-10 mr-2 relative hidden sm:block">
              <div className="absolute inset-0 bg-white rounded-full opacity-10"></div>
              <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                <PiSparkleFill className="text-white/80 text-lg" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-heading font-black tracking-tighter text-white">
                INK <span className="text-white/80">&</span> SHADOW
              </span>
              <span className="block text-[10px] text-white/60 tracking-widest -mt-1 font-light">
                TATTOO ARTISTRY
              </span>
            </div>
          </div>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <motion.div
            className="flex items-center space-x-8 mr-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`relative py-2 font-medium text-sm tracking-wide transition-colors ${
                  activeSection === link.id
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setActiveSection(link.id)}
              >
                {link.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {activeSection === link.id && (
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-white"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="border-white/30 text-black hover:bg-white hover:text-black transition-all duration-300 rounded-full px-6"
            >
              BOOK NOW
            </Button>
          </motion.div>

          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 text-white/70 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            aria-label="Instagram"
          >
            <FaInstagram className="text-xl" />
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-7 h-6">
            <motion.div
              className="absolute w-7 h-0.5 bg-white rounded-full"
              animate={{
                top: isMenuOpen ? "50%" : "0%",
                rotate: isMenuOpen ? "45deg" : "0deg",
                translateY: isMenuOpen ? "-50%" : "0%",
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute top-1/2 w-7 h-0.5 bg-white rounded-full -translate-y-1/2"
              animate={{
                opacity: isMenuOpen ? 0 : 1,
                width: isMenuOpen ? 0 : "100%",
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute w-7 h-0.5 bg-white rounded-full"
              animate={{
                bottom: isMenuOpen ? "50%" : "0%",
                rotate: isMenuOpen ? "-45deg" : "0deg",
                translateY: isMenuOpen ? "50%" : "0%",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex items-center justify-center"
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col items-center justify-center h-full">
              {/* Mobile menu links with staggered animation */}
              <div className="flex flex-col items-center space-y-6 mb-8">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    className="py-2 text-2xl font-medium text-white/80 hover:text-white transition-colors"
                    onClick={() => {
                      setActiveSection(link.id);
                      toggleMenu();
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full px-8 py-6 text-lg"
                  onClick={toggleMenu}
                >
                  Book Consultation
                </Button>
              </motion.div>

              {/* Social links */}
              <motion.div
                className="flex items-center space-x-6 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                <div className="text-white/50 text-sm">@ink_and_shadow</div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute bottom-8 left-0 right-0 flex justify-center opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
