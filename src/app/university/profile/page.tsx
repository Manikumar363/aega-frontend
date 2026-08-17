"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { uploadFile } from "@/lib/api/fileService";

interface UniversityProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  region: string;
  country: string;
  city: string;
  logo: string;
  accreditation: string;
  description: string;
  status: string;
  documents: Array<{
    label: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
    path: string;
    uploadedAt?: string;
  }>;
}

export default function UniversityProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "edit">("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState<UniversityProfileData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    website: "",
    region: "",
    country: "",
    city: "",
    logo: "",
    accreditation: "",
    description: "",
    status: "",
    documents: []
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [tempLogoUrl, setTempLogoUrl] = useState<string | null>(null);

  // Fetch University Profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch university profile");
      }

      const resData = await response.json();
      const uni = resData.data;

      // Extract documents from populated user
      const docs = uni.userId?.documents || [];

      setProfileData({
        id: uni._id,
        name: uni.name || "",
        email: uni.email || uni.userId?.email || "",
        phone: uni.phone || uni.userId?.phone || "",
        website: uni.website || "",
        region: uni.region || "",
        country: uni.country || "",
        city: uni.city || "",
        logo: uni.logo || uni.userId?.profileImage || "",
        accreditation: uni.accreditation || "",
        description: uni.description || "",
        status: uni.status || "pending",
        documents: docs
      });

      const rawPic = uni.logo || uni.userId?.profileImage;
      if (rawPic) {
        const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
        const imgUrl = rawPic.startsWith("http") ? rawPic : `${baseUrl}/${rawPic.replace(/^\/+/, "")}`;
        setTempLogoUrl(imgUrl);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogoUrl(reader.result as string);
        setProfileImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error("University Name is required");
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      let logoUrl = profileData.logo;
      if (profileImageFile) {
        const logoPath = await uploadFile(profileImageFile);
        logoUrl = logoPath;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/${profileData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name.trim(),
          phone: profileData.phone.trim(),
          website: profileData.website.trim(),
          region: profileData.region.trim(),
          country: profileData.country.trim(),
          city: profileData.city.trim(),
          logo: logoUrl,
          accreditation: profileData.accreditation.trim(),
          description: profileData.description.trim()
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setActiveTab("profile");
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Programmatic document download
  const handleDownload = async (docPath: string, docLabel: string) => {
    if (!docPath) {
      toast.error("File URL is invalid");
      return;
    }

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const fullUrl = docPath.startsWith("http") ? docPath : `${baseUrl}/${docPath.replace(/^\/+/, "")}`;

      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("File fetch failed");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = docLabel || "supporting-document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success(`Downloaded ${docLabel}`);
    } catch (error) {
      toast.error("Failed to download document");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="university">
        <div className="min-h-screen flex items-center justify-center bg-[#03091F] text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F68E2D]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="university">
      <div className="space-y-6 text-white pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide uppercase">University Profile</h1>
            <p className="text-xs text-gray-400">View and update your official university settings</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                activeTab === "profile" ? "bg-[#F68E2D] text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                activeTab === "edit" ? "bg-[#F68E2D] text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              Edit Details
            </button>
          </div>
        </div>

        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Card: Logo & Basic Info */}
            <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
              <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                {tempLogoUrl ? (
                  <Image src={tempLogoUrl} alt="Logo" fill className="object-cover" />
                ) : (
                  <FileText className="h-16 w-16 text-gray-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{profileData.name}</h2>
                <p className="text-xs text-[#F68E2D] font-semibold mt-1">{profileData.website || "No website specified"}</p>
              </div>

              <div className="w-full pt-4 border-t border-gray-800 space-y-2 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    profileData.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {profileData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-semibold">{profileData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="font-semibold">{profileData.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Location & Profile Docs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Location & Details */}
              <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#F68E2D] uppercase tracking-wider">Institution Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-1">City</span>
                    <span className="font-semibold text-sm">{profileData.city || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Region / State</span>
                    <span className="font-semibold text-sm">{profileData.region || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Country</span>
                    <span className="font-semibold text-sm">{profileData.country || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Accreditation</span>
                    <span className="font-semibold text-sm">{profileData.accreditation || "Not Specified"}</span>
                  </div>
                </div>

                {profileData.description && (
                  <div className="pt-4 border-t border-gray-800">
                    <span className="text-gray-400 block mb-1 text-xs">About / Description</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{profileData.description}</p>
                  </div>
                )}
              </div>

              {/* Supporting Documents */}
              <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#F68E2D] uppercase tracking-wider">Submitted Supporting Documents</h3>
                {profileData.documents.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>No supporting documents uploaded yet.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.documents.map((doc, index) => {
                      const label = doc.label === "supportingDocument1" ? "Supporting Document 1" : doc.label === "supportingDocument2" ? "Supporting Document 2" : doc.label;
                      const sizeInMB = doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : "Unknown size";
                      return (
                        <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-[#F68E2D]" />
                            <div className="text-left">
                              <span className="text-xs font-bold block text-white">{label}</span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{doc.originalName || "document.pdf"}</span>
                              <span className="text-[9px] text-gray-500 block">{sizeInMB}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(doc.path, doc.originalName || "document.pdf")}
                            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full cursor-pointer text-[#F68E2D]"
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* EDIT TAB */
          <div className="max-w-3xl bg-[#14112E] border border-gray-800 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-[#F68E2D]">Edit University Information</h3>
            <div className="space-y-4 text-xs">
              {/* Profile Image Select */}
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-900 border border-gray-800 flex items-center justify-center">
                  {tempLogoUrl ? (
                    <Image src={tempLogoUrl} alt="Logo Preview" fill className="object-cover" />
                  ) : (
                    <FileText className="h-10 w-10 text-gray-700" />
                  )}
                </div>
                <div>
                  <label className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-xs cursor-pointer font-bold block">
                    Upload New Logo
                    <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
                  </label>
                  <span className="text-[10px] text-gray-500 block mt-1">PNG, JPG or WebP (Max 5MB)</span>
                </div>
              </div>

              {/* Fields */}
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">University Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Phone / Mobile *</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9+\s-]/g, '') }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Website URL</label>
                  <input
                    type="text"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Region / State</label>
                  <input
                    type="text"
                    value={profileData.region}
                    onChange={(e) => setProfileData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Accreditation Details</label>
                <input
                  type="text"
                  value={profileData.accreditation}
                  onChange={(e) => setProfileData(prev => ({ ...prev, accreditation: e.target.value }))}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">University Description</label>
                <textarea
                  rows={4}
                  value={profileData.description}
                  onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#F68E2D] hover:bg-[#e28124] text-white rounded-lg text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}