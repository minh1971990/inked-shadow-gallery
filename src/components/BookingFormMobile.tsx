"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import { enUS } from "date-fns/locale";

interface BookingFormMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingFormMobile: React.FC<BookingFormMobileProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Consultation Request Received",
      description:
        "Thank you for your inquiry. We'll get back to you within 24 hours to confirm your appointment.",
      duration: 5000,
    });
    setFormStep(1);
  };

  const resetForm = () => {
    setFormStep(0);
    onClose();
  };

  return (
    <DialogContent className="max-w-[95%] p-0 h-[90vh] max-h-[90vh] bg-black/95 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden">
      {/* Close button - more visible on mobile */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-50 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all"
        aria-label="Close dialog"
      >
        <X size={18} />
      </button>

      <div className="p-4 pt-10 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Book Your Consultation
          </DialogTitle>
          <DialogDescription className="text-white/70 text-center max-w-md mx-auto text-sm">
            Fill out the form below to schedule a consultation with one of our
            talented artists.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {formStep === 0 ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-white/80 text-sm font-medium mb-1.5"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-white/80 text-sm font-medium mb-1.5"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-white/80 text-sm font-medium mb-1.5"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tattoo-style"
                      className="block text-white/80 text-sm font-medium mb-1.5"
                    >
                      Preferred Style
                    </label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="black-and-grey">
                          Black & Grey
                        </SelectItem>
                        <SelectItem value="realism">Realism</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="neo-traditional">
                          Neo-Traditional
                        </SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="geometric">Geometric</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1.5">
                    Approximate Size
                  </label>
                  <RadioGroup
                    defaultValue="medium"
                    className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4"
                  >
                    <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-md">
                      <RadioGroupItem
                        value="small"
                        id="size-small"
                        className="text-white border-white/30"
                      />
                      <Label
                        htmlFor="size-small"
                        className="text-white/80 text-sm"
                      >
                        Small (2-3")
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-md">
                      <RadioGroupItem
                        value="medium"
                        id="size-medium"
                        className="text-white border-white/30"
                      />
                      <Label
                        htmlFor="size-medium"
                        className="text-white/80 text-sm"
                      >
                        Medium (4-6")
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-md">
                      <RadioGroupItem
                        value="large"
                        id="size-large"
                        className="text-white border-white/30"
                      />
                      <Label
                        htmlFor="size-large"
                        className="text-white/80 text-sm"
                      >
                        Large (7-10")
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-md">
                      <RadioGroupItem
                        value="extra-large"
                        id="size-xl"
                        className="text-white border-white/30"
                      />
                      <Label
                        htmlFor="size-xl"
                        className="text-white/80 text-sm"
                      >
                        XL (11"+)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <label
                    htmlFor="placement"
                    className="block text-white/80 text-sm font-medium mb-1.5"
                  >
                    Desired Placement
                  </label>
                  <Input
                    id="placement"
                    placeholder="e.g., Forearm, Back, Shoulder, etc."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tattoo-idea"
                    className="block text-white/80 text-sm font-medium mb-1.5"
                  >
                    Tattoo Description
                  </label>
                  <Textarea
                    id="tattoo-idea"
                    placeholder="Please describe your tattoo idea in detail..."
                    rows={3}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 min-h-[80px]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="availability"
                    className="block text-white/80 text-sm font-medium mb-1.5"
                  >
                    Preferred Consultation Date
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-2 h-10">
                    <Calendar className="h-4 w-4 text-white/50" />
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                      locale={enUS}
                      placeholderText="mm/dd/yyyy"
                      className="border-0 bg-transparent text-white dark:text-black focus:ring-0 p-0 focus:outline-none"
                    />
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    Please select a date at least 3 days in advance
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 transition-all py-5 text-base font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Book Your Consultation"
                    )}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Consultation Request Sent!
                </h3>
                <p className="text-white/70 max-w-md mb-8">
                  Thank you for reaching out. We'll review your request and get
                  back to you within 24 hours to confirm your appointment.
                </p>
                <Button
                  onClick={resetForm}
                  className="bg-white text-black hover:bg-white/90"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DialogContent>
  );
};

export default BookingFormMobile;
