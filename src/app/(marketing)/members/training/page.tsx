// src/app/(marketing)/members/training/page.tsx
import Image from "next/image";
import TrainingHero from "@/components/members/TrainingHero";
import AegaLearningPath from "@/components/members/AegaLearningPath";
import AcademicTraining from "@/components/members/AcademicTraining";
import DigitalDelivery from "@/components/members/DigitalDelivery";
import AegaLearningPathAdvanced from "@/components/members/AegaLearningPathAdvanced";
import TestimonialSection from "@/components/members/TestimonialSection";
     
export default function TrainingOverviewPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03091F]">
      {/* Brown diagonal shape - TOP RIGHT */}
      <div className="pointer-events-none absolute right-0 top-0 ">
        <Image
          src="/common/bg-brownshade.png"
          alt=""
          width={1900}
          height={700}
          className=" object-contain"
          priority
        />
      </div>

      <div className="relative z-10">
        <TrainingHero />
        <AegaLearningPath />
        <AegaLearningPathAdvanced/>
        <AcademicTraining />
        <DigitalDelivery />
        <TestimonialSection />
      </div>
    </div>
  );
}
