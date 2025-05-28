import type React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, Star, Clock, Users, ChevronRight, Info } from "lucide-react";
import { useBooking } from "./BookingContent";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

import { useCategories } from "@/hooks/use-supabase";

const About: React.FC = () => {
  const { openBookingForm } = useBooking();
  const { user, checkBookingRespond } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showWaitingRespond, setShowWaitingRespond] = useState(false);
  const [showWaitingTime, setShowWaitingTime] = useState(false);
  const [showWaitingForAppointment, setShowWaitingForAppointment] =
    useState(false);

  const [hoursLeft, setHoursLeft] = useState(0);

  const { featuredCategories = [] } = useCategories();

  const handleBookingClick = () => {
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
        const createdAt = new Date(checkBookingRespond.created_at);
        const now = new Date();

        const hoursDiff =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursDiff >= 24) {
          openBookingForm();
        } else {
          const remainingHours = 24 - hoursDiff;
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
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/70"></div>
              <span className="text-white/70 uppercase text-sm tracking-widest font-light">
                The Artist
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/70"></div>
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white tracking-tight">
              About Me
            </h2>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            WELCOME TO MY SITE
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Artist Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-[4/5] relative z-10 overflow-hidden rounded-lg">
              {/* Main image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Tattoo Artist"
                className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
              />

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
                <div className="absolute top-6 left-6 w-24 h-24 border border-white/20 rounded-lg"></div>
                <div className="absolute bottom-6 right-6 w-24 h-24 border border-white/20 rounded-lg"></div>
              </div>

              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 text-xs">Experience</span>
                    </div>
                    <p className="text-white text-xl font-bold">10+ Years</p>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 text-xs">Clients</span>
                    </div>
                    <p className="text-white text-xl font-bold">999+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative border */}
            <div className="absolute top-8 -right-8 w-full h-full border-2 border-white/20 rounded-lg -z-10"></div>

            {/* Artist name card */}
            <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 sm:-left-5 -translate-x-1/2 sm:translate-x-0 bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-lg border border-white/20 z-20 text-center sm:text-left">
              <h3 className="text-white text-2xl font-bold mb-1">A L E X</h3>
              <p className="text-white/70 text-sm">Founder & Lead Artist</p>
            </div>
          </motion.div>

          {/* Artist Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/20">
                  <Info className="w-6 h-6 text-white/80" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    About Me
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    My name is Alex, tattoo artist of the DMV. I specialize in
                    black/grey tattoos. I do not take color pieces.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/20">
                  <Star className="w-6 h-6 text-white/80" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    About My Work
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Dark-Art, Morderned-Japanese, Hyper-Detailed are my most
                    favorite topics. ​ I do take new design, custom design and
                    appointment only. I appreciate client who works respectful.
                    My primary focus is on delivering fair and high-quality
                    work.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Specialties
                </h3>
                <div className="cursor-pointer flex flex-wrap gap-2 mb-8">
                  {featuredCategories?.map((specialty) => (
                    <motion.span
                      key={specialty.id}
                      className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-white/90 text-sm backdrop-blur-sm"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {specialty.name}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-white text-xl font-semibold">
                  Dear Clients
                </h3>
                <p className="text-white/70 leading-relaxed">
                  "I am grateful for the support and trust you have placed in
                  me. Thank you for taking the time to read this, as your
                  patronage has been instrumental in my career success."
                </p>
                <p className="text-white/70 text-end pr-7">Regards, Alex.</p>
                <div className="pt-4">
                  <Button
                    className="bg-white text-black hover:bg-white/90 rounded-full px-6 group"
                    onClick={handleBookingClick}
                  >
                    BOOK NOW
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
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
              className="border-white/20 text-black hover:bg-white/30 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleLogin}
              className="border-white/20 text-black hover:bg-white/30 hover:text-white"
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

export default About;
