"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, KeyRound, RefreshCw, ShieldCheck, Star } from "lucide-react";
import { paths } from "@/lib/routing";

type AuthChannel = "mobile" | "email";
type AuthMode = "login" | "signup";
type AuthStep = "identifier" | "otp" | "success";

interface SignedInUser {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
}

const DEMO_RETURNING_HINTS = {
  mobile: "9876543210",
  email: "demo@trustvalue.ai",
};

/** Left-side dark-navy Login / Sign up experience matching the reference UI system. */
export function SignInAuthPanel() {
  const router = useRouter();
  const [channel, setChannel] = useState<AuthChannel>("mobile");
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("identifier");

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [maskedTarget, setMaskedTarget] = useState("");
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [existingSession, setExistingSession] = useState<SignedInUser | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<SignedInUser | null>(null);

  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tv-user");
      if (raw) {
        setExistingSession(JSON.parse(raw));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  const currentIdentifier = channel === "mobile" ? mobile.replace(/\D/g, "") : email.trim();

  const handleSwitchChannel = (next: AuthChannel) => {
    setChannel(next);
    setError("");
    setStatusNote("");
    if (step !== "identifier") {
      setStep("identifier");
      setOtpDigits(["", "", "", "", "", ""]);
      setPreviewOtp(null);
    }
  };

  const handleSwitchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setStatusNote("");
  };

  const sendOtpRequest = async (opts?: { forceMode?: AuthMode; requireProfile?: boolean }) => {
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send",
        channel,
        identifier: currentIdentifier,
        mode: opts?.forceMode ?? mode,
        name: name.trim(),
        requireProfile: opts?.requireProfile ?? false,
      }),
    });
    return res.json();
  };

  const handleContinueIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusNote("");

    if (channel === "mobile" && currentIdentifier.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentIdentifier)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const checkRes = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check",
          channel,
          identifier: currentIdentifier,
        }),
      });
      const checkJson = await checkRes.json();
      if (!checkRes.ok || !checkJson.ok) {
        setError(checkJson.error || "Unable to verify your details.");
        return;
      }

      if (mode === "login" && !checkJson.accountExists) {
        setMode("signup");
        if (name.trim().length < 2) {
          setStatusNote("No account found — enter your display name below to create an account.");
          return;
        }
      }

      const targetMode: AuthMode = checkJson.accountExists ? "login" : mode;
      if (targetMode !== mode) {
        setMode(targetMode);
      }

      if (targetMode === "signup") {
        if (name.trim().length < 2) {
          setError("Enter your display name (at least 2 characters) to create an account.");
          return;
        }
        if (!agreeTerms) {
          setError("Please confirm you are 18+ and accept the Terms and Privacy Notice.");
          return;
        }
      }

      const sent = await sendOtpRequest({
        forceMode: targetMode,
        requireProfile: targetMode === "signup",
      });

      if (!sent.ok) {
        setError(sent.error || "Could not dispatch OTP.");
        return;
      }

      setMaskedTarget(sent.maskedIdentifier);
      setPreviewOtp(sent.previewOtp || null);
      setResendTimer(30);
      setStatusNote(
        targetMode === "login"
          ? `Welcome back${sent.displayName ? `, ${sent.displayName}` : ""}. Enter the OTP sent to ${sent.maskedIdentifier}.`
          : `Verification OTP sent to ${sent.maskedIdentifier}.`
      );
      setStep("otp");
      setTimeout(() => otpInputRefs.current[0]?.focus(), 140);
    } catch {
      setError("Network error while sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, rawVal: string) => {
    const clean = rawVal.replace(/\D/g, "");
    if (!clean) {
      const next = [...otpDigits];
      next[index] = "";
      setOtpDigits(next);
      return;
    }

    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split("");
      const next = ["", "", "", "", "", ""];
      chars.forEach((c, i) => {
        next[i] = c;
      });
      setOtpDigits(next);
      otpInputRefs.current[Math.min(chars.length, 5)]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    setError("");
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const otp = otpDigits.join("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          channel,
          identifier: currentIdentifier,
          otp,
          name: name.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Invalid OTP code.");
        return;
      }

      const loggedUser: SignedInUser = json.user;
      try {
        localStorage.setItem("tv-user", JSON.stringify(loggedUser));
        window.dispatchEvent(new Event("tv-user-updated"));
      } catch {}

      setMode(json.mode || mode);
      setVerifiedUser(loggedUser);
      setExistingSession(loggedUser);
      setStep("success");

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch {
      setError("Network error while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      const sent = await sendOtpRequest({ forceMode: mode });
      if (!sent.ok) {
        setError(sent.error || "Unable to resend OTP.");
        return;
      }
      setOtpDigits(["", "", "", "", "", ""]);
      setPreviewOtp(sent.previewOtp || null);
      setResendTimer(30);
      otpInputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("tv-user");
      window.dispatchEvent(new Event("tv-user-updated"));
    } catch {}
    setExistingSession(null);
    setVerifiedUser(null);
    setStep("identifier");
    setOtpDigits(["", "", "", "", "", ""]);
    setPreviewOtp(null);
    setStatusNote("");
  };

  const autofillPreviewOtp = () => {
    if (!previewOtp || previewOtp.length !== 6) return;
    setOtpDigits(previewOtp.split(""));
    setError("");
    otpInputRefs.current[5]?.focus();
  };

  return (
    <div className="flex flex-col justify-center px-5 py-5 sm:px-10 sm:py-6 lg:px-14 h-full">
      <div className="w-full max-w-[420px] mx-auto">
        {/* Top TrustValue Brand Mark matching screenshot */}
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
            style={{
              backgroundColor: "#FF5A0A",
              boxShadow: "0 4px 14px rgba(255, 90, 10, 0.35)",
            }}
          >
            <Star size={16} fill="#FFFFFF" color="#FFFFFF" />
          </span>
          <span className="text-lg font-extrabold tracking-tight" style={{ color: "#FFFFFF" }}>
            TrustValue
          </span>
        </div>

        {existingSession && step !== "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 space-y-5"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center font-extrabold text-lg shrink-0"
                style={{ backgroundColor: "#FF5A0A", color: "#FFFFFF" }}
              >
                {existingSession.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8FA2C7" }}>
                  Active Account
                </p>
                <h1 className="text-xl font-extrabold truncate" style={{ color: "#FFFFFF" }}>
                  {existingSession.name}
                </h1>
                <p className="text-xs truncate" style={{ color: "#9FB0D0" }}>
                  {existingSession.phone ? `+91 ${existingSession.phone}` : existingSession.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href={paths.home()}
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold no-underline hover:opacity-95 transition-opacity"
                style={{
                  backgroundColor: "#FF5A0A",
                  color: "#FFFFFF",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px -6px rgba(255, 90, 10, 0.6)",
                }}
              >
                <span>Continue to TrustValue</span>
                <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
                className="hover:bg-white/15 transition-colors"
              >
                Switch account
              </button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ================= STEP 1: LOG IN / SIGN UP (MATCHES REFERENCE SCREENSHOTS) ================= */}
            {step === "identifier" && (
              <motion.div
                key="step-identifier"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                {/* 2-Button Rounded Pill Switcher: Log in | Sign up */}
                <div
                  className="grid grid-cols-2 p-1 rounded-xl mb-5"
                  role="tablist"
                  aria-label="Account mode"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                  }}
                >
                  {(
                    [
                      { id: "login", label: "Log in" },
                      { id: "signup", label: "Sign up" },
                    ] as const
                  ).map((item) => {
                    const active = mode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => handleSwitchMode(item.id)}
                        style={{
                          position: "relative",
                          minHeight: "40px",
                          padding: "8px 14px",
                          borderRadius: "9px",
                          fontSize: "13.5px",
                          fontWeight: active ? 700 : 600,
                          color: active ? "#FFFFFF" : "#8FA2C7",
                          backgroundColor: "transparent",
                        }}
                        className="relative inline-flex items-center justify-center whitespace-nowrap transition-colors hover:text-white"
                      >
                        {active && (
                          <motion.span
                            layoutId="signin-mode-pill"
                            transition={{ type: "spring", stiffness: 360, damping: 30 }}
                            className="absolute inset-0 rounded-[9px]"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.08)",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                            }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Heading + Subtitle */}
                <div className="mb-5">
                  <h1
                    className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-tight"
                    style={{ color: "#FFFFFF", margin: 0 }}
                  >
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed" style={{ color: "#94A3C0" }}>
                    {mode === "login"
                      ? "Log in with a one-time code sent to your mobile or email."
                      : "Verify your mobile number or email with a one-time code to get started."}
                  </p>
                </div>

                <form onSubmit={handleContinueIdentifier} noValidate className="space-y-4">
                  {/* Label Row + White-Active Channel Toggle */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label
                        htmlFor={channel === "mobile" ? "auth-mobile" : "auth-email"}
                        className="text-xs sm:text-[13px] font-bold"
                        style={{ color: "#FFFFFF" }}
                      >
                        {channel === "mobile" ? "Mobile number" : "Email address"}
                      </label>

                      <div
                        className="inline-flex rounded-lg p-0.5"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.14)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleSwitchChannel("mobile")}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "6px",
                            backgroundColor: channel === "mobile" ? "#FFFFFF" : "transparent",
                            color: channel === "mobile" ? "#06132F" : "#94A3C0",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                          className="whitespace-nowrap transition-all"
                        >
                          Mobile
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchChannel("email")}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "6px",
                            backgroundColor: channel === "email" ? "#FFFFFF" : "transparent",
                            color: channel === "email" ? "#06132F" : "#94A3C0",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                          className="whitespace-nowrap transition-all"
                        >
                          Email
                        </button>
                      </div>
                    </div>

                    {/* Single Unified Dark Glass Input */}
                    {channel === "mobile" ? (
                      <div
                        className="flex items-center h-12 rounded-xl overflow-hidden transition-colors focus-within:border-[#FF5A0A]"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.16)",
                        }}
                      >
                        <span
                          className="inline-flex items-center justify-center h-full px-4 text-sm font-bold shrink-0"
                          style={{
                            color: "#FFFFFF",
                            borderRight: "1px solid rgba(255, 255, 255, 0.14)",
                          }}
                        >
                          +91
                        </span>
                        <input
                          id="auth-mobile"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                            setError("");
                          }}
                          className="w-full h-full px-3.5 bg-transparent text-sm font-medium focus:outline-none placeholder:text-[#6E81A8]"
                          style={{ color: "#FFFFFF" }}
                        />
                      </div>
                    ) : (
                      <div
                        className="flex items-center h-12 rounded-xl overflow-hidden transition-colors focus-within:border-[#FF5A0A]"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.16)",
                        }}
                      >
                        <input
                          id="auth-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          className="w-full h-full px-4 bg-transparent text-sm font-medium focus:outline-none placeholder:text-[#6E81A8]"
                          style={{ color: "#FFFFFF" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Sign Up Extra Fields: Display Name + Orange Checkbox */}
                  <AnimatePresence initial={false}>
                    {mode === "signup" && (
                      <motion.div
                        key="signup-extra"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="overflow-hidden space-y-3.5"
                      >
                        <div>
                          <label
                            htmlFor="auth-name"
                            className="block text-xs sm:text-[13px] font-bold mb-2"
                            style={{ color: "#FFFFFF" }}
                          >
                            Display name
                          </label>
                          <div
                            className="flex items-center h-12 rounded-xl overflow-hidden transition-colors focus-within:border-[#FF5A0A]"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.03)",
                              border: "1px solid rgba(255, 255, 255, 0.16)",
                            }}
                          >
                            <input
                              id="auth-name"
                              type="text"
                              autoComplete="name"
                              maxLength={40}
                              placeholder="Shown on reviews (e.g. Priya S.)"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                              }}
                              className="w-full h-full px-4 bg-transparent text-sm font-medium focus:outline-none placeholder:text-[#6E81A8]"
                              style={{ color: "#FFFFFF" }}
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={agreeTerms}
                            onClick={() => setAgreeTerms((v) => !v)}
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "5px",
                              backgroundColor: agreeTerms ? "#FF5A0A" : "transparent",
                              border: agreeTerms ? "1px solid #FF5A0A" : "1px solid rgba(255,255,255,0.3)",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {agreeTerms && <Check size={12} strokeWidth={3} color="#FFFFFF" />}
                          </button>
                          <span style={{ color: "#9FB0D0" }}>
                            I&apos;m 18+ and accept the{" "}
                            <Link
                              href={paths.termsAndcondition()}
                              className="font-bold underline"
                              style={{ color: "#FFFFFF" }}
                            >
                              Terms
                            </Link>{" "}
                            and{" "}
                            <Link
                              href={paths.termsAndcondition()}
                              className="font-bold underline"
                              style={{ color: "#FFFFFF" }}
                            >
                              Privacy Notice
                            </Link>
                            .
                          </span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status / Error */}
                  {statusNote && !error && (
                    <div
                      className="rounded-xl px-3.5 py-2 text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        color: "#E2E8F0",
                      }}
                    >
                      {statusNote}
                    </div>
                  )}

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl px-3.5 py-2 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(208, 34, 10, 0.18)",
                        border: "1px solid rgba(255, 122, 92, 0.45)",
                        color: "#FFB4A6",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Primary Glowing Orange CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      minHeight: "48px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "13px 20px",
                      backgroundColor: "#FF5A0A",
                      color: "#FFFFFF",
                      borderRadius: "12px",
                      fontSize: "14.5px",
                      fontWeight: 700,
                      border: "none",
                      cursor: loading ? "wait" : "pointer",
                      boxShadow: "0 10px 28px -6px rgba(255, 90, 10, 0.65)",
                    }}
                    className="hover:brightness-110 transition-all active:scale-[0.99] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === "login" ? "Send login OTP" : "Create account and send OTP"}
                        </span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {/* Bottom Row: Review policy (left) + Dashed Try demo pill (right) */}
                  <div className="pt-1 flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={paths.termsAndcondition()}
                      className="font-bold underline"
                      style={{ color: "#FFFFFF" }}
                    >
                      Review policy
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setStatusNote("");
                        if (channel === "mobile") {
                          setMobile(DEMO_RETURNING_HINTS.mobile);
                        } else {
                          setEmail(DEMO_RETURNING_HINTS.email);
                        }
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "999px",
                        border: "1px dashed rgba(255, 255, 255, 0.24)",
                        color: "#FFFFFF",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        backgroundColor: "transparent",
                      }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      Try demo: {channel === "mobile" ? DEMO_RETURNING_HINTS.mobile : DEMO_RETURNING_HINTS.email}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ================= STEP 2: OTP VERIFICATION ================= */}
            {step === "otp" && (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <div className="mb-5">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      color: "#FFFFFF",
                    }}
                  >
                    <KeyRound size={12} style={{ color: "#FF5A0A" }} />
                    <span>{mode === "login" ? "Log in Verification" : "New Account Verification"}</span>
                  </div>
                  <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight" style={{ color: "#FFFFFF" }}>
                    Enter 6-digit OTP
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm" style={{ color: "#94A3C0" }}>
                    Sent via {channel === "mobile" ? "SMS" : "email"} to{" "}
                    <strong style={{ color: "#FFFFFF" }}>{maskedTarget}</strong>{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setStep("identifier");
                        setError("");
                        setOtpDigits(["", "", "", "", "", ""]);
                      }}
                      style={{
                        color: "#FF5A0A",
                        fontWeight: 700,
                        fontSize: "12px",
                        textDecoration: "underline",
                        marginLeft: "4px",
                      }}
                    >
                      Change
                    </button>
                  </p>
                </div>

                {previewOtp && (
                  <div
                    className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 mb-4"
                    style={{
                      backgroundColor: "rgba(255, 170, 0, 0.12)",
                      border: "1px solid rgba(255, 170, 0, 0.35)",
                    }}
                  >
                    <div className="text-xs" style={{ color: "#FFE3B3" }}>
                      Demo OTP:{" "}
                      <strong className="font-mono text-sm tracking-wider" style={{ color: "#FFFFFF" }}>
                        {previewOtp}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={autofillPreviewOtp}
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "#06132F",
                        padding: "5px 11px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                      className="hover:opacity-90 transition-opacity shrink-0"
                    >
                      Autofill
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} noValidate className="space-y-4">
                  <div>
                    <label className="sr-only" htmlFor="otp-0">
                      6-digit verification code
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete={idx === 0 ? "one-time-code" : "off"}
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          aria-label={`OTP digit ${idx + 1}`}
                          className="h-12 w-full text-center font-mono text-lg font-extrabold rounded-xl focus:outline-none focus:border-[#FF5A0A] transition-all"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            color: "#FFFFFF",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl px-3.5 py-2 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(208, 34, 10, 0.18)",
                        border: "1px solid rgba(255, 122, 92, 0.45)",
                        color: "#FFB4A6",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      minHeight: "48px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "13px 20px",
                      backgroundColor: "#FF5A0A",
                      color: "#FFFFFF",
                      borderRadius: "12px",
                      fontSize: "14.5px",
                      fontWeight: 700,
                      border: "none",
                      cursor: loading ? "wait" : "pointer",
                      boxShadow: "0 10px 28px -6px rgba(255, 90, 10, 0.65)",
                    }}
                    className="hover:brightness-110 transition-all active:scale-[0.99] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Verifying code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>{mode === "login" ? "Verify & Log in" : "Verify & Create Account"}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs" style={{ color: "#94A3C0" }}>
                    <span>Didn&apos;t receive the code?</span>
                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={handleResendOtp}
                      style={{
                        color: resendTimer > 0 ? "#6E81A8" : "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      className="hover:underline disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ================= STEP 3: VERIFIED SUCCESS ================= */}
            {step === "success" && verifiedUser && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="rounded-2xl p-7 text-center space-y-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto h-14 w-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(47, 208, 138, 0.16)", color: "#2FD08A" }}
                >
                  <CheckCircle2 size={30} />
                </motion.div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#FFFFFF" }}>
                    {mode === "login"
                      ? `Welcome back, ${verifiedUser.name}`
                      : `Account created, ${verifiedUser.name}`}
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm" style={{ color: "#94A3C0" }}>
                    Your {channel === "mobile" ? "mobile number" : "email"} is verified. Redirecting to TrustValue...
                  </p>
                </div>

                <Link
                  href={paths.home()}
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold no-underline hover:opacity-95"
                  style={{
                    backgroundColor: "#FF5A0A",
                    color: "#FFFFFF",
                    padding: "12px 22px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px -6px rgba(255, 90, 10, 0.6)",
                  }}
                >
                  <span>Go to Home now</span>
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
