"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowUpRight, ChevronUp } from "lucide-react";

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<"agents" | "sponsors">("agents");

  // State for interactive sliders / counter inputs
  const [b2cOffices, setB2cOffices] = useState<number>(1);
  const [b2bCompanies, setB2bCompanies] = useState<number>(1);
  const [b2bOffices, setB2bOffices] = useState<number>(1);
  const [b2bEmployees, setB2bEmployees] = useState<number>(100);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03081D] text-white">
      {/* Background Image - Top Right Gradient Overlay */}
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
        {/* Hero Section Header (Matching Policy Page) */}
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

        {/* Category Toggle Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <button
            onClick={() => setActiveCategory("agents")}
            className={`w-full sm:w-80 py-4 font-bold text-xs tracking-widest uppercase transition-all border ${
              activeCategory === "agents"
                ? "bg-[#F7941D] text-white border-[#F7941D]"
                : "bg-transparent text-white/80 border-white/20 hover:border-[#F7941D]"
            }`}
          >
            AGENTS PRICING
          </button>
          <button
            onClick={() => setActiveCategory("sponsors")}
            className={`w-full sm:w-80 py-4 font-bold text-xs tracking-widest uppercase transition-all border ${
              activeCategory === "sponsors"
                ? "bg-[#F7941D] text-white border-[#F7941D]"
                : "bg-transparent text-white/80 border-white/20 hover:border-[#F7941D]"
            }`}
          >
            SPONSORS PRICING
          </button>
        </div>

        {activeCategory === "agents" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLUMN 1: ELEMENTS */}
            <div className="flex flex-col justify-between space-y-8 bg-[#060D28]/60 border border-white/10 p-8 rounded-lg">
              <div className="space-y-6">
                <div>
                  <h2
                    className="font-semibold text-[50px] leading-[72px] tracking-[-3.6px] text-white uppercase mb-4 align-middle"
                    style={{ fontStyle: "normal" }}
                  >
                    ELEMENTS
                  </h2>
                  <h3 className="text-sm font-bold text-white mb-2">Best for:</h3>
                  <p className="text-xs leading-relaxed text-white/70">
                    Single-office or newly established agents entering the UK market. Agents building their first structured compliance framework. Members who want professional recognition and access to AEGA&apos;s core resources without a large initial investment.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£500</span>
                    <span className="text-xs font-semibold text-white/60 uppercase">/ YEAR</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/80">Subscribe to be in touch with news.</p>

                  <div className="bg-[#0A1332] border border-white/15 px-4 py-3 flex items-center justify-between rounded">
                    <span className="font-bold text-sm text-white">Solo</span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </div>

                  <div className="text-xs font-medium text-white/70 pt-1">
                    15 Agents
                  </div>

                  <Link
                    href="/signup"
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded"
                  >
                    <span>START WITH ELEMENT PLAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Features List for Elements Plan */}
                <div className="pt-6 border-t border-white/10 space-y-5">
                  {/* Section 1 */}
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

                  {/* Section 2 */}
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

                  {/* Section 3 */}
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

                  {/* Section 4 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      REGULATORY INTELLIGENCE & MARKET ANALYSIS
                    </h4>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>UKVI policy updates and rule change briefings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>HC 1691 / visa brake alerts (real-time)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Pre-entry financial evidence country guidance</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      MEDIATION, ARBITRATION & STUDENT PROTECTION
                    </h4>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AEGA mediation service — agent/educator disputes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AEGA arbitration service — student complaints</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Student complaint portal access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Agent accountability review (on complaint)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: PRO */}
            <div className="flex flex-col justify-between space-y-8 bg-[#060D28]/60 border border-white/10 p-8 rounded-lg">
              <div className="space-y-6">
                <div>
                  <h2
                    className="font-semibold text-[50px] leading-[72px] tracking-[-3.6px] text-white uppercase mb-4 align-middle"
                    style={{ fontStyle: "normal" }}
                  >
                    PRO
                  </h2>
                  <h3 className="text-sm font-bold text-white mb-2">Best for:</h3>
                  <p className="text-xs leading-relaxed text-white/70">
                    Established B2C agents with an active UK university portfolio. Agents managing their own counsellor teams who need CPD infrastructure, health check support, and access to UKVI updates and market intelligence.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£500</span>
                    <span className="text-xs font-semibold text-white/60 uppercase">/ YEAR</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/80">Subscribe to be in touch with news.</p>

                  <div className="bg-[#0A1332] border border-white/15 px-4 py-3 flex items-center justify-between rounded">
                    <span className="font-bold text-sm text-white">B2C</span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </div>

                  {/* Interactive Slider Input Box (Matching Slider Image Specs) */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 bg-white/5 border border-white/10 rounded-full h-12 px-1 flex items-center shadow-inner overflow-hidden">
                      {/* Active track background filling with #FAFAFA33 */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#FAFAFA33] rounded-full transition-all duration-150"
                        style={{
                          width: `calc(${((b2cOffices - 1) / 19) * 100}% + 40px)`,
                        }}
                      />

                      <div
                        className="bg-white text-black font-extrabold text-xs flex items-center justify-center transition-all duration-150 shadow-md shrink-0 z-10"
                        style={{
                          width: "40.08px",
                          height: "40px",
                          minWidth: "40px",
                          paddingTop: "8px",
                          paddingRight: "11.55px",
                          paddingBottom: "8px",
                          paddingLeft: "11.53px",
                          borderRadius: "30px",
                          opacity: 1,
                          transform: `translateX(${((b2cOffices - 1) / 19) * 200}%)`,
                        }}
                      >
                        {b2cOffices}x
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={b2cOffices}
                        onChange={(e) => setB2cOffices(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                    </div>

                    <div className="bg-[#0A1332] border border-white/15 rounded px-3 py-2.5 flex items-center gap-2 shrink-0 justify-between min-w-[110px]">
                      <span className="text-xs font-medium text-white">{b2cOffices} Office</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => setB2cOffices((prev) => Math.min(prev + 1, 20))}
                          className="hover:text-[#F7941D] text-white/70"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setB2cOffices((prev) => Math.max(prev - 1, 1))}
                          className="hover:text-[#F7941D] text-white/70"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-medium text-white/70 space-y-1 pt-1">
                    <div>{b2cOffices} Office</div>
                    <div>{b2cOffices * 75} Agents</div>
                  </div>

                  <Link
                    href="/signup"
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded"
                  >
                    <span>START WITH PRO PLAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Features List for PRO Plan */}
                <div className="pt-6 border-t border-white/10 space-y-5">
                  {/* Section 1 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      PROFESSIONAL RECOGNITION & REGISTRATION
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Elements plan, plus:</p>
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

                  {/* Section 2 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      COMPLIANCE & AQF HEALTH CHECKS
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AQF health check review (annual)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Full company structure and student journey audit (Pro = subsidised)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Sub-agent register review and governance framework (Pro = guidance)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>BCA data analysis and threshold monitoring</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      TRAINING & CPD
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Subsidised AEGA compliance workshops (group) (Pro = 20% reduction)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Counsellor-level CPD infrastructure (Pro = access)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Priority booking for AEGA webinars and events</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      REGULATORY INTELLIGENCE & MARKET ANALYSIS
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Multi-country destination updates (AU, CA, US, IE)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Geopolitical country risk analysis papers (for recruitment strategy planning)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Recruitment Market Matrix (quarterly updates – flags restricted/suspended markets)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      ADMINISTRATIVE REVIEW & STUDENT SUPPORT
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AR grounds drafting support (per case)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      MEDIATION, ARBITRATION & STUDENT PROTECTION
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Expedited dispute resolution (priority queue)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 7 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      UNIVERSITY PARTNER RELATIONSHIP SUPPORT
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Elements plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>AQF evidence pack for sponsor partner reporting (supports April 2026 UKVI duty)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Named AEGA reference for sponsor AQF audits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: CUSTOMIZED */}
            <div className="flex flex-col justify-between space-y-8 bg-[#060D28]/60 border border-white/10 p-8 rounded-lg">
              <div className="space-y-6">
                <div>
                  <h2
                    className="font-semibold text-[50px] leading-[72px] tracking-[-3.6px] text-white uppercase mb-4 align-middle"
                    style={{ fontStyle: "normal" }}
                  >
                    CUSTOMIZED
                  </h2>
                  <h3 className="text-sm font-bold text-white mb-2">Best for:</h3>
                  <p className="text-xs leading-relaxed text-white/70">
                    B2B aggregators and multi-office networks managing 50+ sub-agents. Organisations requiring embedded audit support, bespoke compliance reporting, and a structured AEGA quality assurance relationship with their university partners.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">£500</span>
                    <span className="text-xs font-semibold text-white/60 uppercase">/ YEAR</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/80">Subscribe to be in touch with news.</p>

                  <div className="bg-[#0A1332] border border-white/15 px-4 py-3 flex items-center justify-between rounded">
                    <span className="font-bold text-sm text-white">B2B</span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </div>

                  {/* 3 Interactive Sliders (Matching Slider Image Specs) */}
                  <div className="space-y-3">
                    {/* Row 1: Company */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 bg-white/5 border border-white/10 rounded-full h-12 px-1 flex items-center shadow-inner overflow-hidden">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#FAFAFA33] rounded-full transition-all duration-150"
                          style={{
                            width: `calc(${((b2bCompanies - 1) / 9) * 100}% + 40px)`,
                          }}
                        />
                        <div
                          className="bg-white text-black font-extrabold text-xs flex items-center justify-center transition-all duration-150 shadow-md shrink-0 z-10"
                          style={{
                            width: "40.08px",
                            height: "40px",
                            minWidth: "40px",
                            paddingTop: "8px",
                            paddingRight: "11.55px",
                            paddingBottom: "8px",
                            paddingLeft: "11.53px",
                            borderRadius: "30px",
                            opacity: 1,
                            transform: `translateX(${((b2bCompanies - 1) / 9) * 200}%)`,
                          }}
                        >
                          {b2bCompanies}x
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={b2bCompanies}
                          onChange={(e) => setB2bCompanies(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                      </div>
                      <div className="bg-[#0A1332] border border-white/15 rounded px-3 py-2 flex items-center gap-2 shrink-0 min-w-[110px] justify-between">
                        <span className="text-xs font-medium text-white">{b2bCompanies} Company</span>
                        <div className="flex flex-col">
                          <button onClick={() => setB2bCompanies((p) => Math.min(p + 1, 10))} className="hover:text-[#F7941D] text-white/70">
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button onClick={() => setB2bCompanies((p) => Math.max(p - 1, 1))} className="hover:text-[#F7941D] text-white/70">
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Office */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 bg-white/5 border border-white/10 rounded-full h-12 px-1 flex items-center shadow-inner overflow-hidden">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#FAFAFA33] rounded-full transition-all duration-150"
                          style={{
                            width: `calc(${((b2bOffices - 1) / 19) * 100}% + 40px)`,
                          }}
                        />
                        <div
                          className="bg-white text-black font-extrabold text-xs flex items-center justify-center transition-all duration-150 shadow-md shrink-0 z-10"
                          style={{
                            width: "40.08px",
                            height: "40px",
                            minWidth: "40px",
                            paddingTop: "8px",
                            paddingRight: "11.55px",
                            paddingBottom: "8px",
                            paddingLeft: "11.53px",
                            borderRadius: "30px",
                            opacity: 1,
                            transform: `translateX(${((b2bOffices - 1) / 19) * 200}%)`,
                          }}
                        >
                          {b2bOffices}x
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={b2bOffices}
                          onChange={(e) => setB2bOffices(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                      </div>
                      <div className="bg-[#0A1332] border border-white/15 rounded px-3 py-2 flex items-center gap-2 shrink-0 min-w-[110px] justify-between">
                        <span className="text-xs font-medium text-white">{b2bOffices} Office</span>
                        <div className="flex flex-col">
                          <button onClick={() => setB2bOffices((p) => Math.min(p + 1, 20))} className="hover:text-[#F7941D] text-white/70">
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button onClick={() => setB2bOffices((p) => Math.max(p - 1, 1))} className="hover:text-[#F7941D] text-white/70">
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Employee */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 bg-white/5 border border-white/10 rounded-full h-12 px-1 flex items-center shadow-inner overflow-hidden">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#FAFAFA33] rounded-full transition-all duration-150"
                          style={{
                            width: `calc(${((b2bEmployees - 10) / 490) * 100}% + 40px)`,
                          }}
                        />
                        <div
                          className="bg-white text-black font-extrabold text-xs flex items-center justify-center transition-all duration-150 shadow-md shrink-0 z-10"
                          style={{
                            width: "40.08px",
                            height: "40px",
                            minWidth: "40px",
                            paddingTop: "8px",
                            paddingRight: "11.55px",
                            paddingBottom: "8px",
                            paddingLeft: "11.53px",
                            borderRadius: "30px",
                            opacity: 1,
                            transform: `translateX(${((b2bEmployees - 10) / 490) * 200}%)`,
                          }}
                        >
                          {Math.round(b2bEmployees / 100) || 1}x
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="500"
                          step="10"
                          value={b2bEmployees}
                          onChange={(e) => setB2bEmployees(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                      </div>
                      <div className="bg-[#0A1332] border border-white/15 rounded px-3 py-2 flex items-center gap-2 shrink-0 min-w-[110px] justify-between">
                        <span className="text-xs font-medium text-white">{b2bEmployees} Employee</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-medium text-white/70 space-y-1 pt-1">
                    <div>{b2bCompanies} Company</div>
                    <div>{b2bOffices} Office</div>
                    <div>{b2bEmployees} Agents</div>
                  </div>

                  <Link
                    href="/signup"
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-5 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded"
                  >
                    <span>START CUSTOM PRO PLAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Features List for Customized Plan */}
                <div className="pt-6 border-t border-white/10 space-y-5">
                  {/* Section 1 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      PROFESSIONAL RECOGNITION & REGISTRATION
                    </h4>
                    <p className="text-xs text-white/80">Everything in Pro plan.</p>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      COMPLIANCE & AQF HEALTH CHECKS
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Pro plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Full company structure and student journey audit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Sub-agent register review and governance framework</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Pre-UKVI audit readiness assessment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Embedded compliance support (ongoing)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      TRAINING & CPD
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Pro plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Bespoke in-house training delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Counsellor-level CPD infrastructure</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      REGULATORY INTELLIGENCE & MARKET ANALYSIS
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Pro plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Bespoke market intelligence reports</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      ADMINISTRATIVE REVIEW & STUDENT SUPPORT
                    </h4>
                    <p className="text-xs text-white/80">Everything in Pro plan.</p>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      MEDIATION, ARBITRATION & STUDENT PROTECTION
                    </h4>
                    <p className="text-xs text-white/80">Everything in Pro plan.</p>
                  </div>

                  {/* Section 7 */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      UNIVERSITY PARTNER RELATIONSHIP SUPPORT
                    </h4>
                    <p className="text-xs text-white/80 mb-2">Everything in Pro plan, plus:</p>
                    <ul className="space-y-2 text-xs text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F7941D] font-bold">•</span>
                        <span>Dedicated university liaison support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Sponsors Pricing Section */
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-white/70 leading-relaxed">
              <p>
                Universities and higher education institutions seeking quality assurance, agent network audits, and UKVI compliance support for partner recruitment networks.
              </p>
              <p>
                Global education sponsors requiring dedicated compliance oversight, customized training programs, and direct partner verification portals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0B132B] border border-white/10 p-6 flex flex-col justify-between space-y-6 rounded">
                <div>
                  <div className="bg-[#091024] border border-white/10 px-4 py-3 flex items-center justify-between mb-6">
                    <span className="font-bold text-sm text-white">University Sponsor</span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </div>
                </div>
                <div className="pt-12">
                  <Link
                    href="/contact-us"
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded"
                  >
                    <span>CONTACT SPONSOR TEAM</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-[#0B132B] border border-white/10 p-6 flex flex-col justify-between space-y-6 rounded">
                <div>
                  <div className="bg-[#091024] border border-white/10 px-4 py-3 flex items-center justify-between mb-6">
                    <span className="font-bold text-sm text-white">Global Enterprise Partner</span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </div>
                </div>
                <div className="pt-12">
                  <Link
                    href="/contact-us"
                    className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase inline-flex items-center justify-between transition-colors rounded"
                  >
                    <span>START ENTERPRISE PLAN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
