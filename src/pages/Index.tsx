import React from "react";
import Navbar from "../components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import BookingPolicies from "@/components/BookingPolicies";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Gallery />
      <About />
      <BookingPolicies />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
