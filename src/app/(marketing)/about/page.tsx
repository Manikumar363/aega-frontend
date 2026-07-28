import AboutHero from "@/components/about/AboutHero";
import AboutIntro from "@/components/about/AboutIntro";
import OurStory from "@/components/about/OurStory";
import CoreValues from "@/components/about/CoreValues";
import Leadership1 from "@/components/about/Leadership1";
import OurMission from "@/components/about/OurMission";
import OurVision from "@/components/about/OurVision";
import OurJourney from "@/components/global-impact/OurJourney";
import GlobalImpact from "@/components/about/GlobalImpact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

async function getAboutData() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/about`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Error fetching about CMS data:', err);
    return null;
  }
}

export default async function AboutPage() {
  const content = await getAboutData();

  return (
    <main className="bg-[#03091F] min-h-screen text-white">
      <AboutHero data={content?.aboutUs} />
      <AboutIntro data={content?.innerSection2} />
      <OurStory data={content?.ourStory} />
      <OurMission data={content?.ourMission} />
      <OurVision data={content?.ourVision} />
      <OurJourney data={content?.ourJourney} />
      <GlobalImpact data={content?.globalImpact} />
      <CoreValues data={content?.coreValues} />
      <Leadership1 data={content?.clientReviews} />
    </main>
  );
}