import ComplianceHero from "@/components/compliance/compilanceHero";
import Testimonials from "@/components/compliance/testimonials";
import ComplianceMain from "@/components/compliance/compilanceMain";

async function getCdpCourses() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/cdp-courses`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Error fetching public cdp courses:', err);
    return [];
  }
}

export default async function page() {
  const courses = await getCdpCourses();

  return (
    <>
      <ComplianceHero />
      <ComplianceMain initialCourses={courses} />
      <Testimonials />
    </>
  );
}