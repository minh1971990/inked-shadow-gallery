"use client";

import type React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would call the password reset API
    console.log("Reset password for:", email);

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
      </div>

      <Link to="/" className="mb-8 flex items-center">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
          <span className="text-white font-bold text-xl">I&S</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            INK & SHADOW
          </h3>
          <div className="text-[10px] text-white/60 uppercase tracking-widest -mt-1">
            TATTOO ARTISTRY
          </div>
        </div>
      </Link>

      <div className="w-full max-w-md bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-6">
        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-white/70 mb-6">
              We've sent a password reset link to{" "}
              <span className="text-white">{email}</span>. Please check your
              inbox and follow the instructions.
            </p>
            <p className="text-sm text-white/50 mb-6">
              If you don't see the email, check your spam folder or try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10"
                onClick={() => setIsSubmitted(false)}
              >
                Try Again
              </Button>
              <Button className="bg-white text-black hover:bg-white/90" asChild>
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-2">
              Reset Your Password
            </h2>
            <p className="text-white/70 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 bg-black/30 border-white/10 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Button
          variant="ghost"
          className="text-white/70 hover:text-white"
          asChild
        >
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
