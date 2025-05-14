"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import BookingForm from "./BookingForm";

interface BookingContextType {
  openBookingForm: () => void;
  closeBookingForm: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const openBookingForm = () => setIsBookingFormOpen(true);
  const closeBookingForm = () => setIsBookingFormOpen(false);

  return (
    <BookingContext.Provider value={{ openBookingForm, closeBookingForm }}>
      {children}
      <BookingForm isOpen={isBookingFormOpen} onClose={closeBookingForm} />
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
