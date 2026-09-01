// src/components/auth/SignUpLayout.tsx
import Image from "next/image";

interface SignUpLayoutProps {
  children: React.ReactNode;
  userType: "agent" | "university";
  onToggle: (type: "agent" | "university") => void;
}

export default function SignUpLayout({ children, userType, onToggle }: SignUpLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050b1f]">
      {/* Background Images */}
      <Image
        src="/common/bg-left-shape.png"
        alt="Background Shape Left"
        fill
        className="object-cover pointer-events-none"
        priority
      />

      <Image
        src="/common/bg-right-shape.png"
        alt="Background Shape Right"
        width={700}
        height={500}
        className="absolute right-0 top-0 pointer-events-none opacity-90"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-16">
        {/* Top Banner Heading */}
        <h1 className="mb-8 md:mb-12 text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-white uppercase text-center">
          SIGN UP
        </h1>

        {/* Main Card (Left Image + Right Form) */}
        <div className="flex w-full max-w-[1100px] justify-center items-start gap-8 lg:gap-14">
          {/* Left Image */}
          <div className="hidden md:flex w-[340px] lg:w-[360px] justify-center shrink-0">
            <div className="relative h-[520px] w-[320px] lg:w-[340px] rounded-md overflow-hidden shadow-2xl">
              <Image
                src="/peter-speech.png"
                alt="peter-seminar"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Form */}
          <div className="flex-1 max-w-[620px] w-full">
            {/* Agent/University Toggle */}
            <div className="mb-6 flex border border-white/30">
              <button
                type="button"
                onClick={() => onToggle("agent")}
                className={`flex-1 py-3 text-sm font-bold uppercase transition-all cursor-pointer ${
                  userType === "agent"
                    ? "bg-[#F58A07] text-white"
                    : "text-white hover:bg-white/5"
                }`}
              >
                AGENT
              </button>
              <button
                type="button"
                onClick={() => onToggle("university")}
                className={`flex-1 py-3 text-sm font-bold uppercase transition-all cursor-pointer ${
                  userType === "university"
                    ? "bg-[#F58A07] text-white"
                    : "text-white hover:bg-white/5"
                }`}
              >
                UNIVERSITY
              </button>
            </div>

            {/* Form Content (from props) */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
