import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const UKVI_POLICIES = [
  {
    title: "Sponsorship Management Policy",
    description: "Defines the rigorous standards for managing the Sponsor Management System (SMS) and issuing CAS to genuine students.",
    link: "#",
  },
  {
    title: "Basic Compliance Assessment (BCA) Policy",
    description: "Outlines the relationship of visa refusal rates, enrollment rates, and course completion metrics to prevent sponsor licenses.",
    link: "#",
  },
  {
    title: "Student Readiness & Intentionality Policy",
    description: "Mandates 'Layer 3' credibility checks and Pre-CAS interviews to ensure students are genuine and linguistically prepared.",
    link: "#",
  },
  {
    title: "UKVi Audit Readiness Policy",
    description: "Establishes the framework for regular internal audits to identify and mitigate institutional risk before official inspections.",
    link: "#",
  },
  {
    title: "Immigration Law Alignment Policy",
    description: "Ensures all recruitment strategies are updated in line with recent regulatory changes (UKVI laws and White Paper announcements).",
    link: "#",
  },
  {
    title: "Duty of Care & Attendance Policy",
    description: "Sets standards for monitoring student engagement post-arrival to maintain sponsor legal compliance and student welfare.",
    link: "#",
  },
];

const RULES_REGULATIONS = [
  {
    title: "Global Ethics Code",
    description: "Defines the rigorous standards for managing the Sponsor Management System (SMS) and issuing CAS to genuine students.",
    link: "#",
  },
  {
    title: "Professional Conduct",
    description: "Outlines the relationship of visa refusal rates, enrollment rates, and course completion metrics to prevent sponsor licenses.",
    link: "#",
  },
  {
    title: "Conflict of Interest Regulation",
    description: "Mandates 'Layer 3' credibility checks and Pre-CAS interviews to ensure students are genuine and linguistically prepared.",
    link: "#",
  },
  {
    title: "Anti-Bribery & Corruption Rule",
    description: "Establishes the framework for regular internal audits to identify and mitigate institutional risk before official inspections.",
    link: "#",
  },
  {
    title: "Continuous Professional Development (CPD) Rule",
    description: "Mandates a set number of training hours every 12 months to maintain active AEGA certification.",
    link: "#",
  },
  {
    title: "Disciplinary & Appeals Procedure Rule",
    description: "Outlines the formal process for investigating complaints and removing members who breach alliance standards.",
    link: "#",
  },
];

const DOCUMENTATION = [
  {
    title: "Whole Business Health Check Framework",
    description: "A comprehensive assessment tool for auditing an agency's operational readiness and process gaps.",
    link: "#",
  },
  {
    title: "Agent Quality Framework (AQF) Alignment",
    description: "A structured documentation set that ensures all agents meet the specific regulatory benchmarks of the UK and Australia.",
    link: "#",
  },
  {
    title: "Success Mapping Templates",
    description: "Strategic documents used to map the student journey and optimize institutional/organizational structures.",
    link: "#",
  },
  {
    title: "Real-Time Compliance Dashboards",
    description: "Technology-driven frameworks that provide sponsors with auditable data on their global partner networks.",
    link: "#",
  },
  {
    title: "Global Insights Reporting",
    description: "A standardized format for delivering data-driven reports on student mobility and geopolitical risk markers.",
    link: "#",
  },
  {
    title: "Standardized MOU/MSA Templates",
    description: "Legal frameworks for establishing transparent and compliant partnerships between agents and educational sponsors.",
    link: "#",
  },
];

export default function PolicyPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050B1F]">
      {/* Background Image - Top Right Gradient */}
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        {/* Hero Section */}
        <div className="mb-16">
          <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/60">
            POLICY
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            POLICY & DOCUMENTATION
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            Access regulatory frameworks, compliance standards, and official documentation
          </p>
        </div>

        {/* Section 1: UKVi Compliance Policies */}
        <section className="mb-12 border border-white/20 p-8 md:p-10">
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
            UKVI COMPLIANCE POLICIES
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {UKVI_POLICIES.map((policy, index) => (
              <div key={index} className="space-y-3 border border-white/10 bg-[#0A1628] p-6">
                <h3 className="text-sm font-bold text-white">
                  {policy.title}
                </h3>
                <p className="text-xs leading-relaxed text-white/60">
                  {policy.description}
                </p>
                <Link
                  href={policy.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-[#F58A07]"
                >
                  LEARN MORE
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Rules & Regulations */}
        <section className="mb-12 border border-white/20 p-8 md:p-10">
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
            RULES & REGULATIONS
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {RULES_REGULATIONS.map((rule, index) => (
              <div key={index} className="space-y-3 border border-white/10 bg-[#0A1628] p-6">
                <h3 className="text-sm font-bold text-white">
                  {rule.title}
                </h3>
                <p className="text-xs leading-relaxed text-white/60">
                  {rule.description}
                </p>
                <Link
                  href={rule.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-[#F58A07]"
                >
                  LEARN MORE
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Documentation & Frameworks */}
        <section className="border border-white/20 p-8 md:p-10">
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
            DOCUMENTATION & FRAMEWORKS
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTATION.map((doc, index) => (
              <div key={index} className="space-y-3 border border-white/10 bg-[#0A1628] p-6">
                <h3 className="text-sm font-bold text-white">
                  {doc.title}
                </h3>
                <p className="text-xs leading-relaxed text-white/60">
                  {doc.description}
                </p>
                <Link
                  href={doc.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:text-[#F58A07]"
                >
                  LEARN MORE
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
