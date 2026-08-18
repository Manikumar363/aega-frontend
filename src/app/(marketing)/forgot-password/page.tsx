"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { requestPasswordReset, verifyOtp, resetPassword } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "AEGA - Forgot Password";
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (email.includes(" ")) {
      toast.error("Spaces are not allowed in email field");
      setEmail("");
      return;
    }

    setIsLoading(true);
    try {
      toast.loading("Sending OTP...");
      const res = await requestPasswordReset(email.trim());
      toast.dismiss();
      toast.success(res.message || "OTP sent successfully!");
      if (res.otp) {
        toast(`[DEV MODE] OTP: ${res.otp}`, { icon: "🔑", duration: 6000 });
      }
      setStep("verify");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to request password reset");
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    if (otp.includes(" ")) {
      toast.error("Spaces are not allowed in OTP field");
      setOtp("");
      return;
    }

    setIsLoading(true);
    try {
      toast.loading("Verifying OTP...");
      const res = await verifyOtp(email.trim(), otp.trim());
      toast.dismiss();
      toast.success(res.message || "OTP verified successfully!");
      setStep("reset");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to verify OTP");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword.includes(" ") || confirmPassword.includes(" ")) {
      toast.error("Spaces are not allowed in password fields");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      toast.error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    setIsLoading(true);
    try {
      toast.loading("Resetting password...");
      const res = await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });
      toast.dismiss();
      toast.success(res.message || "Password reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to reset password");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050b1f]">
      {/* Background Images */}
      <Image
        src="/common/bg-left-shape.png"
        alt="Background Shape Left"
        fill
        className="object-cover"
        priority
      />

      <Image
        src="/common/bg-right-shape.png"
        alt="Background Shape Right"
        width={700}
        height={500}
        className="absolute right-0 top-0"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="mb-10 text-3xl font-semibold tracking-wide text-white uppercase">
          Forgot Password
        </h1>

        <div className="flex w-full max-w-[1300px] gap-10">
          {/* Left Image */}
          <div className="hidden md:flex w-[360px] justify-center">
            <div className="relative h-[460px] w-[320px] rounded-md">
              <Image
                src="/peter-speech.png"
                alt="Peter Speech"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Form */}
          <div className="flex-1 max-w-[620px]">
            <div className="bg-[#0A1628]/80 border border-white/10 p-8 md:p-10 shadow-2xl">
              {step === "request" && (
                <form onSubmit={handleRequestReset} className="space-y-6">
                  <p className="text-sm text-white/70 text-left">
                    Enter your registered email address below, and we'll send you a verification code (OTP) to reset your password.
                  </p>
                  <div className="text-left">
                    <label className="mb-1 block text-sm text-white/70">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
                      disabled={isLoading}
                      required
                      className="w-full border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Link href="/login" className="text-sm text-white/60 hover:text-[#f7941d]">
                      Back to Sign In
                    </Link>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#f7941d] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      SEND OTP
                    </button>
                  </div>
                </form>
              )}

              {step === "verify" && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <p className="text-sm text-white/70 text-left">
                    We've sent a 6-digit OTP code to <strong className="text-white">{email}</strong>. Enter the OTP code to verify your identity.
                  </p>
                  <div className="text-left">
                    <label className="mb-1 block text-sm text-white/70">
                      OTP Code*
                    </label>
                    <input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\s/g, ""))}
                      disabled={isLoading}
                      required
                      maxLength={6}
                      className="w-full border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50 tracking-widest text-center text-lg"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setStep("request"); setOtp(""); }}
                      className="text-sm text-white/60 hover:text-[#f7941d]"
                    >
                      Change Email
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#f7941d] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      VERIFY OTP
                    </button>
                  </div>
                </form>
              )}

              {step === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-sm text-white/70 text-left">
                    Choose a strong new password for your account.
                  </p>
                  
                  {/* New Password */}
                  <div className="text-left">
                    <label className="mb-1 block text-sm text-white/70">
                      New Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword1 ? "text" : "password"}
                        placeholder="********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value.replace(/\s/g, ""))}
                        disabled={isLoading}
                        required
                        className="w-full border border-white/20 bg-transparent pl-4 pr-12 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword1(!showPassword1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword1 ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] text-white/60 leading-normal">
                      Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters. No spaces allowed.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="text-left">
                    <label className="mb-1 block text-sm text-white/70">
                      Confirm Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword2 ? "text" : "password"}
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ""))}
                        disabled={isLoading}
                        required
                        className="w-full border border-white/20 bg-transparent pl-4 pr-12 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword2(!showPassword2)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword2 ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#f7941d] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      RESET PASSWORD
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
