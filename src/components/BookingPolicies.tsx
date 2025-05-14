"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useBooking } from "./BookingContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  Clock,
  AlertCircle,
  CreditCard,
  CheckCircle,
  XCircle,
  CalendarDays,
  HelpCircle,
} from "lucide-react";

const BookingPolicies: React.FC = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const { openBookingForm } = useBooking();
  return (
    <section
      id="policies"
      className="pt-24 pb-12 bg-black relative overflow-hidden"
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
                POLICY
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/70"></div>
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white tracking-tight">
              Booking Information
            </h2>
          </div>
          <div className="text-white/80 max-w-2xl mx-auto text-lg">
            <p>First thing,</p>
            <br />
            <div className="w-full">
              <span className="font-extrabold">
                Please be aware of scammers
              </span>{" "}
              who typically contact you for deposit or credit card information
              using similar names and false pretenses, such as claiming to need
              the information for a deposit.
            </div>
            <br />
            <p>
              <b>ANY</b> payment forms other than these are <b>UNVALIDATED.*</b>
            </p>
            <p className="italic font-light">
              "Please double check the payment forms correctly before making
              transaction."
            </p>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Tabs
            defaultValue="booking"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-full">
                <TabsTrigger
                  value="booking"
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black ${
                    activeTab === "booking"
                      ? ""
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Booking Process
                </TabsTrigger>
                <TabsTrigger
                  value="cancellation"
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black ${
                    activeTab === "cancellation"
                      ? ""
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Cancellation
                </TabsTrigger>
                <TabsTrigger
                  value="reschedule"
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black ${
                    activeTab === "reschedule"
                      ? ""
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Rescheduling
                </TabsTrigger>
              </TabsList>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
            >
              <TabsContent value="booking" className="mt-0">
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Booking
                      </h3>
                      <ul className="space-y-2 text-white/70 list-disc pl-5">
                        <li>
                          Consultation is <b className="text-white">free</b>.
                        </li>
                        <li>
                          A deposit is only required for clients who are
                          interested in scheduling an appointment.
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-white/10 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-white/70" />
                          Important Note
                        </h4>
                        <p className="text-white/70 text-sm">
                          New bookings are held for 24 hours pending deposit
                          payment. After this window, the time slot may be given
                          to the next client if payment is not received.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Deposit
                      </h3>
                      <p className="text-white/80 mb-4">
                        Deposits are non-refundable and will be applied to the
                        final cost of your service.
                      </p>
                      <div className="mt-6 mb-6 p-4 bg-white/10 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-white/70" />
                          Pricing ?
                        </h4>
                        <ul className="space-y-2 text-white/70 list-disc pl-5">
                          <li>I rated by piece.</li>
                          <li>
                            Estimate price will be provided before any further
                            steps.
                          </li>
                          <li>
                            <b>
                              My minimum rated is{" "}
                              <span className="text-white">$300 </span>.
                            </b>
                          </li>
                        </ul>
                      </div>
                      <p className="text-white">
                        <b>Please beware of scammers!</b>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Appointment Preparation
                      </h3>
                      <p className="text-white/80 mb-4">
                        To ensure the best experience and results for your
                        tattoo session:
                      </p>
                      <ul className="space-y-2 text-white/70 list-disc pl-5">
                        <li>
                          You may bring friends, snacks, no-smell food, and
                          drinks.
                        </li>
                        <li>
                          <b className="text-white">No pets allowed</b> during
                          appointments.
                        </li>
                        <li>
                          Please{" "}
                          <b className="text-white">
                            avoid alcohol, drugs, numbing cream, chemicals, or
                            painkillers
                          </b>{" "}
                          for at least 24 hours before your appointment.
                        </li>
                        <li>
                          Let us know if you are{" "}
                          <b className="text-white">taking any medications</b>.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Button
                    className="bg-white text-black hover:bg-white/90 rounded-full px-8"
                    onClick={openBookingForm}
                  >
                    Book Consultation
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="cancellation" className="mt-0">
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Cancellation Policy
                      </h3>
                      <p className="text-white/80 mb-4">
                        I understand that last-minute changes can be
                        unpredictable, so please keep me informed of your
                        situation to avoid losing your deposit. Our cancellation
                        policy is as follows:
                      </p>

                      <div className="space-y-4 mb-6">
                        <div className="bg-white/10 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <XCircle className="w-4 h-4 mr-2 text-white/70" />
                            No-show Policy
                          </h4>
                          <p className="text-white/70">
                            <b className="text-white">No-show</b> appointment
                            <b className="text-white"> can not</b> be
                            rescheduled, Deposit will{" "}
                            <b className="text-white">be taken</b>.
                          </p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-white/70" />
                            Late Arrival
                          </h4>
                          <p className="text-white/70">
                            Appointment will be marked as No-show after{" "}
                            <b className="text-white">30 </b>
                            minutes late.
                          </p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-white/70" />
                            Major Design Change Policy
                          </h4>
                          <p className="text-white/70">
                            If clients wish to switch to a completely different
                            design or concept than the one originally discussed,
                            they will need to schedule a new appointment and pay
                            a new deposit to secure it, as the original deposit
                            will be forfeited.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-white/10 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <HelpCircle className="w-4 h-4 mr-2 text-white/70" />
                          Design Revisions & Clarifications
                        </h4>
                        <p className="text-white/70 text-sm">
                          Concept's misunderstanding or Design's minor
                          adjustments: I am more than happy to continue working
                          on the design personally with my clients during their
                          scheduled appointments, providing explanations and
                          advice until we are both satisfied with the result, no
                          reschedule needed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Special Circumstances
                      </h3>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value="item-1"
                          className="border-white/10"
                        >
                          <AccordionTrigger className="text-white hover:text-white/80">
                            Illness or COVID-19 Symptoms
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70">
                            If you are experiencing symptoms of illness,
                            including COVID-19 symptoms, please reschedule your
                            appointment. In these cases, your deposit will be
                            transferred to your new appointment date regardless
                            of notice time.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem
                          value="item-2"
                          className="border-white/10"
                        >
                          <AccordionTrigger className="text-white hover:text-white/80">
                            Medical Emergencies
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70">
                            For medical emergencies with documentation, we will
                            work with you to reschedule your appointment and
                            transfer your deposit. Please contact us as soon as
                            possible.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem
                          value="item-3"
                          className="border-white/10"
                        >
                          <AccordionTrigger className="text-white hover:text-white/80">
                            Artist Cancellations
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70">
                            In the rare event that your artist needs to cancel
                            or reschedule, you will be notified as soon as
                            possible, and your deposit will be fully
                            transferable to your new appointment date or
                            refundable if you prefer.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reschedule" className="mt-0">
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Rescheduling Policy
                      </h3>
                      <p className="text-white/80 mb-4">
                        Each appointment is allowed{" "}
                        <b className="text-white">one</b> guaranteed reschedule,
                        which must be announced at least 5 days prior to the
                        scheduled date, and any subsequent rescheduling will
                        require a new deposit, with the previous deposit being
                        forfeited.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-white/70 mb-6">
            If you have any questions about our booking, cancellation, or
            rescheduling policies, please don't hesitate to contact us.
          </p>
          <a
            className="flex flex-col sm:flex-row gap-4 justify-center "
            href="#contact"
          >
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-white/90"
            >
              Contact Us
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BookingPolicies;
