'use client';

import { Clock, BookOpen, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface CourseCard {
  id: string;
  image: string;
  category: string;
  categoryColor: string;
  duration: string | null;
  title: string;
  hoursOfContent: string | null;
  courseFee: string | null;
  examFee: string | null;
  accessLevel: string;
  permalink: string;
}

interface IcefCourse {
  wp_course_id: number;
  training_type_id: string;
  title: string;
  card_title: string;
  card_description: string;
  card_image: string;
  certified_graduates: number;
  hours_of_content: string | null;
  course_fee: string | null;
  exam_fee: string | null;
  coming_soon: boolean;
  coming_soon_label: string;
  coming_soon_date: string;
  sales_points: string[];
  permalink: string;
  main_filter_category: string;
  terms: string[];
}

interface ComplianceMainProps {
  initialCourses?: IcefCourse[];
}

// Excluded external partner/affiliate course IDs:
// 356241: NAFSA's Essentials of International Credential Evaluation
// 593495: The Understanding Employability Course for Education Counsellors (Employability / Successful Graduate)
// 440318: Scale Up Your Leadership in the Age of AI With Lead5050 (Lead 5050)
const EXCLUDED_COURSE_IDS = [356241, 593495, 440318];

const isExcludedCourse = (course: IcefCourse): boolean => {
  if (EXCLUDED_COURSE_IDS.includes(course.wp_course_id)) {
    return true;
  }
  const title = (course.title || course.card_title || '').toLowerCase();
  if (title.includes('nafsa')) return true;
  if (title.includes('employability') || title.includes('successful graduate')) return true;
  if (title.includes('lead5050') || title.includes('lead 5050')) return true;
  return false;
};

const sanitizeField = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === 'null' ||
    trimmed.toLowerCase() === 'undefined' ||
    trimmed.toLowerCase() === 'n/a'
  ) {
    return null;
  }
  return trimmed;
};

export default function ComplianceMain({ initialCourses }: ComplianceMainProps) {
  const searchParams = useSearchParams();
  const hasFilters = searchParams.get('category') || searchParams.get('duration');

  const extractImageSrc = (imgHtml?: string) => {
    if (!imgHtml) return '/presentation-1.png';
    if (imgHtml.startsWith('http://') || imgHtml.startsWith('https://') || imgHtml.startsWith('/')) {
      return imgHtml;
    }
    const match = imgHtml.match(/src=["']([^"']+)["']/);
    return match ? match[1] : '/presentation-1.png';
  };

  // Convert initial courses to CourseCard format, filtering out excluded affiliate courses
  const displayCourses: CourseCard[] = Array.isArray(initialCourses)
    ? initialCourses
      .filter((course) => !isExcludedCourse(course))
      .map((course) => {
        const cat = (course.main_filter_category || 'general').toLowerCase();
        let categoryLabel = 'GENERAL';
        let categoryColor = 'bg-orange-500';

        if (cat === 'agents') {
          categoryLabel = 'AGENTS';
          categoryColor = 'bg-orange-500';
        } else if (cat === 'educators') {
          categoryLabel = 'EDUCATORS';
          categoryColor = 'bg-purple-500';
        } else if (cat === 'partners' || cat === 'partner') {
          categoryLabel = 'PARTNERS';
          categoryColor = 'bg-blue-500';
        } else if (cat === 'agents-educators' || cat === 'agents & educators') {
          categoryLabel = 'AGENTS & EDUCATORS';
          categoryColor = 'bg-emerald-500';
        }

        const isComingSoon = course.coming_soon;
        const hours = sanitizeField(course.hours_of_content);
        const courseFee = sanitizeField(course.course_fee);
        const examFee = sanitizeField(course.exam_fee);

        const durationStr = hours
          ? (hours.toLowerCase().includes('hour')
              ? hours.toUpperCase()
              : `${hours} HOURS`)
          : null;

        return {
          id: String(course.wp_course_id),
          image: extractImageSrc(course.card_image),
          category: categoryLabel,
          categoryColor: categoryColor,
          duration: durationStr,
          title: course.card_title || course.title || '',
          hoursOfContent: hours,
          courseFee: courseFee,
          examFee: examFee,
          accessLevel: isComingSoon ? 'Coming Soon' : 'Active Training',
          permalink: course.permalink || '#',
        };
      })
    : [];

  return (
    <section className="w-full bg-[#03091F] pt-13 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {displayCourses.length === 0 ? (
          hasFilters ? (
            <div className="text-center py-12 border border-white/10 rounded-lg bg-[#0F1A3A]/30">
              <p className="text-lg text-white/60 mb-2">No courses found matching your criteria.</p>
              <p className="text-sm text-white/40">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="text-center py-12 border border-white/10 rounded-lg bg-[#0F1A3A]/30">
              <p className="text-lg text-white/60">There are no existing courses as of now, we will add soon.</p>
            </div>
          )
        ) : (
          /* Grid of Course Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-[#03091F] rounded-lg overflow-hidden border border-white/10 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container - Responsive and fully visible without cropping */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#0A1628] flex items-center justify-center p-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Badge */}
                    {course.category && (
                      <div className={`absolute top-4 left-4 ${course.categoryColor} text-white px-3 py-1 rounded text-xs font-semibold shadow-md z-10`}>
                        {course.category}
                      </div>
                    )}

                    {/* Duration Badge */}
                    {course.duration && (
                      <div className="absolute top-4 right-4 bg-white/95 text-orange-500 px-3 py-1 rounded text-xs font-semibold shadow-md z-10">
                        {course.duration}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 text-left">
                    {/* Course Title */}
                    <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 uppercase min-h-[56px]">
                      {course.title}
                    </h3>

                    {/* Course Details - Only renders rows with valid, non-null values */}
                    <div className="space-y-3 mb-6">
                      {/* Hours of Content */}
                      {course.hoursOfContent && (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Clock size={16} className="text-white/40 shrink-0" />
                          <span>Hours of Content: {course.hoursOfContent}</span>
                        </div>
                      )}

                      {/* Course Fee */}
                      {course.courseFee && (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <BookOpen size={16} className="text-white/40 shrink-0" />
                          <span>Course Fee: {course.courseFee}</span>
                        </div>
                      )}

                      {/* Exam Fee */}
                      {course.examFee && (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle size={16} className="text-white/40 shrink-0" />
                          <span>Exam Fee: {course.examFee}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 text-left">
                  {/* Divider */}
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-xs text-white/55 mb-4">{course.accessLevel}</p>
                  </div>

                  {/* Enroll Button */}
                  <a
                    href={course.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-semibold py-2.5 rounded transition-colors duration-300"
                  >
                    ENROLL NOW
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
