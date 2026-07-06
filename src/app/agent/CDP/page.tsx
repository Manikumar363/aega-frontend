"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCdpCourses,
  enrollInCourse,
  getMyEnrolledCourses,
  getMyStats,
  type CdpCourse,
  uploadFile,
  updateProgress,
} from "@/lib/api";

export default function AgentCDPPage() {
  const [courses, setCourses] = useState<CdpCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and normalize courses
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
            progressId: match._id || match.id,
            registrationStartDate: match.startDate || match.enrollmentDate || match.startDate,
            registrationNote: match.notes || "",
            enrollmentStatus: match.status || undefined,
            certificateUrl: match.certificateUrl || null,
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const registeredCourses = courses.filter((c) => !!c.registered);
  const total = courses.length;
  const totalRegistered = registeredCourses.length;
  const mandatoryRegisteredCount = registeredCourses.filter((c) => c.type === "mandatory").length;
  const percentage = totalRegistered === 0 ? 0 : Math.round((mandatoryRegisteredCount / totalRegistered) * 100);

  const [openTypes, setOpenTypes] = useState<Record<string, boolean>>({});

  // Registration Modal State
  const [selectedCourse, setSelectedCourse] = useState<CdpCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("Starting from today");
  const [submitting, setSubmitting] = useState(false);

  // Course Completion Modal State
  const [selectedCompletionCourse, setSelectedCompletionCourse] = useState<CdpCourse | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [completing, setCompleting] = useState(false);

  // View Completed Course Modal State
  const [selectedViewCourse, setSelectedViewCourse] = useState<CdpCourse | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
  }, [JSON.stringify(grouped)]);

  const handleCourseClick = (course: CdpCourse) => {
    if (!course.registered) {
      // Unregistered course -> Open registration modal
      setSelectedCourse(course);
      setStartDate(new Date().toISOString().slice(0, 10));
      setNote("Starting from today");
      setIsModalOpen(true);
    } else if (course.enrollmentStatus === "completed") {
      // Completed course -> Open read-only view details modal
      setSelectedViewCourse(course);
      setIsViewModalOpen(true);
    } else {
      // On-going or due course -> Open completion modal
      setSelectedCompletionCourse(course);
      setCompletionNote("");
      setCertificateFile(null);
      setIsCompletionModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const submitRegistration = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      await enrollInCourse(selectedCourse.id, { startDate, notes: note });
      toast.success("Enrolled in course successfully!");
      fetchCourses();

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
    } catch (err: any) {
      console.error("Error registering course:", err);
      toast.error(err.message || "Failed to start course");
    } finally {
      setSubmitting(false);
      closeModal();
    }
  };

  const submitCompletion = async () => {
    if (!selectedCompletionCourse || !selectedCompletionCourse.progressId || !certificateFile) {
      toast.error("Please select a certificate file.");
      return;
    }
    setCompleting(true);
    try {
      // 1. Upload file using uploadFile helper
      const fileKey = await uploadFile(certificateFile);
      const relativeUrl = `/uploads/${fileKey}`;

      // 2. Call backend update progress API
      await updateProgress(selectedCompletionCourse.progressId, {
        certificateUrl: relativeUrl,
        notes: completionNote,
      });

      toast.success("Course marked as completed!");
      setIsCompletionModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      console.error("Error completing course:", err);
      toast.error(err.message || "Failed to complete course.");
    } finally {
      setCompleting(false);
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
                          onClick={() => handleCourseClick(course)}
                          role="button"
                          tabIndex={0}
                          className="bg-[#14112E] border border-gray-800 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition text-left"
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
                                onClick={() => handleCourseClick(course)}
                                role="button"
                                tabIndex={0}
                                className="bg-[#14112E] border border-gray-800 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition text-left"
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
            <div className="relative bg-[#0b0a17] border border-gray-800 rounded-md p-6 w-full max-w-lg mx-4 z-10 text-white">
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
                className="w-full mb-4 p-2 bg-[#14112E] border border-gray-700 rounded text-white resize-none"
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

        {/* Course Completion Modal */}
        {isCompletionModalOpen && selectedCompletionCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsCompletionModalOpen(false)} />
            <div className="relative bg-[#0b0a17] border border-gray-800 rounded-md p-6 w-full max-w-lg mx-4 z-10 text-white">
              <h3 className="text-xl font-semibold mb-4 text-[#F68E2D]">Complete Course: {selectedCompletionCourse.courseName}</h3>
              
              <form onSubmit={(e) => { e.preventDefault(); submitCompletion(); }}>
                <div className="space-y-4 mb-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Upload Certificate *</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setCertificateFile(file);
                      }}
                      className="w-full p-2 bg-[#14112E] border border-gray-700 rounded text-white text-sm"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Allowed formats: PDF, PNG, JPG, JPEG, WEBP. Max size: 10MB.</p>
                  </div>

                  {/* Description / Notes */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Completion Description / Notes</label>
                    <textarea
                      value={completionNote}
                      onChange={(e) => setCompletionNote(e.target.value)}
                      placeholder="Enter a description or notes about your learning experience..."
                      className="w-full p-2 bg-[#14112E] border border-gray-700 rounded text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F68E2D] resize-none"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCompletionModalOpen(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition"
                    disabled={completing}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F68E2D] hover:bg-[#e57d1f] text-black font-semibold rounded text-sm transition disabled:opacity-50"
                    disabled={completing || !certificateFile}
                  >
                    {completing ? "Submitting..." : "Complete Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Completed Details Modal */}
        {isViewModalOpen && selectedViewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsViewModalOpen(false)} />
            <div className="relative bg-[#0b0a17] border border-gray-800 rounded-md p-6 w-full max-w-lg mx-4 z-10 text-white">
              <h3 className="text-xl font-semibold mb-3 text-[#F68E2D]">Course Details: {selectedViewCourse.courseName}</h3>
              <p className="text-sm text-gray-400 mb-4">Module {selectedViewCourse.modules} • {selectedViewCourse.timeInHr} hrs</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Status</span>
                  <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full mt-1">Completed</span>
                </div>
                
                {selectedViewCourse.registrationStartDate && (
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider">Start Date</span>
                    <p className="text-sm text-white mt-0.5">{new Date(selectedViewCourse.registrationStartDate).toLocaleDateString()}</p>
                  </div>
                )}

                {selectedViewCourse.registrationNote && (
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider">Notes / Description</span>
                    <p className="text-sm text-white/90 mt-0.5 whitespace-pre-wrap">{selectedViewCourse.registrationNote}</p>
                  </div>
                )}

                {selectedViewCourse.certificateUrl && (
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider">Certificate</span>
                    <a
                      href={getImageSrc(selectedViewCourse.certificateUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-sm text-[#F68E2D] hover:underline"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15V3m0 12l-4-4m4 4l4-4M4 17v4h16v-4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View / Download Certificate
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}