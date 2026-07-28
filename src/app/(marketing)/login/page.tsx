"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { login, storeAuthToken, storeUserData } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import Captcha from "@/components/auth/Captcha";

function SignInContent() {
  const [activeRole, setActiveRole] = useState<"agent" | "university">("agent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  useEffect(() => {
    document.title = "AEGA - Sign In";
    if (roleParam === "university" || roleParam === "agent") {
      setActiveRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleSwitch = (role: "agent" | "university") => {
    setActiveRole(role);
    setEmail("");
    setPassword("");
    setCaptchaInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate spaces
      if (email.includes(" ") || password.includes(" ")) {
        toast.error("Spaces are not allowed in both fields");
        setEmail("");
        setPassword("");
        setCaptchaInput("");
        setIsLoading(false);
        return;
      }

      // Validate inputs
      if (!email || !password) {
        toast.error("Please fill in all fields");
        setEmail("");
        setPassword("");
        setCaptchaInput("");
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Please enter a valid email");
        setEmail("");
        setPassword("");
        setCaptchaInput("");
        setIsLoading(false);
        return;
      }

      // Validate Captcha
      if (captchaInput.trim().toUpperCase() !== captchaCode.trim().toUpperCase()) {
        toast.error("Invalid Captcha code. Please try again.");
        setCaptchaInput("");
        setIsLoading(false);
        return;
      }

      // Prepare login data
      const loginData = {
        email: email.trim(),
        password: password,
        role: activeRole, // Pass active role to backend for verification
      };

      // Call login API
      toast.loading("Signing in...");
      const response = await login(loginData);

      // Store auth token and user data
      storeAuthToken(response.token);
      storeUserData(response.user);

      // Show success message
      toast.dismiss();
      toast.success("Login successful!");

      // Redirect to appropriate dashboard
      setTimeout(() => {
        router.push(
          activeRole === "agent" ? "/agent/dashboard" : "/university/dashboard"
        );
      }, 1500);
    } catch (error) {
      toast.dismiss();
      // Erase submitted fields on failure
      setEmail("");
      setPassword("");
      setCaptchaInput("");
      
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050b1f]">
      {/* Background Images */}
      <Image
        src="/common/bg-left-shape.png"
        alt="1"
        fill
        className="object-cover"
        priority
      />

      <Image
        src="/common/bg-right-shape.png"
        alt="3"
        width={700}
        height={500}
        className="absolute right-0 top-0"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Title */}
        <h1 className="mb-10 text-3xl font-semibold tracking-wide text-white">
          SIGN IN
        </h1>

        {/* Main Card */}
        <div className="flex w-full max-w-[1300px] gap-10">
          {/* Left Image */}
          <div className="hidden md:flex w-[360px] justify-center">
            <div className="relative h-[460px] w-[320px] rounded-md">
              <Image
                src="/peter-speech.png"
                alt="peter-seminar"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Form */}
          <div className="flex-1 max-w-[620px]">
            {/* Toggle */}
            <div className="flex mb-6">
              <button
                type="button"
                onClick={() => handleRoleSwitch("agent")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeRole === "agent"
                    ? "bg-[#f7941d] text-white"
                    : "border border-white/30 text-white"
                }`}
              >
                AGENT
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch("university")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeRole === "university"
                    ? "bg-[#f7941d] text-white"
                    : "border border-white/30 text-white"
                }`}
              >
                UNIVERSITY
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="mb-4 text-left">
                <label className="mb-1 block text-sm text-white/70">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
                  disabled={isLoading}
                  className="w-full border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div className="mb-2 text-left">
                <label className="mb-1 block text-sm text-white/70">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
                    disabled={isLoading}
                    className="w-full border border-white/20 bg-transparent pl-4 pr-12 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mb-4 text-right">
                <Link href="/forgot-password">
                  <span className="cursor-pointer text-sm text-white/60 hover:text-[#f7941d]">
                    Forget Password
                  </span>
                </Link>
              </div>

              {/* Captcha */}
              <Captcha
                onChange={setCaptchaCode}
                onUserInputChange={setCaptchaInput}
                userInput={captchaInput}
              />

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-[180px] bg-[#f7941d] py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>

            <p className="mt-4 text-sm text-white/60 text-left">
              Don't have an account?{" "}
              <Link href={`/signup?role=${activeRole}`}>
                <span className="cursor-pointer text-[#f7941d]">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen w-full bg-[#050b1f] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
