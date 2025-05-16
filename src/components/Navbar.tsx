"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaInstagram } from "react-icons/fa";
import { PiSparkleFill } from "react-icons/pi";
import { useBooking } from "./BookingContent";

const Logo = ({ isMenuOpen }) => (
  <a
    href="#"
    className="relative group z-20"
    style={{
      transform: isMenuOpen ? "scale(0.95)" : "scale(1)",
      opacity: isMenuOpen ? "0.8" : "1",
      transition: "transform 0.5s, opacity 0.5s",
    }}
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
  </a>
);

const DesktopMenu = ({
  navLinks,
  activeSection,
  setActiveSection,
  openBookingForm,
}) => (
  <div className="hidden md:flex items-center">
    <div className="flex items-center space-x-8 mr-8">
      {navLinks.map((link) => (
        <a
          key={link.id}
          href={link.href}
          className={`relative py-2 font-medium text-sm tracking-wide transition-colors group ${
            activeSection === link.id
              ? "text-white"
              : "text-white/70 hover:text-white"
          }`}
          onClick={() => setActiveSection(link.id)}
        >
          {link.name}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 scale-x-0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"></span>
          {activeSection === link.id && (
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white"></span>
          )}
        </a>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="relative border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full px-6 overflow-hidden group"
        onClick={openBookingForm}
      >
        <span className="relative z-10 text-black">BOOK NOW</span>
        <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0"></span>
      </Button>
    </div>

    <a
      href="https://www.instagram.com/art_lllex/"
      target="_blank"
      rel="noopener noreferrer"
      className="ml-4 text-white/70 hover:text-white transition-colors hover:scale-110 duration-300"
      aria-label="Instagram"
    >
      <FaInstagram className="text-xl" />
    </a>
  </div>
);

const HamburgerButton = ({ isMenuOpen, toggleMenu }) => (
  <button
    className="fixed md:hidden top-5 right-4 p-2 z-[100] w-10 h-10 flex items-center justify-center"
    onClick={toggleMenu}
    aria-label="Toggle menu"
    style={{ transition: "transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)" }}
  >
    <div className="w-7 h-7 relative">
      {[
        isMenuOpen ? "top-3 rotate-45" : "top-0 rotate-0",
        isMenuOpen ? "top-3 opacity-0" : "top-3 opacity-100",
        isMenuOpen ? "top-3 -rotate-45" : "top-6 rotate-0",
      ].map((barClass, idx) => (
        <span
          key={idx}
          className={`absolute left-0 h-0.5 w-7 bg-white rounded-full transition-all duration-300 ${barClass}`}
        ></span>
      ))}
    </div>
  </button>
);

const MobileMenu = ({
  isMenuOpen,
  navLinks,
  activeSection,
  setActiveSection,
  toggleMenu,
  openBookingForm,
  menuRef,
}) => (
  <div
    ref={menuRef}
    className={`fixed inset-0 bg-black/95 backdrop-blur-lg z-50 md:hidden
      transition-opacity duration-300
      ${
        isMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }
    `}
    style={{
      clipPath: isMenuOpen
        ? "circle(150% at top right)"
        : "circle(0% at calc(100% - 20px) 20px)",
      transition:
        "clip-path 0.7s cubic-bezier(0.68, -0.6, 0.32, 1.6), opacity 0.3s ease",
    }}
  >
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="flex flex-col items-center space-y-8 mb-12 w-full">
        {navLinks.map((link, index) => (
          <a
            key={link.id}
            href={link.href}
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? "translateY(0)" : "translateY(40px)",
              transition: `transform 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) ${
                0.1 + index * 0.07
              }s, opacity 0.4s ease ${0.1 + index * 0.07}s`,
            }}
            className="py-2 text-3xl font-medium text-white/90 hover:text-white transition-colors relative group"
            onClick={() => {
              setActiveSection(link.id);
              toggleMenu();
            }}
          >
            <span className="relative">
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
            </span>
          </a>
        ))}
      </div>

      <div
        style={{
          opacity: isMenuOpen ? 1 : 0,
          transform: isMenuOpen
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.9)",
          transition: `transform 0.7s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.4}s, opacity 0.7s ease ${0.4}s`,
        }}
        className="mb-12"
      >
        <Button
          variant="outline"
          className="relative border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full px-6 overflow-hidden group"
          onClick={() => {
            toggleMenu();
            openBookingForm();
          }}
        >
          <span className="relative z-10 text-black">BOOK NOW</span>
          <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0"></span>
        </Button>
      </div>

      <div
        style={{
          opacity: isMenuOpen ? 1 : 0,
          transform: isMenuOpen ? "translateY(0)" : "translateY(40px)",
          transition: `transform 0.7s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.5}s, opacity 0.7s ease ${0.5}s`,
        }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="text-white/50 text-sm uppercase tracking-widest">
          Follow Us
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="https://www.instagram.com/art_lllex/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <FaInstagram className="text-xl" />
          </a>
          <div className="text-white/60 text-sm">@ink_and_shadow</div>
        </div>
      </div>
    </div>

    <div
      style={{
        opacity: isMenuOpen ? 0.3 : 0,
        transform: isMenuOpen ? "scaleX(1)" : "scaleX(0)",
        transition: `opacity 0.7s ease ${0.6}s, transform 0.7s ease ${0.6}s`,
      }}
      className="absolute bottom-8 left-0 right-0 flex justify-center"
    >
      <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  </div>
);

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { openBookingForm } = useBooking();
  const menuRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef(0);

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

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      savedScrollPosition.current = window.scrollY;

      // Apply fixed positioning to body
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollPosition.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scroll position when component unmounts or menu closes
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, savedScrollPosition.current);
      };
    }
  }, [isMenuOpen]);

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
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Logo isMenuOpen={isMenuOpen} />
        <DesktopMenu
          navLinks={navLinks}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          openBookingForm={openBookingForm}
        />
      </div>
      <MobileMenu
        isMenuOpen={isMenuOpen}
        navLinks={navLinks}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        toggleMenu={toggleMenu}
        openBookingForm={openBookingForm}
        menuRef={menuRef}
      />
      <HamburgerButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Add global styles for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.1); }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
