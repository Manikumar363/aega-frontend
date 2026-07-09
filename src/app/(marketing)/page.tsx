import Hero from "@/components/home/Hero";
import WhoAreWe from "@/components/home/WhoAreWe";
import WhatWeDo from "@/components/home/WhatWeDo";
import Statistics from "@/components/home/Statistics";
import Impact from "@/components/home/Impact";
import Reviews from "@/components/home/Reviews";
import { WhyAEGA } from "@/components/home/WhyAEGA";
import Leadership from "@/components/home/Leadership";
import Commitment from "@/components/home/Commitment";

async function getHomepageData() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/homepage`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Error fetching homepage CMS data:', err);
    return null;
  }
}

export default async function Home() {
  const content = await getHomepageData();

  return (
    <main className="bg-[#03091F] min-h-screen text-white selection:bg-[#F58A07] selection:text-white">
      <Hero data={content?.banner} />
      <WhoAreWe data={content?.storyOfUs} />
      <Statistics data={content?.whatWeDo} />
      <WhyAEGA data={content?.whyAega} />
      <Commitment data={content?.ourCommitment} />
      {/* <WhatWeDo data={content?.whatWeDo} /> */}
      {/* <Reviews data={content?.testimonials} /> */}
      <Impact data={content?.ourImpact} />
      <Leadership data={content?.testimonials} />
    </main>
  );
}