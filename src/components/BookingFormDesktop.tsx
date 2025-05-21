"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { enUS } from "date-fns/locale";
import axiosInstance from "@/lib/axios";

interface BookingFormDesktopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingFormDesktop: React.FC<BookingFormDesktopProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    style: "",
    size: "medium",
    placement: "",
    idea: "",
    date: null as Date | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        style: formData.style,
        size: formData.size,
        placement: formData.placement,
        idea: formData.idea,
        date: formData.date ? formData.date.toISOString() : null,
      };

      await axiosInstance.post("", formPayload);

      toast({
        title: "Consultation Request Received",
        description:
          "Thank you for your inquiry. We'll get back to you within 24 hours to confirm your appointment.",
        duration: 5000,
      });

      setFormStep(1);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormStep(0);
    setFormData({
      name: "",
      email: "",
      phone: "",
      style: "",
      size: "medium",
      placement: "",
      idea: "",
      date: null,
    });
    setSelectedDate(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-[720px] bg-black/95 dark:bg-white/95 border border-white/10 dark:border-black/10 backdrop-blur-md p-0 rounded-xl overflow-hidden">
        <div className="p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white dark:text-black text-center">
              Book Your Consultation
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {formStep === 0 ? (
                <motion.form
                  key="booking-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                      >
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        required
                        className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/30 dark:focus:border-black/30"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/30 dark:focus:border-black/30"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/30 dark:focus:border-black/30"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, phone: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tattoo-style"
                        className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                      >
                        Preferred Style
                      </label>
                      <Select
                        value={formData.style}
                        onValueChange={(v) =>
                          setFormData((f) => ({ ...f, style: v }))
                        }
                      >
                        <SelectTrigger className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 text-white dark:text-black">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black-and-grey">
                            Black & Grey
                          </SelectItem>
                          <SelectItem value="realism">Realism</SelectItem>
                          <SelectItem value="traditional">
                            Traditional
                          </SelectItem>
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
                    <label className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2">
                      Approximate Size
                    </label>
                    <RadioGroup
                      value={formData.size}
                      onValueChange={(v) =>
                        setFormData((f) => ({ ...f, size: v }))
                      }
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="small"
                          id="size-small"
                          className="text-white dark:text-black border-white/30 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-small"
                          className="text-white/80 dark:text-black/80"
                        >
                          Small (2-3")
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="medium"
                          id="size-medium"
                          className="text-white dark:text-black border-white/30 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-medium"
                          className="text-white/80 dark:text-black/80"
                        >
                          Medium (4-6")
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="large"
                          id="size-large"
                          className="text-white dark:text-black border-white/30 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-large"
                          className="text-white/80 dark:text-black/80"
                        >
                          Large (7-10")
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="extra-large"
                          id="size-xl"
                          className="text-white dark:text-black border-white/30 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-xl"
                          className="text-white/80 dark:text-black/80"
                        >
                          Extra Large (11"+)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <label
                      htmlFor="placement"
                      className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                    >
                      Desired Placement
                    </label>
                    <Input
                      id="placement"
                      placeholder="e.g., Forearm, Back, Shoulder, etc."
                      className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/30 dark:focus:border-black/30"
                      value={formData.placement}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          placement: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tattoo-idea"
                      className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                    >
                      Tattoo Description
                    </label>
                    <Textarea
                      id="tattoo-idea"
                      placeholder="Please describe your tattoo idea in detail. Include any reference images or specific elements you'd like to incorporate."
                      rows={3}
                      required
                      className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/30 dark:focus:border-black/30"
                      value={formData.idea}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, idea: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                    >
                      Preferred Consultation Date
                    </label>
                    <div className="flex items-center gap-2 bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 rounded-md px-3 py-2">
                      <Calendar className="h-5 w-5 text-white/50 dark:text-black/50" />
                      <DatePicker
                        selected={formData.date}
                        onChange={(date: Date | null) =>
                          setFormData((f) => ({ ...f, date }))
                        }
                        locale={enUS}
                        placeholderText="mm/dd/yyyy"
                        className="border-0 bg-transparent text-white dark:text-black focus:ring-0 p-0 focus:outline-none"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                    <p className="text-white/50 dark:text-black/50 text-xs mt-1">
                      Please select a date at least 3 days in advance
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90 transition-all py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white dark:text-black"
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
                  <h3 className="text-2xl font-bold text-white dark:text-black mb-3">
                    Consultation Request Sent!
                  </h3>
                  <p className="text-white/70 dark:text-black/70 max-w-md mb-8">
                    Thank you for reaching out. We'll review your request and
                    get back to you within 24 hours to confirm your appointment.
                  </p>
                  <Button
                    onClick={resetForm}
                    className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90"
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormDesktop;
