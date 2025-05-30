import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
import {
  Clock,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  CheckCircle2,
  Loader2,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import { format, setMinutes, setHours, addDays } from "date-fns";
import { useCategories, useBookings } from "@/hooks/use-supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { useMemo } from "react";

const Contact: React.FC = () => {
  const { toast } = useToast();
  const { categories = [] } = useCategories();
  const { bookings = [] } = useBookings();
  const { user, userProfile, checkBookingRespond, refetchBookingRespond } =
    useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const LoginPromt = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Secure Consultation
        </h3>
        <p className="text-white/70 max-w-md mb-8">
          Please login to request a consultation. This helps us maintain the
          security and privacy of your personal information.
        </p>
        <Button
          onClick={handleLogin}
          className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium"
        >
          Login to Continue
        </Button>
      </div>
    );
  };

  const WaitingRespond = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Please wait for the respond
        </h3>
        <p className="text-white/70 max-w-md mb-8">
          Wait until the admin responds to your appointment before you can book
          another one.
        </p>
      </div>
    );
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

      if (typeof refetchBookingRespond === "function") {
        await refetchBookingRespond();
      }

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
    setErrors({});
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    if (
      checkBookingRespond?.respond === "Reject" &&
      checkBookingRespond?.updated_at
    ) {
      const updatedAt = new Date(checkBookingRespond.updated_at);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 3) {
        setHoursLeft(3 - hoursDiff);
      }
    }
  }, [checkBookingRespond]);

  const Rejected = () => {
    const updatedAt = new Date(checkBookingRespond.updated_at);
    const now = new Date();

    const hoursDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 3) {
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Not enough time yet
          </h3>
          <p className="text-white/70 max-w-md mb-8">
            You need to wait another {hoursLeft.toFixed(1)} hours before you can
            book a new appointment. Please be patient!
          </p>
        </div>
      );
    }
  };

  const Confirmed = () => {
    const appointmentDate = new Date(checkBookingRespond.date);
    const now = new Date();

    if (now >= appointmentDate) {
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Please wait until your appointment is completed
          </h3>
          <p className="text-white/70 mt-2 mb-4 text-sm sm:text-base max-w-[90%] sm:max-w-md">
            Your current appointment will be start at <br></br>
            {checkBookingRespond?.date
              ? new Date(checkBookingRespond.date).toLocaleString(undefined, {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                })
              : ""}
          </p>
          <p className="text-white/70 max-w-md mb-8">
            You must wait until your current appointment is completed before
            booking a new one. Please be patient!
          </p>
        </div>
      );
    }
  };

  return (
    <section id="contact" className="pt-24 bg-black relative overflow-hidden">
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
                Get In Touch
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/70"></div>
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white tracking-tight">
              Book Your Consultation
            </h2>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Ready to bring your vision to life? Schedule a consultation with our
            talented artists and take the first step towards your custom tattoo
            masterpiece.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Information */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/20 h-full">
                <div className="relative mb-8">
                  <div className="absolute -top-12 -left-8 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
                  <h3 className="text-2xl font-bold text-white mb-2 relative">
                    Studio Information
                  </h3>
                  <div className="w-12 h-[2px] bg-gradient-to-r from-white/80 to-white/20"></div>
                </div>

                <div className="space-y-8">
                  {/* Studio Hours */}
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Clock className="w-5 h-5 text-white/80" />
                      </div>
                      <div>
                        <h4 className="text-white text-lg font-medium mb-3">
                          Studio Hours
                        </h4>
                        <ul className="space-y-2 text-white/70">
                          <li className="flex justify-between">
                            <span className="me-5">Monday - Saturday</span>
                            <span className="text-white">
                              08:30 AM - 9:00 PM
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sunday</span>
                            <span className="text-white/50">Closed</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white/80" />
                      </div>
                      <div>
                        <h4 className="text-white/50 text-sm">Email</h4>
                        <p className="text-white">
                          artlllex.official@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white/80" />
                      </div>
                      <div>
                        <h4 className="text-white/50 text-sm">Phone</h4>
                        <p className="text-white">(301) 232-8339</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white/80" />
                      </div>
                      <div>
                        <h4 className="text-white/50 text-sm">Location</h4>
                        <p className="text-white">
                          8607 2nd Ave, Silver Spring, MD 20910, US
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h4 className="text-white text-lg font-medium mb-3">
                      Follow Our Work
                    </h4>
                    <div className="flex space-x-3">
                      <a
                        href="https://www.instagram.com/art_lllex/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/20 h-full relative overflow-hidden">
                {/* Form Success State */}
                {formStep === 1 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Consultation Request Sent!
                    </h3>
                    <p className="text-white/70 max-w-md mb-8">
                      Thank you for reaching out. We'll review your request and
                      get back to you within 24 hours to confirm your
                      appointment.
                    </p>
                    <Button
                      variant="outline"
                      className="border-white/20 text-black hover:bg-white/40 hover:text-white"
                      onClick={resetForm}
                    >
                      Continue...
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <div className="relative mb-8">
                      <div className="absolute -top-12 -right-8 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Request a Consultation
                      </h3>
                      <div className="w-12 h-[2px] bg-gradient-to-r from-white/80 to-white/20"></div>
                    </div>

                    {!user ? (
                      <LoginPromt />
                    ) : checkBookingRespond?.email &&
                      checkBookingRespond?.respond == null ? (
                      <WaitingRespond />
                    ) : checkBookingRespond?.respond === "Reject" ? (
                      <Rejected />
                    ) : checkBookingRespond?.respond === "Confirm" ? (
                      <Confirmed />
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-white/80 text-sm font-medium mb-2"
                            >
                              Full Name
                            </label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, name: value });
                                validateField("name", value);
                              }}
                              className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10 ${
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
                              className="block text-white/80 text-sm font-medium mb-2"
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
                                setFormData({ ...formData, email: value });
                                validateField("email", value);
                              }}
                              className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10 ${
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-white/80 text-sm font-medium mb-2"
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
                                setFormData({ ...formData, phone: value });
                                validateField("phone", value);
                              }}
                              className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10 ${
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
                              className="block text-white/80 text-sm font-medium mb-2"
                            >
                              Preferred Style
                            </label>
                            <Select
                              onValueChange={(value) => {
                                const selectedCategory = categories.find(
                                  (cat) => String(cat.id) === value
                                );
                                const styleName = selectedCategory?.name || "";
                                setFormData({
                                  ...formData,
                                  style: styleName,
                                });
                                validateField("style", styleName);
                              }}
                            >
                              <SelectTrigger
                                className={`bg-white/5 border-white/20 text-white focus:ring-white/10 ${
                                  errors.style ? "border-red-500" : ""
                                }`}
                              >
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={String(category.id)}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Approximate Size
                          </label>
                          <RadioGroup
                            value={formData.size}
                            className="flex flex-wrap gap-4"
                            onValueChange={(value) =>
                              setFormData({ ...formData, size: value })
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Small (2-3')"
                                id="size-small"
                                className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                              />
                              <Label
                                htmlFor="size-small"
                                className="text-white/80"
                              >
                                Small (2-3')
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Medium (4-6')"
                                id="size-medium"
                                className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                              />
                              <Label
                                htmlFor="size-medium"
                                className="text-white/80"
                              >
                                Medium (4-6')
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Large (7-10')"
                                id="size-large"
                                className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                              />
                              <Label
                                htmlFor="size-large"
                                className="text-white/80"
                              >
                                Large (7-10')
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Extra large (11'+)"
                                id="size-xl"
                                className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                              />
                              <Label
                                htmlFor="size-xl"
                                className="text-white/80"
                              >
                                Extra Large (11'+)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <label
                            htmlFor="placement"
                            className="block text-white/80 text-sm font-medium mb-2"
                          >
                            Desired Placement
                          </label>
                          <Input
                            id="placement"
                            placeholder="e.g., Forearm, Back, Shoulder, etc."
                            value={formData.placement}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, placement: value });
                              validateField("placement", value);
                            }}
                            className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10 ${
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
                            className="block text-white/80 text-sm font-medium mb-2"
                          >
                            Tattoo Description
                          </label>
                          <Textarea
                            id="tattoo-idea"
                            placeholder="Please describe your tattoo idea in detail. Include any reference images or specific elements you'd like to incorporate."
                            rows={4}
                            value={formData.idea}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, idea: value });
                              validateField("idea", value);
                            }}
                            className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/10 ${
                              errors.idea ? "border-red-500" : ""
                            }`}
                          />
                          {errors.idea && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.idea}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="availability"
                            className="block text-white/80 text-sm font-medium mb-2"
                          >
                            Preferred Consultation Date
                          </label>
                          <div
                            className={`flex items-center gap-2 bg-white/5 border ${
                              errors.date ? "border-red-500" : "border-white/20"
                            } rounded-md px-3 py-2`}
                          >
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
                          {errors.date && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.date}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-white text-black hover:bg-white/90 transition-all py-6 text-lg font-medium"
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
                      </form>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
