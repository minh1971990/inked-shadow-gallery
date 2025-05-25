import type React from "react";
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import BookingFormDesktop from "./BookingFormDesktop";
import BookingFormMobile from "./BookingFormMobile";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {isMobile ? (
        <BookingFormMobile isOpen={isOpen} onClose={onClose} />
      ) : (
        <BookingFormDesktop isOpen={isOpen} onClose={onClose} />
      )}
    </Dialog>
  );
};

export default BookingForm;
