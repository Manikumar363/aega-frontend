"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, ArrowUpRight, Check, Sparkles, Building2, ShieldCheck, Award } from "lucide-react";
import { toast } from "react-toastify";

// Custom Slider & Stepper Component matching exact user layout specifications
interface CustomSliderWidgetProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  unitLabel: string;
  onChange: (val: number) => void;
}

const CustomSliderWidget: React.FC<CustomSliderWidgetProps> = ({
  value,
  min,
  max,
  step = 1,
  unitLabel,
  onChange,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="w-full flex items-center justify-between gap-[12px] h-[44px]">
      {/* Outer Track Pill Container */}
      <div className="relative flex-1 h-[44px] bg-[#141A36] border border-white/20 rounded-full p-0.5 overflow-hidden flex items-center">
        {/* Active Filled Highlight Track */}
        <div
          className="h-full bg-white/20 rounded-full transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />

        {/* Horizontally Moving White Knob containing "{value}x" */}
        <div
          className="absolute w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center font-extrabold text-[12px] text-black shadow-lg cursor-grab active:cursor-grabbing transition-all duration-75 select-none z-10"
          style={{
            left: `calc(2px + (100% - 42px) * ${percentage / 100})`,
          }}
        >
          {value}x
        </div>

        {/* Transparent range input layer for full drag and touch interactivity */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>

      {/* Right Stepper Box */}
      <div className="w-[110px] sm:w-[130px] h-[44px] bg-[#060D28] border border-white/25 rounded flex items-center justify-between px-3 text-xs text-white shrink-0">
        <span className="font-bold text-white tracking-wide truncate">
          {value} {unitLabel}
        </span>
        <div className="flex flex-col text-white/50 shrink-0 ml-1">
          <ChevronUp
            className="w-3.5 h-3.5 hover:text-[#F7941D] cursor-pointer transition-colors"
            onClick={() => onChange(Math.min(max, value + step))}
          />
          <ChevronDown
            className="w-3.5 h-3.5 hover:text-[#F7941D] cursor-pointer transition-colors"
            onClick={() => onChange(Math.max(min, value - step))}
          />
        </div>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<"agents" | "sponsors">("agents");

  // Global Settings
  const [pricingModel, setPricingModel] = useState<"overview" | "detailed">("overview");
  const [hasIcefDiscount, setHasIcefDiscount] = useState<boolean>(false);

  // Inbuilt Card 1: ELEMENTS State
  const [elementsTier, setElementsTier] = useState<string>("Solo");
  const [elementsAgentsCount, setElementsAgentsCount] = useState<number>(15);
  const [elementsOffices, setElementsOffices] = useState<number>(1);
  const [elementsIsStartup, setElementsIsStartup] = useState<boolean>(false);

  // Inbuilt Card 2: PRO State
  const [proType, setProType] = useState<string>("B2C");
  const [proOffices, setProOffices] = useState<number>(1);

  // Inbuilt Card 3: CUSTOMISED State
  const [customType, setCustomType] = useState<string>("B2B");
  const [customCompanies, setCustomCompanies] = useState<number>(1);
  const [customOffices, setCustomOffices] = useState<number>(1);
  const [customEmployees, setCustomEmployees] = useState<number>(100);

  // Sponsor / Educator Card States
  const [educatorSingleHeiPlan, setEducatorSingleHeiPlan] = useState<"Elements" | "Pro">("Elements");
  const [educatorCollegePlan, setEducatorCollegePlan] = useState<"Elements" | "Pro">("Elements");

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("success") === "true") {
        setSuccessBanner(true);
        toast.success("🎉 Membership Subscription Activated Successfully!");
      } else if (searchParams.get("canceled") === "true") {
        toast.info("Subscription checkout was canceled.");
      }
    }
  }, []);

  // Calculate price for Elements Card
  const calculateElementsPrice = () => {
    let total = 0;
    const count = Math.max(1, elementsOffices);

    if (pricingModel === "overview") {
      total = 500 * count;
    } else {
      if (elementsIsStartup && count === 1) {
        total = 300;
      } else {
        total = 1000;
        if (count >= 2) total += 400;
        if (count >= 3) total += (count - 2) * 300;
      }
    }

    if (hasIcefDiscount) {
      total = Math.round(total * 0.9);
    }
    return total;
  };

  // Calculate price for Pro Card
  const calculateProPrice = () => {
    let total = 0;
    const count = Math.max(1, proOffices);

    if (pricingModel === "overview") {
      total = 1200 * count;
    } else {
      total = 2500;
      if (count >= 2) total += 950;
      if (count >= 3) total += (count - 2) * 750;
    }

    if (hasIcefDiscount) {
      total = Math.round(total * 0.9);
    }
    return total;
  };

  // Calculate price for Sponsor Single HEI
  const calculateSponsorSingleHeiPrice = () => {
    let total = educatorSingleHeiPlan === "Elements" ? 3000 : 6500;
    if (hasIcefDiscount) total = Math.round(total * 0.9);
    return total;
  };

  // Calculate price for Sponsor Pathway / College
  const calculateSponsorCollegePrice = () => {
    let total = educatorCollegePlan === "Elements" ? 500 : 1500;
    if (hasIcefDiscount) total = Math.round(total * 0.9);
    return total;
  };

  const handleCheckout = async (planName: "Elements" | "Pro" | "Customised", customOfficesCount: number = 1, isStartupFlag: boolean = false) => {
    if (planName === "Customised") {
      window.location.href = "/contact";
      return;
    }

    const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || sessionStorage.getItem("token") : null;

    if (!token) {
      toast.info("Please sign in or register to complete your subscription checkout.");
      window.location.href = "/login?redirect=/pricing";
      return;
    }

    setLoadingPlan(planName);

    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName,
          category: activeCategory === "agents" ? "agent" : "educator",
          pricingModel,
          officesCount: customOfficesCount,
          isStartup: isStartupFlag,
          hasIcefDiscount,
          educatorType: "single_hei",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Checkout creation failed");
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.success("Subscription activated successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate Stripe checkout.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const elementsPrice = calculateElementsPrice();
  const proPrice = calculateProPrice();
  const sponsorHeiPrice = calculateSponsorSingleHeiPrice();
  const sponsorCollegePrice = calculateSponsorCollegePrice();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03081D] text-white">
      {/* Background Image Overlay */}
      <div className="pointer-events-none absolute right-0 top-0 h-auto w-auto">
        <Image
          src="/about-bg.png"
          alt="Background"
          width={900}
          height={600}
          className="h-auto w-auto object-contain opacity-80"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 space-y-12">
        {/* SUCCESS BANNER */}
        {successBanner && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 border border-emerald-400 p-6 rounded-lg text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-lg">AEGA Membership Active!</h3>
                <p className="text-xs text-white/80">Your subscription has been processed successfully. Welcome to the AEGA Network.</p>
              </div>
            </div>
            <Link
              href="/agent/dashboard"
              className="bg-white text-emerald-800 font-bold text-xs uppercase px-6 py-3 rounded hover:bg-emerald-50 transition-colors"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        )}

        {/* Hero Section Header */}
        <div className="mb-10 text-left">
          <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/60">
            PRICING
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            PRICING & MEMBERSHIP PLANS
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            Transparent pricing models for recruitment agents, agencies, aggregators, and university sponsors
          </p>
        </div>

        {/* Category Toggle & Global Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-[#0A1332] border border-white/10 p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => setActiveCategory("agents")}
              className={`w-full sm:w-64 py-3.5 font-bold text-xs tracking-widest uppercase transition-all border rounded ${
                activeCategory === "agents"
                  ? "bg-[#F7941D] text-white border-[#F7941D] shadow-lg shadow-[#F7941D]/20"
                  : "bg-transparent text-white/80 border-white/20 hover:border-[#F7941D]"
              }`}
            >
              AGENTS PRICING
            </button>
            <button
              onClick={() => setActiveCategory("sponsors")}
              className={`w-full sm:w-64 py-3.5 font-bold text-xs tracking-widest uppercase transition-all border rounded ${
                activeCategory === "sponsors"
                  ? "bg-[#F7941D] text-white border-[#F7941D] shadow-lg shadow-[#F7941D]/20"
                  : "bg-transparent text-white/80 border-white/20 hover:border-[#F7941D]"
              }`}
            >
              SPONSORS PRICING
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            {activeCategory === "agents" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70 font-semibold uppercase">Schedule:</span>
                <select
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value as any)}
                  className="bg-[#14112E] border border-white/20 px-3 py-2 text-xs text-white rounded outline-none cursor-pointer"
                >
                  <option value="overview">Overview Base Rate (£500 / £1,200 per office)</option>
                  <option value="detailed">Detailed Schedule (£1,000 / £2,500 1st office)</option>
                </select>
              </div>
            )}

            <label className="flex items-center gap-2 bg-[#03081D] px-3 py-2 rounded border border-white/20 cursor-pointer hover:border-[#F7941D] transition-colors">
              <input
                type="checkbox"
                checked={hasIcefDiscount}
                onChange={(e) => setHasIcefDiscount(e.target.checked)}
                className="w-4 h-4 accent-[#F7941D] cursor-pointer"
              />
              <span className="text-xs font-semibold text-white">ICEF Accredited Member (10% Reduction)</span>
            </label>
          </div>
        </div>

        {/* AGENTS PRICING CARDS GRID WITH BUILT-IN SLIDER WIDGETS */}
        {activeCategory === "agents" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLUMN 1: ELEMENTS */}
            <div className="flex flex-col justify-between space-y-8 bg-[#060D28]/60 border border-white/10 p-8 rounded-lg relative hover:border-[#F7941D]/40 transition-colors">
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-[44px] leading-tight tracking-tight text-white uppercase mb-2">
                    ELEMENTS
                  </h2>
                  <h3 className="text-xs font-bold text-[#F7941D] mb-2 uppercase tracking-wider">
                    Start-Up & Single Office Agents
                  </h3>
                  <p className="text-xs leading-relaxed text-white/70">
                    Single-office or newly established agents entering the UK market. Agents building their first structured compliance framework. Members who want professional recognition and access to AEGA&apos;s core resources without a large initial investment.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£{elementsPrice.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-white/60 uppercase">/ YEAR</span>
                  </div>
                  {hasIcefDiscount && <span className="text-[10px] text-emerald-400 block mt-1">Includes 10% ICEF Discount</span>}
                </div>

                {/* INBUILT CARD SLIDER WIDGET FOR ELEMENTS */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/80">Subscribe to be in touch with news.</p>

                  <div className="bg-[#0A1332] border border-white/15 px-4 py-2 flex items-center justify-between rounded">
                    <select
                      value={elementsTier}
                      onChange={(e) => {
                        setElementsTier(e.target.value);
                        if (e.target.value === "Solo") setElementsAgentsCount(15);
                        else if (e.target.value === "Small Team") setElementsAgentsCount(25);
                        else setElementsAgentsCount(50);
                      }}
                      className="bg-transparent text-white font-bold text-sm outline-none w-full cursor-pointer"
                    >
                      <option value="Solo" className="bg-[#0A1332] text-white">Solo</option>
                      <option value="Small Team" className="bg-[#0A1332] text-white">Small Team</option>
                      <option value="Standard" className="bg-[#0A1332] text-white">Standard</option>
                    </select>
                  </div>

                  {/* CUSTOM SLIDER WIDGET MATCHING SPECIFICATIONS */}
                  <CustomSliderWidget
                    value={elementsOffices}
                    min={1}
                    max={10}
                    unitLabel="Office"
                    onChange={(val) => setElementsOffices(val)}
                  />

                  {pricingModel === "detailed" && elementsOffices === 1 && (
                    <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={elementsIsStartup}
                        onChange={(e) => setElementsIsStartup(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#F7941D]"
                      />
                      <span>Start-up Agent (1st Year: £300)</span>
                    </label>
                  )}

                  <div className="text-xs font-medium text-white/70 pt-1">
                    {elementsOffices} {elementsOffices === 1 ? "Office" : "Offices"} • {elementsAgentsCount} Agents
                  </div>

                  <button
                    onClick={() => handleCheckout("Elements", elementsOffices, elementsIsStartup)}
                    disabled={loadingPlan === "Elements"}
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded cursor-pointer disabled:opacity-50"
                  >
                    <span>{loadingPlan === "Elements" ? "PROCESSING..." : "START WITH ELEMENT PLAN"}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Features List for Elements Plan */}
                <div className="pt-6 border-t border-white/10 space-y-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      PROFESSIONAL RECOGNITION & REGISTRATION
                    </h4>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AEGA Authorised Agent Register listing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AEGA membership certificate and digital badge</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Named on AEGA website agent directory</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AEGA logo for use in marketing and proposals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Sector representation and collective advocacy</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      COMPLIANCE & AQF HEALTH CHECKS
                    </h4>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Annual AQF self-assessment framework and guidance</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      TRAINING & CPD
                    </h4>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Access to AEGA training course database</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>ICEF Academy ISACP certification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AEGA CPD log and annual certificate</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: PRO */}
            <div className="flex flex-col justify-between space-y-8 bg-[#0A1332] border-2 border-[#F7941D] p-8 rounded-lg relative shadow-xl shadow-[#F7941D]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F7941D] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full">
                MOST POPULAR TIER
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-[44px] leading-tight tracking-tight text-white uppercase mb-2">
                    PRO
                  </h2>
                  <h3 className="text-xs font-bold text-[#F7941D] mb-2 uppercase tracking-wider">
                    Established B2C & Regional Agents
                  </h3>
                  <p className="text-xs leading-relaxed text-white/70">
                    For established B2C and regional agents with an active UK university portfolio. Agents managing their own counsellor teams who need CPD infrastructure, health check support, and access to UKVI updates and market intelligence.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£{proPrice.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-white/60 uppercase">/ YEAR</span>
                  </div>
                  {hasIcefDiscount && <span className="text-[10px] text-emerald-400 block mt-1">Includes 10% ICEF Discount</span>}
                </div>

                {/* INBUILT CARD SLIDER WIDGET FOR PRO */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/80">Subscribe to be in touch with news.</p>

                  <div className="bg-[#060D28] border border-white/15 px-4 py-2 flex items-center justify-between rounded">
                    <select
                      value={proType}
                      onChange={(e) => setProType(e.target.value)}
                      className="bg-transparent text-white font-bold text-sm outline-none w-full cursor-pointer"
                    >
                      <option value="B2C" className="bg-[#060D28] text-white">B2C</option>
                      <option value="B2C Regional" className="bg-[#060D28] text-white">B2C Regional</option>
                      <option value="B2B & B2C Hybrid" className="bg-[#060D28] text-white">B2B & B2C Hybrid</option>
                    </select>
                  </div>

                  {/* CUSTOM SLIDER WIDGET MATCHING SPECIFICATIONS */}
                  <CustomSliderWidget
                    value={proOffices}
                    min={1}
                    max={20}
                    unitLabel="Office"
                    onChange={(val) => setProOffices(val)}
                  />

                  <div className="text-xs font-medium text-white/70 pt-1">
                    {proOffices} {proOffices === 1 ? "Office" : "Offices"} • {proOffices * 75} Agents
                  </div>

                  <button
                    onClick={() => handleCheckout("Pro", proOffices, false)}
                    disabled={loadingPlan === "Pro"}
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded cursor-pointer disabled:opacity-50"
                  >
                    <span>{loadingPlan === "Pro" ? "PROCESSING..." : "START WITH PRO PLAN"}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Features List for Pro Plan */}
                <div className="pt-6 border-t border-white/10 space-y-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      PROFESSIONAL RECOGNITION & REGISTRATION
                    </h4>
                    <p className="text-xs text-white/70 mb-2 italic">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Enhanced profile — linked verified metrics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Priority listing for university partner searches</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      COMPLIANCE & AQF HEALTH CHECKS
                    </h4>
                    <p className="text-xs text-white/70 mb-2 italic">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AQF Health Check support and advisory</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>UKVI updates and regulatory intelligence</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: CUSTOMISED */}
            <div className="flex flex-col justify-between space-y-8 bg-[#060D28]/60 border border-white/10 p-8 rounded-lg relative hover:border-[#F7941D]/40 transition-colors">
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-[44px] leading-tight tracking-tight text-white uppercase mb-2">
                    CUSTOMISED
                  </h2>
                  <h3 className="text-xs font-bold text-[#F7941D] mb-2 uppercase tracking-wider">
                    Aggregators & Multi-Office Networks
                  </h3>
                  <p className="text-xs leading-relaxed text-white/70">
                    B2B aggregators and multi-office networks managing 50+ sub-agents. Organisations requiring embedded audit support, bespoke compliance reporting, and a structured AEGA quality assurance relationship with their university partners.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">BESPOKE / POA</span>
                  </div>
                  <span className="text-[10px] text-white/60 block mt-1">Price on Application</span>
                </div>

                {/* INBUILT CARD SLIDER WIDGETS FOR CUSTOMISED */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/80">Subscribe to be in touch with news.</p>

                  <div className="bg-[#0A1332] border border-white/15 px-4 py-2 flex items-center justify-between rounded">
                    <select
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="bg-transparent text-white font-bold text-sm outline-none w-full cursor-pointer"
                    >
                      <option value="B2B" className="bg-[#0A1332] text-white">B2B</option>
                      <option value="Aggregator" className="bg-[#0A1332] text-white">Aggregator</option>
                      <option value="Multi-Campus Network" className="bg-[#0A1332] text-white">Multi-Campus Network</option>
                    </select>
                  </div>

                  {/* 3 CUSTOM SLIDER WIDGETS MATCHING SPECIFICATIONS */}
                  <div className="space-y-2.5">
                    <CustomSliderWidget
                      value={customCompanies}
                      min={1}
                      max={10}
                      unitLabel="Company"
                      onChange={(val) => setCustomCompanies(val)}
                    />

                    <CustomSliderWidget
                      value={customOffices}
                      min={1}
                      max={20}
                      unitLabel="Office"
                      onChange={(val) => setCustomOffices(val)}
                    />

                    <CustomSliderWidget
                      value={customEmployees}
                      min={10}
                      max={500}
                      step={10}
                      unitLabel="Employee"
                      onChange={(val) => setCustomEmployees(val)}
                    />
                  </div>

                  <div className="text-xs font-medium text-white/70 pt-1">
                    {customCompanies} Company • {customOffices} Office • {customEmployees} Agents
                  </div>

                  <button
                    onClick={() => handleCheckout("Customised", customOffices, false)}
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded cursor-pointer"
                  >
                    <span>START CUSTOM PRO PLAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Features List for Customised Plan */}
                <div className="pt-6 border-t border-white/10 space-y-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      PROFESSIONAL RECOGNITION & REGISTRATION
                    </h4>
                    <p className="text-xs text-white/70 mb-2 italic">Everything in Pro plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Full audits & active sub-agent governance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Pre-UKVI audit readiness framework</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EDUCATOR / SPONSORS PRICING CARDS */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SPONSOR CARD 1: SINGLE UK HEI */}
            <div className="flex flex-col justify-between space-y-8 bg-[#060D28]/60 border border-white/10 p-8 rounded-lg relative">
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-3xl text-white uppercase mb-2">SINGLE UK HEI</h2>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Single Higher Education Institution in the UK. Access full agent governance, compliance reporting, and directory verification.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£{sponsorHeiPrice.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-white/60 uppercase">/ YEAR</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <label className="block text-xs font-semibold text-white/80 mb-1">SELECT TIER</label>
                  <div className="grid grid-cols-2 gap-2 bg-[#0A1332] p-1 rounded border border-white/15">
                    <button
                      type="button"
                      onClick={() => setEducatorSingleHeiPlan("Elements")}
                      className={`py-2 text-xs font-bold rounded transition-colors ${educatorSingleHeiPlan === "Elements" ? "bg-[#F7941D] text-white" : "text-white/70 hover:text-white"}`}
                    >
                      Elements (£3k)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEducatorSingleHeiPlan("Pro")}
                      className={`py-2 text-xs font-bold rounded transition-colors ${educatorSingleHeiPlan === "Pro" ? "bg-[#F7941D] text-white" : "text-white/70 hover:text-white"}`}
                    >
                      Pro (£6.5k)
                    </button>
                  </div>

                  <button
                    onClick={() => handleCheckout(educatorSingleHeiPlan, 1, false)}
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded cursor-pointer mt-2"
                  >
                    <span>START {educatorSingleHeiPlan.toUpperCase()} HEI PLAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SPONSOR CARD 2: PATHWAY / BRANCH CAMPUS */}
            <div className="flex flex-col justify-between space-y-8 bg-[#0A1332] border-2 border-[#F7941D] p-8 rounded-lg relative shadow-xl">
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-3xl text-white uppercase mb-2">PATHWAY & BRANCH</h2>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Pathway providers, colleges, and international branch campuses requiring structured quality assurance.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£{sponsorCollegePrice.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-white/60 uppercase">/ YEAR</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <label className="block text-xs font-semibold text-white/80 mb-1">SELECT TIER</label>
                  <div className="grid grid-cols-2 gap-2 bg-[#060D28] p-1 rounded border border-white/15">
                    <button
                      type="button"
                      onClick={() => setEducatorCollegePlan("Elements")}
                      className={`py-2 text-xs font-bold rounded transition-colors ${educatorCollegePlan === "Elements" ? "bg-[#F7941D] text-white" : "text-white/70 hover:text-white"}`}
                    >
                      Elements (£500)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEducatorCollegePlan("Pro")}
                      className={`py-2 text-xs font-bold rounded transition-colors ${educatorCollegePlan === "Pro" ? "bg-[#F7941D] text-white" : "text-white/70 hover:text-white"}`}
                    >
                      Pro (£1.5k)
                    </button>
                  </div>

                  <button
                    onClick={() => handleCheckout(educatorCollegePlan, 1, false)}
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded cursor-pointer mt-2"
                  >
                    <span>START {educatorCollegePlan.toUpperCase()} COLLEGE PLAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SPONSOR CARD 3: MULTI-CAMPUS GROUP */}
            <div className="flex flex-col justify-between space-y-8 bg-[#060D28]/60 border border-white/10 p-8 rounded-lg relative">
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-3xl text-white uppercase mb-2">MULTI-CAMPUS GROUP</h2>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Multi-campus group managing 3+ sites requiring bespoke network governance.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">NETWORK RATE / POA</span>
                  </div>
                  <span className="text-[10px] text-white/60 block mt-1">Price on Application</span>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleCheckout("Customised")}
                    className="w-full border border-[#F7941D] text-[#F7941D] hover:bg-[#F7941D] hover:text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded cursor-pointer"
                  >
                    <span>CONTACT FOR NETWORK RATE</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
