import { apiGet } from "./apiClient";
import type { CdpCourse } from "./types";

function normalize(raw: any): CdpCourse {
  return {
    id: String(raw._id || raw.id || raw.courseId || raw.uuid || raw._id),
    _id: raw._id,
    courseName: raw.courseName || raw.title || "Untitled Course",
    type: raw.type || raw.category || "optional",
    timeInHr: typeof raw.timeInHr === "number" ? raw.timeInHr : Number(raw.timeInHr) || 0,
    modules: typeof raw.modules === "number" ? raw.modules : Number(raw.modules) || 0,
    hyperLink: raw.hyperLink || raw.link || "",
    description: raw.description || "",
    coverPicture: raw.coverPicture || raw.cover || "",
    registered:
      raw.registered === true ||
      raw.isRegistered === true ||
      raw.enrolled === true ||
      raw.isEnrolled === true ||
      Boolean(raw.registeredBy) ||
      Boolean(raw.registeredByUser) ||
      false,
    registrationNote: raw.registrationNote || raw.note || raw.startNote || "",
    registrationStartDate:
      raw.registrationStartDate || raw.registrationStart || raw.startedAt || raw.startDate || "",
    createdBy: raw.createdBy || raw.author || "",
    createdAt: raw.createdAt || raw.created_at || "",
    __v: raw.__v || 0,
  };
}

export async function getCdpCourses(): Promise<CdpCourse[]> {
  const response = await apiGet<any>("/api/cdp-courses");

  let rawList: any[] = [];
  if (Array.isArray(response)) rawList = response;
  else if (response && Array.isArray(response.data)) rawList = response.data;
  else if (response && Array.isArray(response.courses)) rawList = response.courses;
  else if (response && Array.isArray(response.result)) rawList = response.result;

  return rawList.map(normalize);
}
