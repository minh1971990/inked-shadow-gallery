"use client";

import type React from "react";
import { useState } from "react";
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

const Contact: React.FC = () => {
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

  return (
    <section
      id="contact"
      className="pt-24 pb-6 bg-black relative overflow-hidden"
    >
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
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 h-full">
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
                            <span>Tuesday - Friday</span>
                            <span className="text-white">
                              12:00 PM - 8:00 PM
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Saturday</span>
                            <span className="text-white">
                              10:00 AM - 6:00 PM
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sunday - Monday</span>
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
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 h-full relative overflow-hidden">
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
                      onClick={() => setFormStep(0)}
                    >
                      Submit Another Request
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
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10"
                          />
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
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10"
                          />
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
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="tattoo-style"
                            className="block text-white/80 text-sm font-medium mb-2"
                          >
                            Preferred Style
                          </label>
                          <Select>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-white/10">
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
                              <SelectItem value="geometric">
                                Geometric
                              </SelectItem>
                              <SelectItem value="minimalist">
                                Minimalist
                              </SelectItem>
                              <SelectItem value="portrait">Portrait</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Approximate Size
                        </label>
                        <RadioGroup
                          defaultValue="medium"
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="small"
                              id="size-small"
                              className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                            />
                            <Label
                              htmlFor="size-small"
                              className="text-white/80"
                            >
                              Small (2-3")
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="medium"
                              id="size-medium"
                              className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                            />
                            <Label
                              htmlFor="size-medium"
                              className="text-white/80"
                            >
                              Medium (4-6")
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="large"
                              id="size-large"
                              className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                            />
                            <Label
                              htmlFor="size-large"
                              className="text-white/80"
                            >
                              Large (7-10")
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="extra-large"
                              id="size-xl"
                              className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                            />
                            <Label htmlFor="size-xl" className="text-white/80">
                              Extra Large (11"+)
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
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10"
                        />
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
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="availability"
                          className="block text-white/80 text-sm font-medium mb-2"
                        >
                          Preferred Consultation Date
                        </label>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-2">
                          <Calendar className="h-5 w-5 text-white/50 dark:text-black/50" />
                          <DatePicker
                            selected={formData.date}
                            onChange={(date: Date | null) =>
                              setFormData((f) => ({ ...f, date }))
                            }
                            locale={enUS}
                            placeholderText="mm/dd/yyyy"
                            required
                            className="border-0 bg-transparent text-white dark:text-black focus:ring-0 p-0 focus:outline-none"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                          />
                        </div>
                        <p className="text-white/50 text-xs mt-1">
                          Please select a date at least 3 days in advance
                        </p>
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
