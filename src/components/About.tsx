"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, Star, Clock, Users, ChevronRight } from "lucide-react";

const About: React.FC = () => {
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
            Dedicated to the art of black and grey tattoo design, creating
            unique pieces that tell your story through ink.
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
                  <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 text-xs">Experience</span>
                    </div>
                    <p className="text-white text-xl font-bold">15+ Years</p>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 text-xs">Clients</span>
                    </div>
                    <p className="text-white text-xl font-bold">1,000+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative border */}
            <div className="absolute top-8 -right-8 w-full h-full border-2 border-white/20 rounded-lg -z-10"></div>

            {/* Artist name card */}
            <div className="absolute -bottom-12 -left-12 bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10 z-20">
              <h3 className="text-white text-2xl font-bold mb-1">
                Alex Rivera
              </h3>
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
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Award className="w-6 h-6 text-white/80" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    My Journey
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    With over 15 years of experience in fine art and 10 years
                    specializing in tattoo design, I've developed a distinctive
                    style focused on black and grey realism with contemporary
                    elements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Star className="w-6 h-6 text-white/80" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Recognition
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    My work has been featured in international tattoo
                    publications and exhibitions. I believe in creating custom
                    pieces that not only look stunning but carry personal
                    significance for each client.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {[
                    "Black & Grey",
                    "Dotwork",
                    "Line Art",
                    "Geometric",
                    "Minimalist",
                    "Realism",
                  ].map((specialty) => (
                    <motion.span
                      key={specialty}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/90 text-sm backdrop-blur-sm"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {specialty}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-white text-xl font-semibold">Philosophy</h3>
                <p className="text-white/70 leading-relaxed">
                  "I believe tattoos are more than just ink on skin—they're
                  permanent expressions of identity, stories, and art. My goal
                  is to collaborate with each client to create a piece that
                  resonates with their personal journey while standing as a
                  timeless work of art."
                </p>
                <div className="pt-4">
                  <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 group">
                    Read Full Bio
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
