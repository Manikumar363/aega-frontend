'use client';

import { Clock, BookOpen, CheckCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

interface CourseCard {
  id: string;
  image: string;
  category: string;
  categoryColor: string;
  duration: string;
  title: string;
  hours: string;
  modules: string;
  assessment: string;
  accessLevel: string;
}

interface ComplianceMainProps {
  initialCourses?: Array<{
    _id?: string;
    id?: string;
    courseName: string;
    type: string;
    timeInHr: number;
    modules: number;
    hyperLink: string;
    description: string;
    coverPicture: string;
  }>;
}

const STATIC_COURSES: CourseCard[] = [
  {
    id: "1",
    image: '/presentation-1.png',
    category: 'BEGINNER',
    categoryColor: 'bg-blue-500',
    duration: '2 DAYS',
    title: 'Introduction to Compliance',
    hours: '16 Hours',
    modules: '4 Modules',
    assessment: 'Assessment',
    accessLevel: 'Member Access',
  },
  {
    id: "2",
    image: '/presentation-1.png',
    category: 'BEGINNER',
    categoryColor: 'bg-blue-500',
    duration: '2 DAYS',
    title: 'Compliance Fundamentals',
    hours: '16 Hours',
    modules: '5 Modules',
    assessment: 'Certification',
    accessLevel: 'Member Access',
  },
  {
    id: "3",
    image: '/presentation-1.png',
    category: 'INTERMEDIATE',
    categoryColor: 'bg-purple-500',
    duration: '5 DAYS',
    title: 'Advanced Compliance',
    hours: '40 Hours',
    modules: '8 Modules',
    assessment: 'Advanced',
    accessLevel: 'Partner Access',
  },
];

export default function ComplianceMain({ initialCourses }: ComplianceMainProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFilters = searchParams.get('category') || searchParams.get('duration');

  const formatImage = (path?: string, fallback: string = "/presentation-1.png") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };

  // Convert initial courses to CourseCard format if present, otherwise fallback to static courses
  const displayCourses: CourseCard[] = Array.isArray(initialCourses) && (initialCourses.length > 0 || hasFilters)
    ? initialCourses.map((course, idx) => {
        const isMandatory = String(course.type).toLowerCase() === 'mandatory';
        return {
          id: course._id || course.id || String(idx),
          image: formatImage(course.coverPicture),
          category: isMandatory ? 'MANDATORY' : 'OPTIONAL',
          categoryColor: isMandatory ? 'bg-orange-500' : 'bg-purple-500',
          duration: `${course.timeInHr} HR${course.timeInHr > 1 ? 'S' : ''}`,
          title: course.courseName,
          hours: `${course.timeInHr} Hour${course.timeInHr > 1 ? 's' : ''}`,
          modules: `${course.modules} Module${course.modules > 1 ? 's' : ''}`,
          assessment: 'Online Assessment',
          accessLevel: isMandatory ? 'Core Requirement' : 'Recommended Access',
        };
      })
    : STATIC_COURSES;

  return (
    <section className="w-full bg-[#03091F] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {displayCourses.length === 0 ? (
          <div className="text-center py-12 border border-white/10 rounded-lg bg-[#0F1A3A]/30">
            <p className="text-lg text-white/60 mb-2">No courses found matching your criteria.</p>
            <p className="text-sm text-white/40">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          /* Grid of Course Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-[#03091F] rounded-lg overflow-hidden border border-white/10 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Category Badge */}
                  <div className={`absolute top-4 left-4 ${course.categoryColor} text-white px-3 py-1 rounded text-xs font-semibold`}>
                    {course.category}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 text-orange-500 px-3 py-1 rounded text-xs font-semibold">
                    {course.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-left">
                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 uppercase min-h-[56px]">
                    {course.title}
                  </h3>

                  {/* Course Details */}
                  <div className="space-y-3 mb-6">
                    {/* Hours */}
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Clock size={16} className="text-white/40" />
                      <span>{course.hours}</span>
                    </div>

                    {/* Modules */}
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <BookOpen size={16} className="text-white/40" />
                      <span>{course.modules}</span>
                    </div>

                    {/* Assessment */}
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle size={16} className="text-white/40" />
                      <span>{course.assessment}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 text-left">
                {/* Divider */}
                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className="text-xs text-white/55 mb-4">{course.accessLevel}</p>
                </div>

                {/* Enroll Button */}
                <button 
                  onClick={() => router.push(process.env.NODE_ENV === 'production' ? '/contact-us' : '/login')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded transition-colors duration-300"
                >
                  ENROLL NOW
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
