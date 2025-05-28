import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaInstagram } from "react-icons/fa";
import { PiSparkleFill } from "react-icons/pi";
import { useBooking } from "./BookingContent";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, User as UserIcon, Phone, Key } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
          ART LLLEX
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
  navigate,
  isLogoutConfirmOpen,
  setIsLogoutConfirmOpen,
}) => {
  const { user, signOut, loading, userProfile, profileLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const renderNavLinks = () => (
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
  );

  const renderUserMenu = () => {
    if (loading || profileLoading) {
      return (
        <Button
          variant="outline"
          className="relative group overflow-hidden px-6 py-2 rounded-full bg-black border border-white cursor-wait"
          disabled
        >
          <span className="relative z-10 text-white/50">Loading...</span>
        </Button>
      );
    }

    if (!user) {
      return (
        <Button
          variant="outline"
          className="relative group overflow-hidden px-6 py-2 rounded-full bg-black border border-white cursor-pointer hover:bg-white"
          onClick={() => navigate("/login")}
        >
          <span className="relative z-10 text-white group-hover:text-black group-active:text-black transition-colors">
            Login
          </span>
        </Button>
      );
    }

    return (
      <>
        <AlertDialog
          open={isLogoutConfirmOpen}
          onOpenChange={setIsLogoutConfirmOpen}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative group overflow-hidden px-6 py-2 rounded-full bg-black border border-white cursor-pointer hover:bg-white"
              >
                <span className="relative z-10 text-white group-hover:text-black group-active:text-black transition-colors">
                  {userProfile?.full_name || user.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white text-black border border-white/20 backdrop-blur-md">
              <DropdownMenuItem
                onClick={() => setIsProfileOpen(true)}
                className="hover:!bg-black/50 hover:!text-white focus:!bg-black/50 focus:!text-white"
              >
                Profile
              </DropdownMenuItem>
              {userProfile?.role === "admin" && (
                <DropdownMenuItem
                  asChild
                  className="hover:!bg-black/50 hover:!text-white focus:!bg-black/50 focus:!text-white"
                >
                  <a href="/admin" target="_blank" rel="noopener noreferrer">
                    Access Data
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-gray-200" />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="hover:!bg-black/50 hover:!text-white focus:!bg-black/50 focus:!text-white">
                  Logout
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Logging out will end your current session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => signOut()}>
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-md bg-black/95 border border-white/50 backdrop-blur-md text-white p-6 rounded-lg shadow-xl px-4">
            <DialogHeader className="text-center">
              <DialogTitle className="text-white text-2xl font-bold mb-2 w-full">
                Your Profile
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm w-full">
                Review and manage your account information.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-5 py-4">
              {userProfile?.full_name && (
                <div className="flex items-center space-x-3">
                  <UserIcon size={20} className="text-white/70" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white/80 mb-1">
                      Full Name
                    </h4>
                    <p className="text-sm text-white/60">
                      {userProfile.full_name}
                    </p>
                  </div>
                </div>
              )}
              {userProfile?.full_name && (
                <div className="w-full h-[1px] bg-white/50"></div>
              )}
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-white/70" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white/80 mb-1">
                    Email Address
                  </h4>
                  <p className="text-sm text-white/60 break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
              {userProfile?.phone && (
                <div className="w-full h-[1px] bg-white/50"></div>
              )}
              {userProfile?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-white/70" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white/80 mb-1">
                      Phone Number
                    </h4>
                    <p className="text-sm text-white/60">{userProfile.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
    <div className="hidden md:flex items-center">
      {renderNavLinks()}
      {renderUserMenu()}
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
};

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
  navigate,
  isLogoutConfirmOpen,
  setIsLogoutConfirmOpen,
}) => {
  const { user, userProfile, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div
      ref={menuRef}
      className={`fixed inset-0 bg-black/95 backdrop-blur-lg z-50 md:hidden ${
        isMenuOpen ? "block" : "hidden"
      }`}
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
          <AlertDialog
            open={isLogoutConfirmOpen}
            onOpenChange={setIsLogoutConfirmOpen}
          >
            <div className="flex flex-col items-center space-y-4">
              {user ? (
                <>
                  {userProfile?.role === "admin" && (
                    <Button
                      variant="outline"
                      className="relative group overflow-hidden px-6 py-2 rounded-full bg-black border border-white cursor-pointer hover:bg-white"
                      asChild
                    >
                      <a
                        href="/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => toggleMenu()}
                      >
                        <span className="relative z-10 text-white group-hover:text-black group-active:text-black transition-colors">
                          Access Data
                        </span>
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="relative group overflow-hidden px-6 py-2 rounded-full bg-black border border-white cursor-pointer hover:bg-white"
                    onClick={() => {
                      toggleMenu();
                      setIsProfileOpen(true);
                    }}
                  >
                    <span className="relative z-10 text-white group-hover:text-black group-active:text-black transition-colors">
                      Profile
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="relative group overflow-hidden px-6 py-2 rounded-full bg-black border border-white cursor-pointer hover:bg-white"
                    onClick={() => {
                      toggleMenu();
                      setIsLogoutConfirmOpen(true);
                    }}
                  >
                    <span className="relative z-10 text-white group-hover:text-black group-active:text-black transition-colors">
                      Logout
                    </span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="relative group overflow-hidden px-6 py-2 rounded-full bg-black border border-white cursor-pointer hover:bg-white"
                  onClick={() => {
                    toggleMenu();
                    navigate("/login");
                  }}
                >
                  <span className="relative z-10 text-white group-hover:text-black group-active:text-black transition-colors">
                    Login
                  </span>
                </Button>
              )}
            </div>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to log out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Logging out will end your current session.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => signOut()}>
                  Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            <div className="text-white/60 text-sm">@art_lllex</div>
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

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="bg-black/95 border border-white/50 backdrop-blur-md text-white p-6 rounded-lg shadow-xl px-4 sm:max-w-md max-w-xs mx-auto">
            <DialogHeader className="text-center">
              <DialogTitle className="text-white text-2xl font-bold mb-2 w-full">
                Your Profile
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm w-full">
                Review and manage your account information.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-5 py-4">
              {userProfile?.full_name && (
                <div className="flex items-center space-x-3">
                  <UserIcon size={20} className="text-white/70" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white/80 mb-1">
                      Full Name
                    </h4>
                    <p className="text-sm text-white/60">
                      {userProfile.full_name}
                    </p>
                  </div>
                </div>
              )}
              {userProfile?.full_name && (
                <div className="w-full h-[1px] bg-white/50"></div>
              )}
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-white/70" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white/80 mb-1">
                    Email Address
                  </h4>
                  <p className="text-sm text-white/60 break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
              {userProfile?.phone && (
                <div className="w-full h-[1px] bg-white/50"></div>
              )}
              {userProfile?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-white/70" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white/80 mb-1">
                      Phone Number
                    </h4>
                    <p className="text-sm text-white/60">{userProfile.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.1); }
          }
        `}
      </style>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { openBookingForm } = useBooking();
  const menuRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef(0);
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

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

  useEffect(() => {
    if (isMenuOpen) {
      savedScrollPosition.current = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollPosition.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      if (isLogoutConfirmOpen) {
        setIsMenuOpen(false);
      }

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, savedScrollPosition.current);
      };
    }
  }, [isMenuOpen, isLogoutConfirmOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links
  const navLinks = [
    { name: "Gallery", href: "#gallery", id: "gallery" },
    { name: "About", href: "#about", id: "about" },
    { name: "Policy", href: "#policy", id: "policy" },
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
          navigate={navigate}
          isLogoutConfirmOpen={isLogoutConfirmOpen}
          setIsLogoutConfirmOpen={setIsLogoutConfirmOpen}
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
        navigate={navigate}
        isLogoutConfirmOpen={isLogoutConfirmOpen}
        setIsLogoutConfirmOpen={setIsLogoutConfirmOpen}
      />
      <HamburgerButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

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
