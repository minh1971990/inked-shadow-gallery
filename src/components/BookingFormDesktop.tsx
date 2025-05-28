import type React from "react";
import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useBookings } from "@/hooks/use-supabase";
import { format, setMinutes, setHours, addDays } from "date-fns";

import { useMemo } from "react";

interface BookingFormDesktopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingFormDesktop: React.FC<BookingFormDesktopProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const { categories = [] } = useCategories();
  const { bookings = [] } = useBookings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    style: "",
    size: "Medium (4-6')",
    placement: "",
    idea: "",
    date: null as Date | null,
  });

  useEffect(() => {
    if (user && userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.full_name || "",
        email: user.email || "",
        phone: userProfile.phone || "",
      }));
    }
  }, [user, userProfile]);

  const validateField = (name: string, value: string | Date | null) => {
    const newErrors = { ...errors };
    delete newErrors[name];

    switch (name) {
      case "name":
        if (!value.toString().trim()) {
          newErrors.name = "Name is required";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value.toString())) {
          newErrors.email = "Please enter a valid email address";
        }
        break;
      case "phone":
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!value) {
          newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value.toString())) {
          newErrors.phone =
            "Please enter a valid phone number (e.g., 123-456-7890)";
        }
        break;
      case "style":
        if (!value) {
          newErrors.style = "Please select a tattoo style";
        }
        break;
      case "placement":
        if (!value.toString().trim()) {
          newErrors.placement = "Placement is required";
        }
        break;
      case "idea":
        if (!value.toString().trim()) {
          newErrors.idea = "Please describe your tattoo idea";
        } else if (value.toString().length < 10) {
          newErrors.idea = "Description must be at least 10 characters";
        }
        break;
      case "date":
        if (!value) {
          newErrors.date = "Please select a consultation date";
        } else {
          const tomorrow = addDays(new Date(), 1);
          tomorrow.setHours(0, 0, 0, 0);
          if (value < tomorrow) {
            newErrors.date = "Please select a date at least 1 day in advance";
          }
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone =
        "Please enter a valid phone number (e.g., 123-456-7890)";
    }

    // Style validation
    if (!formData.style) {
      newErrors.style = "Please select a tattoo style";
    }

    // Placement validation
    if (!formData.placement.trim()) {
      newErrors.placement = "Placement is required";
    }

    // Idea validation
    if (!formData.idea.trim()) {
      newErrors.idea = "Please describe your tattoo idea";
    } else if (formData.idea.length < 10) {
      newErrors.idea = "Description must be at least 10 characters";
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = "Please select a consultation date";
    } else {
      const tomorrow = addDays(new Date(), 1);
      tomorrow.setHours(0, 0, 0, 0);
      if (formData.date < tomorrow) {
        newErrors.date = "Please select a date at least 1 day in advance";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const excludedTimes = useMemo(() => {
    if (!bookings || !formData.date) return [];

    const selectedDateStr = format(formData.date, "yyyy-MM-dd");

    const filtered = bookings.filter((b) => {
      if (!b.date) return false;
      const bookingDateStr = b.date.slice(0, 10);
      return b.respond === "Confirm" && bookingDateStr === selectedDateStr;
    });

    const blocked: Date[] = [];
    filtered.forEach((b) => {
      const utcDate = new Date(b.date);
      const localDate = new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds()
      );
      for (let i = -2; i < 3; i++) {
        const slot = new Date(localDate.getTime());
        slot.setMinutes(slot.getMinutes() + i * 30);
        blocked.push(slot);
      }
    });

    return blocked;
  }, [bookings, formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields and try again.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const pad = (n: number) => n.toString().padStart(2, "0");
      const date = formData.date;
      const localDateStr = date
        ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
          )} ${pad(date.getHours())}:${pad(date.getMinutes())}:00+00`
        : null;

      const formPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        style: formData.style,
        size: formData.size,
        placement: formData.placement,
        idea: formData.idea,
        date: localDateStr,
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
      name: userProfile?.full_name || "",
      email: user?.email || "",
      phone: userProfile?.phone || "",
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
      <DialogContent className="sm:max-w-[720px] bg-black/95 dark:bg-white/95 border border-white/20 dark:border-black/10 backdrop-blur-md p-0 rounded-xl overflow-hidden">
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
                        value={formData.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((f) => ({ ...f, name: value }));
                          validateField("name", value);
                        }}
                        className={`bg-white/5 dark:bg-black/5 border-white/20 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/20 dark:focus:border-black/30 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
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
                        value={formData.email}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((f) => ({ ...f, email: value }));
                          validateField("email", value);
                        }}
                        className={`bg-white/5 dark:bg-black/5 border-white/20 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/20 dark:focus:border-black/30 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
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
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((f) => ({ ...f, phone: value }));
                          validateField("phone", value);
                        }}
                        className={`bg-white/5 dark:bg-black/5 border-white/20 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/20 dark:focus:border-black/30 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="tattoo-style"
                        className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                      >
                        Preferred Style
                      </label>
                      <Select
                        onValueChange={(value) => {
                          const selectedCategory = categories.find(
                            (cat) => String(cat.id) === value
                          );
                          const styleName = selectedCategory?.name || "";
                          setFormData((f) => ({
                            ...f,
                            style: styleName,
                          }));
                          validateField("style", styleName);
                        }}
                      >
                        <SelectTrigger
                          className={`bg-white/5 dark:bg-black/5 border-white/20 dark:border-black/10 text-white dark:text-black ${
                            errors.style ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue
                            placeholder={
                              categories.length === 0
                                ? "Loading styles..."
                                : "Select style"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length === 0 ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.style && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.style}
                        </p>
                      )}
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
                          value="Small (2-3')"
                          id="size-small"
                          className="text-white dark:text-black border-white/20 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-small"
                          className="text-white/80 dark:text-black/80"
                        >
                          Small (2-3')
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Medium (4-6')"
                          id="size-medium"
                          className="text-white dark:text-black border-white/20 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-medium"
                          className="text-white/80 dark:text-black/80"
                        >
                          Medium (4-6')
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Large (7-10')"
                          id="size-large"
                          className="text-white dark:text-black border-white/20 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-large"
                          className="text-white/80 dark:text-black/80"
                        >
                          Large (7-10')
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Extra large (11'+)"
                          id="size-xl"
                          className="text-white dark:text-black border-white/20 dark:border-black/30"
                        />
                        <Label
                          htmlFor="size-xl"
                          className="text-white/80 dark:text-black/80"
                        >
                          Extra Large (11'+)
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
                      value={formData.placement}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((f) => ({ ...f, placement: value }));
                        validateField("placement", value);
                      }}
                      className={`bg-white/5 dark:bg-black/5 border-white/20 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/20 dark:focus:border-black/30 ${
                        errors.placement ? "border-red-500" : ""
                      }`}
                    />
                    {errors.placement && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.placement}
                      </p>
                    )}
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
                      value={formData.idea}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((f) => ({ ...f, idea: value }));
                        validateField("idea", value);
                      }}
                      className={`bg-white/5 dark:bg-black/5 border-white/20 dark:border-black/10 text-white dark:text-black placeholder:text-white/30 dark:placeholder:text-black/30 focus:border-white/20 dark:focus:border-black/30 ${
                        errors.idea ? "border-red-500" : ""
                      }`}
                    />
                    {errors.idea && (
                      <p className="text-red-500 text-xs mt-1">{errors.idea}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-white/80 dark:text-black/80 text-sm font-medium mb-2"
                    >
                      Preferred Consultation Date
                    </label>
                    <div className="flex items-center gap-2 bg-white/5 dark:bg-black/5 border border-white/20 dark:border-black/10 rounded-md px-3 py-2">
                      <Calendar className="h-5 w-5 text-white/50 dark:text-black/50" />

                      <DatePicker
                        selected={formData.date}
                        onChange={(date: Date | null) => {
                          setFormData((f) => ({ ...f, date }));
                          validateField("date", date);
                        }}
                        locale={enUS}
                        placeholderText="mm dd,yyyy h:m AM or PM"
                        required
                        className="border-0 bg-transparent text-white dark:text-black focus:ring-0 p-0 focus:outline-none"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        filterDate={(date) => {
                          const tomorrow = addDays(new Date(), 1);
                          tomorrow.setHours(0, 0, 0, 0);
                          return date >= tomorrow;
                        }}
                        minTime={
                          formData.date
                            ? setHours(setMinutes(formData.date, 0), 8)
                            : setHours(setMinutes(new Date(), 0), 8)
                        }
                        maxTime={
                          formData.date
                            ? setHours(setMinutes(formData.date, 0), 21)
                            : setHours(setMinutes(new Date(), 0), 21)
                        }
                        excludeTimes={excludedTimes}
                      />
                    </div>
                    <p className="text-white/50 dark:text-black/50 text-xs mt-1">
                      Please select a date at least 1 day in advance
                    </p>
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                    )}
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
