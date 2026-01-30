// src/components/auth/SignUpLayout.tsx
import Image from "next/image";

interface SignUpLayoutProps {
  children: React.ReactNode;
  userType: "agent" | "university";
  onToggle: (type: "agent" | "university") => void;
}

export default function SignUpLayout({ children, userType, onToggle }: SignUpLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full bg-[#0A1628]">
      {/* Left Section - Combined Zigzag + Presentation Image */}
      <div 
        className="relative hidden w-[420px] bg-cover bg-center lg:block"
        style={{
          backgroundImage: 'url(/presentation.png)', // Combined image
        }}
      >
        {/* If you want presentation image separately, uncomment below */}
        {/* <div className="absolute left-1/2 top-1/2 z-10 h-[480px] w-[320px] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/signup/presentation.jpg"
            alt="Presentation"
            fill
            className="object-cover shadow-2xl"
            priority
          />
        </div> */}
      </div>

      {/* Right Section - Form */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* Orange Gradient - Top Right */}
        <div className="pointer-events-none absolute right-0 top-0">
          <Image
            src="/common/bg-right-shape.png"
            alt="Right gradient"
            width={900}
            height={600}
            className="opacity-90"
            priority
          />
        </div>

        {/* Form Content */}
        <div className="relative z-10 w-full max-w-xl px-8 py-12">
          {/* Title */}
          <h1 className="mb-12 text-center text-5xl font-bold text-white">
            SIGN UP
          </h1>

          {/* Agent/University Toggle */}
          <div className="mb-8 grid grid-cols-2 border border-white/30">
            <button
              type="button"
              onClick={() => onToggle("agent")}
              className={`py-3 text-sm font-bold uppercase transition-all ${
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
              className={`py-3 text-sm font-bold uppercase transition-all ${
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
  );
}
