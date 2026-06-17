"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useEffect, useState } from "react";
import { getCdpCourses, enrollInCourse, getMyEnrolledCourses, getMyStats, type CdpCourse } from "@/lib/api";

export default function AgentCDPPage() {
  const [courses, setCourses] = useState<CdpCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCdpCourses();
        // also fetch enrolled courses to flag registered ones
        const enrolled = await getMyEnrolledCourses().catch(() => []);

        const enrolledById = new Map<string, any>();
        enrolled.forEach((e: any) => {
          const cid = e.courseId && (e.courseId._id || e.courseId);
          if (cid) enrolledById.set(String(cid), e);
        });

        const normalized = data.map((c) => {
          const match = enrolledById.get(c._id || c.id);
          if (match) {
            return {
              ...c,
              registered: true,
              registrationStartDate: match.startDate || match.enrollmentDate || match.startDate,
              registrationNote: match.notes || "",
              enrollmentStatus: match.status || undefined,
            };
          }
          return c;
        });

        setCourses(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch courses");
        console.error("Error fetching CDP courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const registeredCourses = courses.filter((c) => !!c.registered);
  const total = courses.length;
  const totalRegistered = registeredCourses.length;
  const mandatoryRegisteredCount = registeredCourses.filter((c) => c.type === "mandatory").length;
  const percentage = totalRegistered === 0 ? 0 : Math.round((mandatoryRegisteredCount / totalRegistered) * 100);

  const [openTypes, setOpenTypes] = useState<Record<string, boolean>>({});

  // Modal / registration state
  const [selectedCourse, setSelectedCourse] = useState<CdpCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("Starting from today");
  const [submitting, setSubmitting] = useState(false);

  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const getImageSrc = (path?: string) => {
    if (!path) return "";
    if (/^https?:\/\//.test(path) || path.startsWith("//")) return path;
    if (path.startsWith("/")) return `${baseUrl}${path}`;
    return `${baseUrl}/${path}`;
  };

  const grouped = courses.reduce((acc: Record<string, CdpCourse[]>, c) => {
    const t = (c.type || "Other").toLowerCase();
    acc[t] = acc[t] || [];
    acc[t].push(c);
    return acc;
  }, {} as Record<string, CdpCourse[]>);

  useEffect(() => {
    // initialize accordion open state: open types that have registered courses
    setOpenTypes((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const map: Record<string, boolean> = {};
      Object.entries(grouped).forEach(([type, list]) => {
        map[type] = list.some((c) => !!c.registered);
      });
      return map;
    });
  }, [/* run when grouped computed changes */ JSON.stringify(grouped)]);

  const openCourseModal = (course: CdpCourse) => {
    setSelectedCourse(course);
    setStartDate(new Date().toISOString().slice(0, 10));
    setNote("Starting from today");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const submitRegistration = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      // Call backend enroll endpoint
      try {
        await enrollInCourse(selectedCourse.id, { startDate, notes: note });
      } catch (err) {
        console.warn("enroll API failed, falling back to local update", err);
      }

      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, registered: true, registrationStartDate: startDate, registrationNote: note, enrollmentStatus: "on-going" }
            : c
        )
      );
      // Open course hyperLink in a new tab if provided
      try {
        const href = (selectedCourse.hyperLink || (selectedCourse as any).hyperlink || "").trim();
        if (href) {
          const newWin = window.open(href, "_blank", "noopener,noreferrer");
          if (newWin) newWin.focus();
        }
      } catch (err) {
        console.warn("Failed to open course link:", err);
      }
    } finally {
      setSubmitting(false);
      closeModal();
    }
  };

  return (
    <DashboardLayout role="agent">
      <div className="space-y-8">
        {/* CDP Progress Section (only when user has registered courses) */}
        {totalRegistered > 0 && (
          <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Your Courses & Progress</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Mandatory Courses (registered)</span>
                <span className="text-white font-semibold">{mandatoryRegisteredCount}/{totalRegistered}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#F68E2D] h-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Your Courses Section (registered courses) */}
        <div className="space-y-4">
          {totalRegistered > 0 && <h2 className="text-2xl font-semibold text-white">Your Courses</h2>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D] mb-4"></div>
                <p className="text-white/70">Loading courses...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="border border-gray-700 p-8 text-center">
              <p className="text-white/70">No courses available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Registered courses list */}
              {totalRegistered > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registeredCourses.map((course) => {
                      const UNSPLASH_PLACEHOLDER =
                        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80";
                      const imageSrc = getImageSrc(course.coverPicture) || UNSPLASH_PLACEHOLDER;

                      const status = (course.enrollmentStatus || (course as any).status || "on-going").toLowerCase();
                      const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
                      const statusClass =
                        status === "completed"
                          ? "bg-green-500"
                          : status === "due"
                          ? "bg-[#E03137]"
                          : "bg-[#4A90E2]";

                      return (
                        <div
                          key={course.id}
                          onClick={() => openCourseModal(course)}
                          role="button"
                          tabIndex={0}
                          className="bg-[#14112E] border border-gray-800 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition"
                        >
                          <div className="flex items-center gap-4">
                            <img src={imageSrc} alt={course.courseName} className="w-28 h-16 object-cover rounded-md" />
                            <div>
                              <h4 className="text-md font-semibold text-white">{course.courseName}</h4>
                              <p className="text-gray-400 text-sm">Module {course.modules} • {course.timeInHr} hrs</p>
                            </div>
                          </div>

                          <div className="ml-4">
                            <span className={`${statusClass} text-white text-xs px-3 py-1 rounded-full`}>{statusLabel}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grouped courses by type (accordion) */}
              <div className="space-y-3">
                {Object.entries(grouped).map(([type, list]) => {
                  const displayType = type.charAt(0).toUpperCase() + type.slice(1);
                  const isOpen = !!openTypes[type];

                  return (
                    <div key={type} className="bg-[#0f0d20] border border-gray-800 rounded-md">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-4 py-3"
                        onClick={() => setOpenTypes((p) => ({ ...p, [type]: !p[type] }))}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white font-semibold">{displayType}</span>
                          <span className="text-gray-400 text-sm">{list.length} courses</span>
                        </div>
                        <svg className={`w-5 h-5 text-gray-300 transform transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="p-4 space-y-3">
                          {list.map((course) => {
                            const UNSPLASH_PLACEHOLDER =
                              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80";
                            const imageSrc = getImageSrc(course.coverPicture) || UNSPLASH_PLACEHOLDER;

                            return (
                              <div
                                key={course.id}
                                onClick={() => openCourseModal(course)}
                                role="button"
                                tabIndex={0}
                                className="bg-[#14112E] border border-gray-800 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
                              >
                                <img src={imageSrc} alt={course.courseName} className="w-28 h-16 object-cover rounded-md" />
                                <div className="flex-1">
                                  <h4 className="text-md font-semibold text-white">{course.courseName}</h4>
                                  <p className="text-gray-400 text-sm">Module {course.modules} • {course.timeInHr} hrs</p>
                                </div>
                                <div>
                                  <span className={`${course.type === "mandatory" ? "bg-[#E03137]" : "bg-[#4A90E2]"} text-white text-xs px-3 py-1 rounded-full`}>{course.type}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Registration Modal */}
        {isModalOpen && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
            <div className="relative bg-[#0b0a17] rounded-md p-6 w-full max-w-lg mx-4 z-10">
              <div className="flex gap-4 mb-4">
                <img
                  src={getImageSrc(selectedCourse.coverPicture) || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"}
                  alt={selectedCourse.courseName}
                  className="w-36 h-24 object-cover rounded-md"
                />

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Start Course: {selectedCourse.courseName}</h3>
                  {selectedCourse.description ? (
                    <p className="text-gray-300 text-sm mb-2">{selectedCourse.description}</p>
                  ) : (
                    <p className="text-gray-400 text-sm mb-2">No description available.</p>
                  )}
                  <p className="text-gray-400 text-xs">Module {selectedCourse.modules} • {selectedCourse.timeInHr} hrs</p>
                </div>
              </div>

                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mb-3 p-2 bg-[#14112E] border border-gray-700 rounded text-white"
              />

              <label className="block text-sm text-gray-400 mb-1">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full mb-4 p-2 bg-[#14112E] border border-gray-700 rounded text-white"
                rows={4}
              />

              <div className="flex justify-end gap-2">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                <button
                  onClick={submitRegistration}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#F68E2D] text-black rounded font-semibold disabled:opacity-50"
                >
                  {submitting ? "Starting…" : "Start Course"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}