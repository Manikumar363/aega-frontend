import { apiGet } from "./apiClient";
import type { University, UniversityListResponse } from "./types";

function generateShortCode(name?: string) {
  if (!name) return "--";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || "")).toUpperCase();
}

function pickColorFromName(name?: string) {
  const palette = [
    "#5C2EA8",
    "#1F2937",
    "#D9363E",
    "#0E7490",
    "#DC2626",
    "#1D4ED8",
    "#BE123C",
    "#B91C1C",
    "#0369A1",
  ];
  if (!name) return palette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % palette.length;
  return palette[idx];
}

/**
 * Normalize a raw API university object into our `University` shape
 */
function normalize(raw: any): University {
  const name = raw.name || raw.universityName || raw.displayName || (raw.university && raw.university.name) || "Unknown";
  const id = String(raw.id || raw._id || raw.universityId || raw.uuid || name.replace(/\s+/g, "-").toLowerCase());
  const mobile = raw.mobile || raw.phone || raw.contactNumber || "";
  const email = raw.email || raw.universityEmail || raw.contactEmail || "";
  const location = raw.location || raw.city || raw.address || "";
  const shortCode = raw.shortCode || raw.code || generateShortCode(name);
  const logoColor = raw.logoColor || raw.color || pickColorFromName(name);
  const verified = (raw.verified === "yellow" || raw.verified === "green") ? raw.verified : (raw.verified === true ? "green" : "yellow");
  const online = !!(raw.online || raw.isOnline || raw.active || raw.status === "active");

  return {
    id,
    name,
    mobile,
    email,
    location,
    shortCode,
    logoColor,
    verified,
    online,
  };
}

/**
 * Fetch all universities for the agent
 * @returns List of universities
 */
export async function getUniversities(): Promise<University[]> {
  const response = await apiGet<any>("/api/agent-management/universities");

  let rawList: any[] = [];
  if (Array.isArray(response)) rawList = response;
  else if (response && Array.isArray(response.data)) rawList = response.data;
  else if (response && Array.isArray(response.universities)) rawList = response.universities;
  else if (response && Array.isArray(response.result)) rawList = response.result;

  return rawList.map(normalize);
}
