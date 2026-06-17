import { apiGet, apiPost, apiPut } from "./apiClient";
import type { CdpCourse, CdpCourseListResponse, CdpEnrollment, CdpEnrollmentResponse, CdpStats } from "./types";

export async function getCdpCourses(): Promise<CdpCourse[]> {
  const res = await apiGet<any>("/api/cdp-courses");
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  if (res && Array.isArray(res.courses)) return res.courses;
  return [];
}

export async function enrollInCourse(courseId: string, body: { startDate: string; notes?: string }): Promise<CdpEnrollmentResponse> {
  return apiPost<CdpEnrollmentResponse>(`/api/cdp-courses/${courseId}/enroll`, body);
}

export async function getMyEnrolledCourses(): Promise<CdpEnrollment[]> {
  const res = await apiGet<any>("/api/cdp-courses/me/enrolled");
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getProgress(progressId: string) {
  return apiGet<any>(`/api/cdp-courses/progress/${progressId}`);
}

export async function updateProgress(progressId: string, body: { certificateUrl?: string; notes?: string }) {
  return apiPut<any>(`/api/cdp-courses/progress/${progressId}`, body);
}

export async function getMyStats(): Promise<CdpStats> {
  const res = await apiGet<any>("/api/cdp-courses/me/stats");
  return res || { total: 0, completed: 0, ongoing: 0, due: 0 };
}
