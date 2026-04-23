"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { login, storeAuthToken, storeUserData } from "@/lib/api";
import type { LoginRequest } from "@/lib/api/types";

type SignInPageProps = {
  fixedRole?: "agent" | "university";
};

export default function SignInPage({ fixedRole }: SignInPageProps) {
  const [activeRole, setActiveRole] = useState<"agent" | "university">(fixedRole ?? "agent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Please enter a valid email");
        setIsLoading(false);
        return;
      }

      const loginData: LoginRequest = { email, password };

      toast.loading("Signing in...");
      const response = await login(loginData);

      storeAuthToken(response.token);
      storeUserData(response.user);

      toast.dismiss();
      toast.success("Login successful!");

      const targetRole = fixedRole ?? activeRole;
      setTimeout(() => {
        router.push(targetRole === "agent" ? "/agent/dashboard" : "/university/dashboard");
      }, 1500);
    } catch (error) {
      toast.dismiss();
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050b1f]">
      <Image src="/common/bg-left-shape.png" alt="1" fill className="object-cover" priority />
      <Image src="/common/bg-right-shape.png" alt="3" width={700} height={500} className="absolute right-0 top-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="mb-10 text-3xl font-semibold tracking-wide text-white">SIGN IN</h1>

        <div className="flex w-full max-w-[1300px] gap-10">
          <div className="hidden md:flex w-[360px] justify-center">
            <div className="relative h-[460px] w-[320px] rounded-md">
              <Image src="/peter-speech.png" alt="peter-seminar" fill className="object-cover" />
            </div>
          </div>

          <div className="flex-1 max-w-[620px]">
            {!fixedRole && (
              <div className="flex mb-6">
                <button
                  type="button"
                  onClick={() => setActiveRole("agent")}
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
                  onClick={() => setActiveRole("university")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    activeRole === "university"
                      ? "bg-[#f7941d] text-white"
                      : "border border-white/30 text-white"
                  }`}
                >
                  UNIVERSITY
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="mb-1 block text-sm text-white/70">Email*</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50"
                />
              </div>

              <div className="mb-2">
                <label className="mb-1 block text-sm text-white/70">Password*</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d] disabled:opacity-50"
                />
              </div>

              <div className="mb-4 text-right">
                <span className="cursor-pointer text-sm text-white/60 hover:text-[#f7941d]">
                  Forget Password
                </span>
              </div>

              <div className="mb-6 flex items-center justify-between bg-white px-4 py-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" required />
                  I'm not a robot
                </label>
                <span className="text-xs text-gray-500">reCAPTCHA</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-[180px] bg-[#f7941d] py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>

            <p className="mt-4 text-sm text-white/60">
              Don't have an account? <a href="/signup"><span className="cursor-pointer text-[#f7941d]">Sign up</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}