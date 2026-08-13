"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCdpCourses,
  enrollInCourse,
  getMyEnrolledCourses,
  type CdpCourse,
  uploadFile,
  updateProgress,
} from "@/lib/api";
import { Edit2, Play, Pause, Video, CheckCircle2, X } from "lucide-react";

export default function UniversityCDPPage() {
  const [courses, setCourses] = useState<CdpCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [selectedCourse, setSelectedCourse] = useState<CdpCourse | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [watchVideoUrl, setWatchVideoUrl] = useState<string | null>(null);

  // Form States
  const [todayStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Completion Modal Form
  const [completionNote, setCompletionNote] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [completing, setCompleting] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCdpCourses();
      const enrolled = await getMyEnrolledCourses().catch(() => []);

      const enrolledById = new Map<string, any>();
      enrolled.forEach((e: any) => {
        const cid = e.courseId && (e.courseId._id || e.courseId);
        if (cid) enrolledById.set(String(cid), e);
      });

      // Filter courses specific to Universities
      const universityCourses = data.filter(
        (c: any) => c.courseFor === "universities" || c.courseFor === "university"
      );

      const normalized = universityCourses.map((c) => {
        const match = enrolledById.get(c._id || c.id);
        if (match) {
          return {
            ...c,
            registered: true,
            progressId: match._id || match.id,
            registrationStartDate: match.startDate || match.enrollmentDate,
            registrationNote: match.notes || "",
            enrollmentStatus: match.status || "on-going",
            certificateUrl: match.certificateUrl || null,
          };
        }
        return c;
      });

      setCourses(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const registeredCourses = courses.filter((c) => !!c.registered);
  const completedCourses = registeredCourses.filter((c) => c.enrollmentStatus === "completed");
  const totalCourses = courses.length;
  const completedCount = completedCourses.length;
  const progressPercentage = totalCourses === 0 ? 0 : Math.round((completedCount / totalCourses) * 100);

  const getImageSrc = (path?: string) => {
    if (!path) return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80";
    let cleanPath = path.replace(/(\/)?uploads\/uploads\//g, "uploads/");
    if (/^https?:\/\//.test(cleanPath) || cleanPath.startsWith("//")) return cleanPath;
    const base = (
      process.env.NEXT_PUBLIC_ANTRYK_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      ""
    ).replace(/\/$/, "");
    const rel = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${base}${rel}`;
  };

  const handleOpenRegistrationModal = (course: CdpCourse) => {
    setSelectedCourse(course);
    setStartDate(todayStr);
    setNote("");
    setIsRegistrationModalOpen(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (!startDate) {
      toast.error("Start Date is mandatory.");
      return;
    }

    try {
      setSubmitting(true);
      const courseId = String(selectedCourse._id || selectedCourse.id);
      const res = await enrollInCourse(courseId, {
        startDate,
        notes: note.trim(),
      });

      toast.success(res.message || "Enrolled in course successfully!");
      setIsRegistrationModalOpen(false);
      await fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to register for course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (course: CdpCourse) => {
    setSelectedCourse(course);
    setStartDate(course.registrationStartDate?.slice(0, 10) || todayStr);
    setNote(course.registrationNote || "");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedCourse.progressId) return;

    if (!startDate) {
      toast.error("Start Date is mandatory.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/cdp-courses/enrolled/${selectedCourse.progressId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startDate,
            notes: note.trim(),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update schedule");

      toast.success("Schedule updated!");
      setIsEditModalOpen(false);
      await fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to update schedule.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePause = async (course: CdpCourse) => {
    if (!course.progressId) return;
    const nextStatus = course.enrollmentStatus === "paused" ? "on-going" : "paused";

    try {
      await updateProgress(course.progressId, { status: nextStatus });
      toast.success(`Course ${nextStatus === "paused" ? "paused" : "resumed"}`);
      await fetchCourses();
    } catch (err: any) {
      toast.error("Failed to update status.");
    }
  };

  const handleWatchVideo = (course: CdpCourse) => {
    const videoUrl = course.hyperLink || "https://www.youtube.com/embed/dQw4w9WgXcQ";
    setWatchVideoUrl(videoUrl);
    setSelectedCourse(course);
    setIsVideoModalOpen(true);
  };

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Certificate file size exceeds 10 MB limit!");
        e.target.value = "";
        setCertificateFile(null);
        return;
      }
      setCertificateFile(file);
    }
  };

  const handleCompletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedCourse.progressId) return;

    try {
      setCompleting(true);
      let certUrl = "";
      if (certificateFile) {
        certUrl = await uploadFile(certificateFile);
      }

      await updateProgress(selectedCourse.progressId, {
        status: "completed",
        certificateUrl: certUrl,
        completionDate: new Date().toISOString(),
        notes: completionNote.trim(),
      });

      toast.success("Course marked as Completed!");
      setIsCompletionModalOpen(false);
      setCertificateFile(null);
      setCompletionNote("");
      await fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark course complete.");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <DashboardLayout role="university">
      <div className="space-y-8 text-white pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold">University CDP Training Platform</h1>
            <p className="text-sm text-white/60">
              Access university partner training modules &amp; UKVI compliance certifications.
            </p>
          </div>
          <div className="bg-[#14112E] border border-gray-800 px-4 py-2 rounded-lg text-xs font-bold text-[#F68E2D]">
            TOTAL COURSES COMPLETED: ({completedCount}/{totalCourses})
          </div>
        </div>

        {/* CDP PROGRESS SECTION */}
        <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">CDP PROGRESS</h2>
              <p className="text-xs text-gray-400">University CDP completion score bar</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-[#F68E2D]">{progressPercentage}%</span>
              <span className="block text-[10px] text-gray-400 uppercase font-semibold">Overall Completion Score</span>
            </div>
          </div>

          <div className="w-full bg-[#0A0724] border border-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#F68E2D] to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <span>Completed: {completedCount} Modules</span>
            <span>Registered: {registeredCourses.length}</span>
            <span>Total Available: {totalCourses} Courses</span>
          </div>
        </div>

        {/* YOUR COURSES SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#F68E2D] pl-3">
            Your Courses &amp; University Partner Modules
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#F68E2D]"></div>
              <p className="text-sm text-gray-400 mt-2">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-xs">
              {error}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-[#14112E] border border-gray-800 p-8 rounded-xl text-center text-gray-400">
              No CDP courses available for University profile.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const imageSrc = getImageSrc(course.coverPicture);
                const isRegistered = !!course.registered;
                const status = course.enrollmentStatus || "on-going";
                const isCompleted = status === "completed";
                const isPaused = status === "paused";

                const isFutureDate = Boolean(
                  course.registrationStartDate &&
                  new Date(course.registrationStartDate.slice(0, 10)) > new Date(todayStr)
                );

                return (
                  <div
                    key={course._id || course.id}
                    className="bg-[#14112E] border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-[#F68E2D]/40 transition-colors"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-gray-900">
                        <img src={imageSrc} alt={course.courseName} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow ${
                              course.type === "mandatory"
                                ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {course.type}
                          </span>
                          {isRegistered && (
                            <span
                              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow ${
                                isCompleted
                                  ? "bg-emerald-600 text-white"
                                  : isPaused
                                  ? "bg-amber-600 text-white"
                                  : "bg-teal-600 text-white"
                              }`}
                            >
                              {status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-5 space-y-3">
                        <div
                          onClick={() => {
                            if (course.hyperLink) {
                              const url = course.hyperLink.startsWith("http") ? course.hyperLink : `https://${course.hyperLink}`;
                              window.open(url, "_blank");
                            } else {
                              toast.error("No course redirection link available.");
                            }
                          }}
                          className="cursor-pointer group"
                        >
                          <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-[#F68E2D] transition-colors flex items-center gap-1.5">
                            {course.courseName} <span className="text-xs text-blue-400">↗</span>
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                          <span>{course.modules} Modules</span>
                          <span>⏱ {course.timeInHr} Hours</span>
                        </div>

                        {/* Display Start Date & Notes if registered */}
                        {isRegistered && (
                          <div className="bg-[#0A0724] border border-gray-800 p-2.5 rounded-lg text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Start Date:</span>
                              <span className="text-[#F68E2D] font-bold">
                                {course.registrationStartDate ? course.registrationStartDate.slice(0, 10) : "N/A"}
                              </span>
                            </div>
                            {course.registrationNote && course.registrationNote !== "Starting from today" && (
                              <p className="text-[11px] text-gray-300 italic truncate">
                                "{course.registrationNote}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="p-5 pt-0 space-y-2">
                      {!isRegistered ? (
                        <button
                          onClick={() => handleOpenRegistrationModal(course)}
                          className="w-full bg-[#F68E2D] hover:bg-[#e28124] text-white py-2.5 rounded-lg font-bold text-xs uppercase transition-colors cursor-pointer"
                        >
                          Register Course
                        </button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {/* Edit Schedule Button */}
                          <button
                            onClick={() => handleOpenEditModal(course)}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>

                          {/* Complete Course Button */}
                          {!isCompleted ? (
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setIsCompletionModalOpen(true);
                              }}
                              disabled={isFutureDate}
                              className={`w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                                isFutureDate
                                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                            </button>
                          ) : (
                            <span className="w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-800">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* REGISTRATION MODAL */}
        {isRegistrationModalOpen && selectedCourse && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#14112E] border border-gray-700 rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto text-white space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-lg font-bold text-[#F68E2D]">Register for {selectedCourse.courseName}</h3>
                <button onClick={() => setIsRegistrationModalOpen(false)} className="text-gray-400 hover:text-white font-bold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-44 w-full rounded-lg overflow-hidden border border-gray-800">
                <img src={getImageSrc(selectedCourse.coverPicture)} alt={selectedCourse.courseName} className="w-full h-full object-cover" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Course Description</label>
                <div className="max-h-36 overflow-y-auto bg-[#0A0724] border border-gray-800 p-3 rounded-lg text-xs leading-relaxed text-gray-300">
                  {selectedCourse.description}
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white uppercase mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white uppercase mb-1">Notes / Objectives</label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter registration notes"
                    className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsRegistrationModalOpen(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-[#F68E2D] hover:bg-[#e28124] text-white rounded-lg text-xs font-bold uppercase disabled:opacity-50"
                  >
                    {submitting ? "Registering..." : "Start & Register Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}