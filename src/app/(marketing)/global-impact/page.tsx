import GlobalImpactHero from "@/components/global-impact/GlobalImpactHero";
import OurJourney from "@/components/global-impact/OurJourney";
import RegionalPresence from "@/components/global-impact/RegionalPresence";
import GlobalTestimonial from "@/components/global-impact/GlobalTestimonial";


export const metadata = {
  title: "Global Impact - AEGA",
  description: "AEGA's influence spans 40+ countries supporting thousands of agents",
};

export default function GlobalImpactPage() {
  return (
    <>
      <GlobalImpactHero />
      <OurJourney />
      <RegionalPresence />
      <GlobalTestimonial />
    </>
  );
}
