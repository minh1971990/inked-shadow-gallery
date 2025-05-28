import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegImages, FaRegCalendarCheck, FaInstagram } from "react-icons/fa";
import { PiSparkleFill } from "react-icons/pi";
import { useBooking } from "./BookingContent";
import { useDesigns } from "@/hooks/use-supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showWaitingRespond, setShowWaitingRespond] = useState(false);
  const [showWaitingTime, setShowWaitingTime] = useState(false);
  const [showWaitingForAppointment, setShowWaitingForAppointment] =
    useState(false);

  const { openBookingForm } = useBooking();
  const { designs, featuredDesigns } = useDesigns();
  const navigate = useNavigate();
  const { user, checkBookingRespond, refetchBookingRespond } = useAuth();

  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    setIsLoaded(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBookingClick = () => {
    refetchBookingRespond();
    const respondStatus = !user
      ? "no_user"
      : checkBookingRespond?.email && checkBookingRespond?.respond == null
      ? "no_respond"
      : checkBookingRespond?.respond === "Reject"
      ? "rejected"
      : checkBookingRespond?.respond === "Confirm"
      ? "confirmed"
      : "other";

    switch (respondStatus) {
      case "no_user":
        setShowLoginDialog(true);
        break;

      case "no_respond":
        setShowWaitingRespond(true);
        break;

      case "rejected": {
        const updatedAt = new Date(checkBookingRespond.updated_at);
        const now = new Date();

        const hoursDiff =
          (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

        if (hoursDiff >= 3) {
          openBookingForm();
        } else {
          const remainingHours = 3 - hoursDiff;
          setHoursLeft(remainingHours);
          setShowWaitingTime(true);
        }
        break;
      }

      case "confirmed": {
        const appointmentDate = new Date(checkBookingRespond.date);
        const now = new Date();

        if (now >= appointmentDate) {
          openBookingForm();
        } else {
          setShowWaitingForAppointment(true);
        }
        break;
      }

      case "other":
      default:
        openBookingForm();
        break;
    }
  };

  const handleLogin = () => {
    setShowLoginDialog(false);
    navigate("/login");
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Tattoo design overlays */}
        <motion.div
          className="absolute left-0 top-0 w-1/3 h-full opacity-20"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=400')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            filter: "invert(1)",
          }}
        ></motion.div>

        <motion.div
          className="absolute right-0 top-0 w-1/3 h-full opacity-20"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=400')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            filter: "invert(1)",
          }}
        ></motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>
      </div>

      {/* Animated particles */}
      <AnimatePresence>
        {isLoaded && (
          <Particles
            className="absolute inset-0 z-[1] pointer-events-none"
            quantity={20}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center py-16">
        {/* Artist signature/logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-white/80 mt-12 text-sm tracking-[0.3em] uppercase mb-2 text-center">
            Established 2015
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-center mb-6 tracking-tighter leading-[0.9] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            textShadow: "0 0 40px rgba(0,0,0,0.8)",
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-400">
            ARTs OF
          </span>
          <motion.span
            className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#e0e0e0] via-white to-gray-400"
            initial={{ letterSpacing: "0.05em" }}
            animate={{ letterSpacing: "0.02em" }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            ALEX
          </motion.span>
        </motion.h1>

        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mb-8 opacity-70"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.6 }}
        ></motion.div>

        <motion.p
          className="text-gray-300 text-lg sm:text-xl md:text-2xl text-center mb-20 max-w-2xl mx-auto px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          DMV Tattoo - Rockville Maryland, US
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
            <Button
              asChild
              variant="outline"
              className="text-lg py-6 px-8 rounded-full font-semibold flex items-center justify-center gap-2 text-black border-white hover:bg-white/20 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] shadow-lg w-full"
              size="lg"
            >
              <a href="#gallery">
                <FaRegImages className="text-xl" />
                View Gallery
              </a>
            </Button>

            <Button
              variant="outline"
              className="text-lg py-6 px-8 rounded-full font-semibold flex items-center justify-center gap-2 text-black border-white hover:bg-white/20 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] shadow-lg w-full"
              size="lg"
              onClick={handleBookingClick}
            >
              <FaRegCalendarCheck className="text-xl" />
              Booking
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {scrollY < 100 && (
            <motion.div
              className="flex flex-col items-center mt-2"
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1,
                y: [0, 10, 0],
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                opacity: { duration: 1 },
                y: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
              }}
            >
              <p className="text-white/70 text-sm mb-2 font-light tracking-wider drop-shadow">
                Scroll to Explore
              </p>
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
                className="text-white/70"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured work preview */}
        <motion.div
          className="w-full max-w-4xl mx-auto mt-4 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded-xl blur opacity-50"></div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 relative bg-black/40 p-2 sm:p-4 rounded-xl backdrop-blur-sm border border-white/20">
              {featuredDesigns.slice(0, 3).map((featured) => (
                <motion.div
                  key={featured.id}
                  className="aspect-square overflow-hidden rounded-lg relative group"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 z-10">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      View Work
                    </span>
                  </div>
                  <img
                    src={
                      featured.image_url ||
                      "/placeholder.svg?height=400&width=400"
                    }
                    alt={`Featured tattoo work ${
                      featured.title || featured.id
                    }`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="flex items-center justify-center gap-8 text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <FaInstagram className="text-xl" />
            <span className="text-sm font-light">@art_lllex</span>
          </div>
          <div className="flex items-center gap-2">
            <PiSparkleFill className="text-xl" />
            <span className="text-sm font-light">500+ satisfied clients</span>
          </div>
        </motion.div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-black/95 border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription className="text-white/70">
              Please login to book an appointment
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
              className="border-white/20 text-black hover:bg-white/30 hover:text-white  "
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleLogin}
              className="border-white/20 text-black hover:bg-white/30 hover:text-white  "
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wait for the respond */}
      <Dialog open={showWaitingRespond} onOpenChange={setShowWaitingRespond}>
        <DialogContent className="w-[90%] max-w-sm sm:max-w-md border border-white/20 text-white backdrop-blur-xl bg-black/80 shadow-xl rounded-2xl px-6 py-8 sm:px-8 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            {/* Đồng hồ có animation rung rung nhẹ */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Clock className="w-14 h-14 sm:w-16 sm:h-16 text-white/80" />
            </motion.div>

            <div className="flex flex-col items-center text-center">
              <DialogTitle className="text-lg sm:text-2xl font-semibold">
                Please wait for the respond
              </DialogTitle>
              <DialogDescription className="text-white/70 mt-2 text-sm sm:text-base max-w-[90%] sm:max-w-md">
                Wait until the admin responds to your appointment before you can
                book another one.
              </DialogDescription>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowWaitingRespond(false)}
              className="text-sm sm:text-base border-white/20 text-black bg-white hover:bg-white/20 hover:text-white transition-all"
            >
              Cancel
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWaitingTime} onOpenChange={setShowWaitingTime}>
        <DialogContent className="w-[90%] max-w-sm sm:max-w-md border border-white/20 text-white backdrop-blur-xl bg-black/80 shadow-xl rounded-2xl px-6 py-8 sm:px-8 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            {/* Animated clock icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Clock className="w-14 h-14 sm:w-16 sm:h-16 text-white/80" />
            </motion.div>

            <div className="flex flex-col items-center text-center">
              <DialogTitle className="text-lg sm:text-2xl font-semibold">
                Not enough time yet
              </DialogTitle>
              <DialogDescription className="text-white/70 mt-2 text-sm sm:text-base max-w-[90%] sm:max-w-md">
                You need to wait another {hoursLeft.toFixed(1)} hours before you
                can book a new appointment. Please be patient!
              </DialogDescription>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowWaitingTime(false)}
              className="text-sm sm:text-base border-white/20 text-black bg-white hover:bg-white/20 hover:text-white transition-all"
            >
              Got it!
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showWaitingForAppointment}
        onOpenChange={setShowWaitingForAppointment}
      >
        <DialogContent className="w-[90%] max-w-sm sm:max-w-md border border-white/20 text-white backdrop-blur-xl bg-black/80 shadow-xl rounded-2xl px-6 py-8 sm:px-8 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            {/* Animated clock icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Clock className="w-14 h-14 sm:w-16 sm:h-16 text-white/80" />
            </motion.div>

            <div className="flex flex-col items-center text-center">
              <DialogTitle className="text-lg sm:text-2xl font-semibold">
                Please wait until your appointment is completed
              </DialogTitle>
              <p className="text-white/70 mt-2 text-sm sm:text-base max-w-[90%] sm:max-w-md">
                Your current appointment will be start at <br></br>
                {checkBookingRespond?.date
                  ? new Date(checkBookingRespond.date).toLocaleString(
                      undefined,
                      {
                        hour12: false,
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      }
                    )
                  : ""}
              </p>
              <DialogDescription className="text-white/70 mt-2 text-sm sm:text-base max-w-[90%] sm:max-w-md">
                You must wait until your current appointment is completed before
                booking a new one. Please be patient!
              </DialogDescription>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowWaitingForAppointment(false)}
              className="text-sm sm:text-base border-white/20 text-black bg-white hover:bg-white/20 hover:text-white transition-all"
            >
              Got it!
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Animated particles component for ink splatter effect
const Particles: React.FC<{ className?: string; quantity?: number }> = ({
  className = "",
  quantity = 30,
}) => {
  return (
    <div className={className}>
      {[...Array(quantity)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: Math.random() * 3 + 0.5,
            opacity: Math.random() * 0.6,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
};

export default Hero;
