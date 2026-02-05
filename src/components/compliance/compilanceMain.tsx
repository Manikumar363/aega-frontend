'use client';

import Image from 'next/image';
import { Clock, BookOpen, CheckCircle } from 'lucide-react';

interface CourseCard {
  id: number;
  image: string;
  category: string;
  categoryColor: string;
  duration: string;
  durationDays: string;
  title: string;
  hours: string;
  modules: string;
  assessment: string;
  accessLevel: string;
}

const courses: CourseCard[] = [
  {
    id: 1,
    image: '/presentation-1.png',
    category: 'BEGINNER',
    categoryColor: 'bg-blue-500',
    duration: '2 DAYS',
    durationDays: '2 Days',
    title: 'Introduction to Compliance',
    hours: '16 Hours',
    modules: '4 Modules',
    assessment: 'Assessment',
    accessLevel: 'Member Access',
  },
  {
    id: 2,
    image: '/presentation-1.png',
    category: 'BEGINNER',
    categoryColor: 'bg-blue-500',
    duration: '2 DAYS',
    durationDays: '2 Days',
    title: 'Compliance Fundamentals',
    hours: '16 Hours',
    modules: '5 Modules',
    assessment: 'Certification',
    accessLevel: 'Member Access',
  },
  {
    id: 3,
    image: '/presentation-1.png',
    category: 'INTERMEDIATE',
    categoryColor: 'bg-purple-500',
    duration: '5 DAYS',
    durationDays: '5 Days',
    title: 'Advanced Compliance',
    hours: '40 Hours',
    modules: '8 Modules',
    assessment: 'Advanced',
    accessLevel: 'Partner Access',
  },
  {
    id: 4,
    image: '/presentation-1.png',
    category: 'INTERMEDIATE',
    categoryColor: 'bg-purple-500',
    duration: '3 DAYS',
    durationDays: '3 Days',
    title: 'Corporate Governance',
    hours: '24 Hours',
    modules: '4 Modules',
    assessment: 'Case Study',
    accessLevel: 'Member Access',
  },
  {
    id: 5,
    image: '/presentation-1.png',
    category: 'INTERMEDIATE',
    categoryColor: 'bg-purple-500',
    duration: '5 DAYS',
    durationDays: '5 Days',
    title: 'Risk Management',
    hours: '40 Hours',
    modules: '8 Modules',
    assessment: 'Advanced',
    accessLevel: 'Member Access',
  },
  {
    id: 6,
    image: '/presentation-1.png',
    category: 'ADVANCED',
    categoryColor: 'bg-indigo-500',
    duration: '7 DAYS',
    durationDays: '7 Days',
    title: 'Master Compliance',
    hours: '56 Hours',
    modules: '12 Modules',
    assessment: 'Certification',
    accessLevel: 'Member Access',
  },
  {
    id: 7,
    image: '/presentation-1.png',
    category: 'BEGINNER',
    categoryColor: 'bg-blue-500',
    duration: '2 DAYS',
    durationDays: '2 Days',
    title: 'Legal Basics',
    hours: '16 Hours',
    modules: '5 Modules',
    assessment: 'Quiz',
    accessLevel: 'Partner Access',
  },
  {
    id: 8,
    image: '/presentation-1.png',
    category: 'BEGINNER',
    categoryColor: 'bg-blue-500',
    duration: '3 DAYS',
    durationDays: '3 Days',
    title: 'Professional Ethics',
    hours: '24 Hours',
    modules: '5 Modules',
    assessment: 'Certificate',
    accessLevel: 'Member Access',
  },
  {
    id: 9,
    image: '/presentation-1.png',
    category: 'ADVANCED',
    categoryColor: 'bg-indigo-500',
    duration: '7 DAYS',
    durationDays: '7 Days',
    title: 'Strategic Compliance',
    hours: '56 Hours',
    modules: '10 Modules',
    assessment: 'Advanced',
    accessLevel: 'Member Access',
  },
];

export default function ComplianceMain() {
  return (
    <section className="w-full bg-[#03091F] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Grid of Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-[#03091F] rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={course.id <= 3}
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
              <div className="p-6">
                {/* Course Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2">
                  {course.title}
                </h3>

                {/* Course Details */}
                <div className="space-y-3 mb-6">
                  {/* Hours */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>{course.hours}</span>
                  </div>

                  {/* Modules */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen size={16} className="text-gray-400" />
                    <span>{course.modules}</span>
                  </div>

                  {/* Assessment */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-gray-400" />
                    <span>{course.assessment}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-xs text-gray-500 mb-4">{course.accessLevel}</p>
                </div>

                {/* Enroll Button */}
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded transition-colors duration-300">
                  ENROLL NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
