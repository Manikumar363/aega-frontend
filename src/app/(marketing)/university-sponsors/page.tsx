import UniversityHero from "@/components/university/universityHero";
import AgentLearning from "@/components/university/agentLearning";
import TrustCompliance from "@/components/university/TrustCompliance";
import Compliance from "@/components/university/compliance";
import Services from "@/components/university/services";
import Testimonials from "@/components/university/testimonials";

async function getUniversityData() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/university-cms`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Error fetching university CMS data:', err);
    return null;
  }
}

export default async function university() {
  const content = await getUniversityData();

  return (
    <>
      <UniversityHero data={content?.universityHero} />
      <Compliance data={content?.professionalGuidelines} />
      <Services data={content?.servicesForPartners} />
      <AgentLearning data={content?.learningPath} />
      <TrustCompliance data={content?.ourImpact} />
      <Testimonials data={content?.clientReviews} />
    </>
  );
}