"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useUIStore } from "@/store/useUIStore";
import { X, Mail, Lock, Phone, Smartphone, AlertCircle, Globe, Apple } from "lucide-react";

type AuthMode = "login-email" | "login-phone" | "signup";

export default function AuthModal() {
  const isOpen = useUIStore((state) => state.authOpen);
  const setOpen = useUIStore((state) => state.setAuthOpen);
  const addToast = useUIStore((state) => state.addToast);

  const [mode, setMode] = useState<AuthMode>("login-email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setOtpSent(false);
    setOtp("");
    setEmail("");
    setPassword("");
    setPhone("");
    setName("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login-email") {
        const res = await signIn("credentials-email", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
          addToast("Invalid email or password", "error");
        } else {
          addToast("Welcome back to Alemah!", "success");
          handleClose();
        }
      } else {
        // Sign up mock
        addToast("Account created! Logging you in...", "success");
        const res = await signIn("credentials-email", {
          email,
          password,
          redirect: false,
        });
        if (!res?.error) handleClose();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError(null);

    // Mock OTP delivery in development
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      console.log(`[Developer Note] OTP code sent to ${phone}: 123456`);
      addToast("OTP sent! Use '123456' to log in.", "info");
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      setError("Incorrect OTP code. Try '123456'.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials-phone", {
        phone,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        addToast(res.error, "error");
      } else {
        addToast("Logged in successfully!", "success");
        handleClose();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "google" | "apple") => {
    // For demo/sandbox, we simulate oauth by signing in with our credentials mock
    addToast(`Connecting via ${provider === "google" ? "Google" : "Apple"}...`, "info");
    setLoading(true);
    setTimeout(async () => {
      const res = await signIn("credentials-email", {
        email: "user@alemah.com",
        password: "admin123",
        redirect: false,
      });
      if (res?.error) {
        setError("OAuth simulation failed");
      } else {
        addToast("Logged in as Priyansu Kumar", "success");
        handleClose();
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="w-full sm:max-w-md bg-background rounded-t-[24px] sm:rounded-[24px] border border-alemah-sand/40 max-h-[90vh] overflow-y-auto flex flex-col p-6 shadow-2xl animate-slide-up relative textile-pattern"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Dismiss Indicator on top of mobile sheet */}
        <div className="w-12 h-1 bg-alemah-sand/60 rounded-full mx-auto mb-4 sm:hidden" onClick={handleClose} />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-alemah-taupe hover:text-alemah-espresso p-1.5 rounded-full hover:bg-alemah-sand/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Heading */}
        <div className="text-center mt-2 mb-6">
          <h2 className="font-serif text-2xl font-bold text-alemah-espresso">
            {mode === "login-email" && "Welcome to Alemah"}
            {mode === "login-phone" && "Login with Phone"}
            {mode === "signup" && "Create an Account"}
          </h2>
          <p className="font-sans text-xs text-alemah-taupe mt-1">
            Experience premium textiles crafted with legacy
          </p>
        </div>

        {error && (
          <div className="bg-ios-red/10 border border-ios-red/35 p-3.5 rounded-xl flex gap-2 items-start text-xs text-ios-red mb-5 font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Email & Password Submit Form */}
        {(mode === "login-email" || mode === "signup") && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-alemah-espresso pl-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-11 px-4 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-sm font-sans focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-alemah-espresso pl-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-alemah-taupe" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-sm font-sans focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-alemah-espresso pl-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-alemah-taupe" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-sm font-sans focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-sm font-semibold rounded-full ios-active-scale transition-colors shadow-sm mt-2 flex items-center justify-center cursor-pointer"
            >
              {loading ? "Please wait..." : mode === "login-email" ? "Sign In" : "Register"}
            </button>
          </form>
        )}

        {/* Phone & OTP Submit Form */}
        {mode === "login-phone" && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-alemah-espresso pl-1">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 w-4 h-4 text-alemah-taupe" />
                <input
                  type="tel"
                  required
                  disabled={otpSent}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-sm font-sans focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600 disabled:opacity-60"
                />
              </div>
            </div>

            {otpSent && (
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-alemah-espresso pl-1">Verification OTP</label>
                <div className="relative flex items-center">
                  <Smartphone className="absolute left-3 w-4 h-4 text-alemah-taupe" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-sm font-sans focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-right text-xs text-alemah-red-600 hover:text-alemah-red-700 font-sans font-medium"
                >
                  Change phone number
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-sm font-semibold rounded-full ios-active-scale transition-colors shadow-sm mt-2 flex items-center justify-center cursor-pointer"
            >
              {loading ? "Processing..." : otpSent ? "Verify & Login" : "Send OTP Verification"}
            </button>
          </form>
        )}

        {/* Mode Toggle Controls */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-alemah-sand/40"></div>
            <span className="flex-shrink mx-4 text-[10px] font-sans font-medium text-alemah-taupe uppercase tracking-wider">
              Or Continue With
            </span>
            <div className="flex-grow border-t border-alemah-sand/40"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              className="h-11 rounded-full border border-alemah-sand/65 hover:bg-alemah-cream/30 text-alemah-espresso font-sans text-xs font-semibold flex items-center justify-center gap-2 ios-active-scale transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-alemah-red-600" />
              Google
            </button>
            <button
              onClick={() => handleOAuthLogin("apple")}
              disabled={loading}
              className="h-11 rounded-full border border-alemah-sand/65 hover:bg-alemah-cream/30 text-alemah-espresso font-sans text-xs font-semibold flex items-center justify-center gap-2 ios-active-scale transition-colors cursor-pointer"
            >
              <Apple className="w-4 h-4 text-alemah-espresso" />
              Apple
            </button>
          </div>

          <div className="text-center font-sans text-xs mt-3 flex flex-col gap-2">
            {mode === "login-email" && (
              <>
                <button
                  onClick={() => setMode("login-phone")}
                  className="text-alemah-red-600 hover:underline font-semibold"
                >
                  Sign in with Phone & OTP instead
                </button>
                <p className="text-alemah-taupe">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-alemah-espresso hover:underline font-semibold">
                    Sign up
                  </button>
                </p>
              </>
            )}
            {mode === "login-phone" && (
              <>
                <button
                  onClick={() => setMode("login-email")}
                  className="text-alemah-red-600 hover:underline font-semibold"
                >
                  Sign in with Email & Password instead
                </button>
                <p className="text-alemah-taupe">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-alemah-espresso hover:underline font-semibold">
                    Sign up
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-alemah-taupe">
                Already have an account?{" "}
                <button onClick={() => setMode("login-email")} className="text-alemah-espresso hover:underline font-semibold">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
