import AboutHero from "@/components/about/AboutHero";
import AboutIntro from "@/components/about/AboutIntro";
import OurStory from "@/components/about/OurStory";
import CoreValues from "@/components/about/CoreValues";
import Leadership from "@/components/about/Leadership";
import JoinCTA from "@/components/about/JoinCTA";
import OurMission from "@/components/about/OurMission";
import OurVision from "@/components/about/OurVision";
import OurJourney from "@/components/global-impact/OurJourney";
import GlobalImpact from "@/components/about/GlobalImpact";

export default function AboutPage() {
  return (
    <main className="bg-[#03091F] min-h-screen">
      <AboutHero />
      <AboutIntro />
      <OurStory />
      <OurMission/>
      <OurVision />
      <OurJourney />
      <GlobalImpact />
      <CoreValues />
      <Leadership />
      {/* <JoinCTA /> */}
    </main>
  );
}