import ComplianceHero from "@/components/compliance/compilanceHero";
import Testimonials from "@/components/compliance/testimonials";
import ComplianceMain from "@/components/compliance/compilanceMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliances & Courses",
};

async function getIcefCourses(searchParams: { 
  category?: string; 
  duration?: string;
  participationType?: string;
  trainingFormat?: string;
}) {
  try {
    let url = 'https://www.icef.com/academy/wp-json/export/v1/courses';
    const category = searchParams?.category;
    if (category && ['agents', 'educators', 'partners', 'agents-educators'].includes(category)) {
      url = `${url}/${category}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    let courses = await res.json();

    if (!Array.isArray(courses)) return [];

    const duration = searchParams?.duration;
    if (duration) {
      courses = courses.filter((course: any) => {
        const hoursStr = course.hours_of_content || '';
        const hours = parseInt(hoursStr.replace(/\D/g, ''), 10) || 0;
        if (duration === 'short') return hours < 5;
        if (duration === 'medium') return hours >= 5 && hours <= 20;
        if (duration === 'long') return hours > 20;
        return true;
      });
    }

    const participationType = searchParams?.participationType;
    if (participationType) {
      courses = courses.filter((course: any) => 
        Array.isArray(course.terms) && course.terms.includes(participationType)
      );
    }

    const trainingFormat = searchParams?.trainingFormat;
    if (trainingFormat) {
      courses = courses.filter((course: any) => 
        Array.isArray(course.terms) && course.terms.includes(trainingFormat)
      );
    }

    return courses;
  } catch (err) {
    console.error('Error fetching ICEF courses:', err);
    return [];
  }
}

interface PageProps {
  searchParams?: Promise<{ 
    category?: string; 
    duration?: string;
    participationType?: string;
    trainingFormat?: string;
  }> | { 
    category?: string; 
    duration?: string;
    participationType?: string;
    trainingFormat?: string;
  };
}

export default async function page({ searchParams }: PageProps) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : (searchParams || {});
  const courses = await getIcefCourses(resolvedParams);

  return (
    <>
      <ComplianceHero />
      <ComplianceMain initialCourses={courses} />
      <Testimonials />
    </>
  );
}