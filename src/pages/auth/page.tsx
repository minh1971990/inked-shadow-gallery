import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { PiSparkleFill } from "react-icons/pi";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name is required" })
      .regex(/^[\p{L}\s'-]+$/u, {
        message:
          "Full name must contain only letters, spaces, hyphens, or apostrophes",
      }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const forgotSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type SignupFormInputs = z.infer<typeof signupSchema>;
type ForgotFormInputs = z.infer<typeof forgotSchema>;

const Logo = () => (
  <a href="/" className="relative group z-20 mb-8">
    <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative flex items-center">
      <div className="w-10 h-10 mr-2 relative">
        <div className="absolute inset-0 bg-white rounded-full opacity-10"></div>
        <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
          <PiSparkleFill className="text-white/80 text-lg" />
        </div>
      </div>
      <div>
        <span className="text-2xl font-heading font-black tracking-tighter text-white">
          ART LLLEX
        </span>
        <span className="block text-[10px] text-white/60 tracking-widest -mt-1 font-light">
          TATTOO ARTISTRY
        </span>
      </div>
    </div>
  </a>
);

export default function AuthPage() {
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showForgot, setShowForgot] = useState(false);
  const forgotForm = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const signupForm = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleLoginSubmit = async (data: LoginFormInputs) => {
    setAuthError("");
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      navigate("/");
    } catch (err) {
      setAuthError(
        "Email or password is incorrect, please check again before entering."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (data: SignupFormInputs) => {
    setAuthError("");
    setLoading(true);

    try {
      await signUp(data.email, data.password, data.fullName);
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification link",
      });
      signupForm.reset();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (data: ForgotFormInputs) => {
    setAuthError("");
    setLoading(true);
    try {
      await resetPassword(data.email);
      toast({
        title: "Reset Email Sent",
        description: "Please check your email to reset your password.",
      });
      setShowForgot(false);
      forgotForm.reset();
    } catch (err) {
      setAuthError("Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/95">
      <Logo />
      <Card className="w-full max-w-md bg-black/95 border border-white/20 backdrop-blur-md p-0 rounded-xl overflow-hidden">
        <div className="p-6">
          <CardHeader className="p-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-white/10 text-white/80 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white/10 text-white/80 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                {!showForgot ? (
                  <>
                    <motion.form
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...loginForm.register("email", {
                            onChange: () => loginForm.trigger("email"),
                          })}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20"
                        />
                        {loginForm.formState.errors.email && (
                          <p className="text-red-400 text-sm mt-1">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...loginForm.register("password", {
                            onChange: () => loginForm.trigger("password"),
                          })}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20"
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-red-400 text-sm mt-1">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      {authError && (
                        <Alert className="bg-red-900/50 text-red-200 border-red-800">
                          {authError}
                        </Alert>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-white/90 transition-all py-6"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                      <button
                        type="button"
                        className="text-sm text-white/60 hover:underline mt-2 block w-full text-right"
                        onClick={() => setShowForgot(true)}
                      >
                        Forgot password?
                      </button>
                    </motion.form>
                  </>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={forgotForm.handleSubmit(handleForgotSubmit)}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Enter your email to reset password
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...forgotForm.register("email", {
                          onChange: () => forgotForm.trigger("email"),
                        })}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20"
                      />
                      {forgotForm.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {forgotForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    {authError && (
                      <Alert className="bg-red-900/50 text-red-200 border-red-800">
                        {authError}
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-white/90 transition-all py-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Email"
                      )}
                    </Button>
                    <button
                      type="button"
                      className="text-sm text-white/60 hover:underline mt-2 block w-full text-right"
                      onClick={() => setShowForgot(false)}
                    >
                      Back to Login
                    </button>
                  </motion.form>
                )}
              </TabsContent>
              <TabsContent value="signup">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={signupForm.handleSubmit(handleSignUpSubmit)}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      {...signupForm.register("fullName", {
                        onChange: () => signupForm.trigger("fullName"),
                      })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20"
                    />
                    {signupForm.formState.errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">
                        {signupForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...signupForm.register("email", {
                        onChange: () => signupForm.trigger("email"),
                      })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20"
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      {...signupForm.register("password", {
                        onChange: () => {
                          signupForm.trigger("password");
                          signupForm.trigger("confirmPassword");
                        },
                      })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20"
                    />
                    {signupForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...signupForm.register("confirmPassword", {
                        onChange: () => signupForm.trigger("confirmPassword"),
                      })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/20"
                    />
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  {authError && (
                    <Alert className="bg-red-900/50 text-red-200 border-red-800">
                      {authError}
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 transition-all py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </motion.form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </div>
      </Card>
      <Button
        variant="ghost"
        className="mt-6 text-white/70 hover:text-white hover:bg-white/10 transition-all"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
    </div>
  );
}
