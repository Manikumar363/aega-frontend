import MembersHero from "@/components/members/MembersHero";
import RangeServices from "@/components/members/RangeServices";
import SystemIntegration from "@/components/members/SystemIntegration";
import Membership from "@/components/members/membership";
import Professional from "@/components/members/professional";
import PreCase from "@/components/members/PreCase";
import Testimonials from "@/components/members/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Members",
};

async function getMembersData() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/members`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Error fetching members CMS data:', err);
    return null;
  }
}

export default async function Page() {
  const content = await getMembersData();

  return (
    <>
      <MembersHero data={content?.membersHero} />
      <Professional data={content?.professionalGuidelines} />
      <RangeServices data={content?.rangeOfServices} />
      <Membership data={content?.membershipBenefits} />
      <SystemIntegration data={content?.operationalFramework} />
      <PreCase data={content?.preCasReady} />
      <Testimonials data={content?.clientReviews} />
    </>
  );
}