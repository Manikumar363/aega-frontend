import ComplianceHero from "@/components/compliance/compilanceHero";
import Testimonials from "@/components/compliance/testimonials";
import ComplianceMain from "@/components/compliance/compilanceMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliances & Courses",
};

async function getCdpCourses(searchParams: { category?: string; duration?: string }) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const query = new URLSearchParams();
    if (searchParams?.category) query.append('category', searchParams.category);
    if (searchParams?.duration) query.append('duration', searchParams.duration);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/cdp-courses${queryString}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Error fetching public cdp courses:', err);
    return [];
  }
}

interface PageProps {
  searchParams?: Promise<{ category?: string; duration?: string }> | { category?: string; duration?: string };
}

export default async function page({ searchParams }: PageProps) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : (searchParams || {});
  const courses = await getCdpCourses(resolvedParams);

  return (
    <>
      <ComplianceHero />
      <ComplianceMain initialCourses={courses} />
      <Testimonials />
    </>
  );
}