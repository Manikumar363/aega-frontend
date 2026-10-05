"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect, useRef } from "react";
import { getStoredUserData } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Upload, Download, FileText, Plus, Trash2, Pencil, CheckCircle, AlertCircle, X } from "lucide-react";
import { uploadFile } from "@/lib/api/fileService";

interface DocItem {
  id: string;
  label: string;
  originalName: string;
  path: string;
  size?: number;
  mimeType?: string;
  uploadedAt?: string;
}

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
  companyDocument1: string;
  companyDocument2: string;
  documents: DocItem[];
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
    status: "active",
    companyDocument1: "",
    companyDocument2: "",
    documents: []
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [tempLogoUrl, setTempLogoUrl] = useState<string | null>(null);

  // Modals & Document Editing State
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocLabel, setNewDocLabel] = useState("");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editDocLabel, setEditDocLabel] = useState("");
  const [editDocFile, setEditDocFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch University Profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
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
      if (!uni) return;

      // Extract and combine all documents
      const docsList: DocItem[] = [];
      const rawUserDocs = uni.userId?.documents || [];
      const rawUniDocs = uni.documents || [];
      const combinedRaw = [...rawUniDocs, ...rawUserDocs];

      combinedRaw.forEach((d: any, idx: number) => {
        if (d && d.path) {
          const docId = d._id || d.id || `doc_${idx}_${d.path}`;
          if (!docsList.some((existing) => existing.path === d.path)) {
            docsList.push({
              id: String(docId),
              label: d.label === "supportingDocument1" ? "Supporting Document 1" : d.label === "supportingDocument2" ? "Supporting Document 2" : (d.label || "Supporting Document"),
              originalName: d.originalName || d.path.split("/").pop() || "document.pdf",
              path: d.path,
              size: d.size,
              mimeType: d.mimeType,
              uploadedAt: d.uploadedAt
            });
          }
        }
      });

      const doc1 = uni.companyDocument1 || uni.userId?.companyDocument1;
      if (doc1 && !docsList.some((d) => d.path === doc1)) {
        docsList.push({
          id: "compDoc1",
          label: "Registration / Supporting Document 1",
          originalName: doc1.split("/").pop() || "document1.pdf",
          path: doc1
        });
      }

      const doc2 = uni.companyDocument2 || uni.userId?.companyDocument2;
      if (doc2 && !docsList.some((d) => d.path === doc2)) {
        docsList.push({
          id: "compDoc2",
          label: "Registration / Supporting Document 2",
          originalName: doc2.split("/").pop() || "document2.pdf",
          path: doc2
        });
      }

      const uniName = uni.name || (uni.userId as any)?.name || (uni.userId as any)?.universityName || (getStoredUserData() as any)?.name || (getStoredUserData() as any)?.universityName || "University Account";
      const uniEmail = uni.email || uni.userId?.email || getStoredUserData()?.email || "";
      const uniPhone = uni.phone || uni.userId?.phone || "";
      const uniLogo = uni.logo || uni.userId?.profileImage || "";
      const uniStatus = uni.status || "active";

      setProfileData({
        id: uni._id,
        name: uniName,
        email: uniEmail,
        phone: uniPhone,
        website: uni.website || "",
        region: uni.region || "",
        country: uni.country || "",
        city: uni.city || "",
        logo: uniLogo,
        accreditation: uni.accreditation || "",
        description: uni.description || "",
        status: uniStatus,
        companyDocument1: doc1 || "",
        companyDocument2: doc2 || "",
        documents: docsList
      });

      if (uniLogo) {
        const baseUrl = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
        const rel = uniLogo.startsWith("/") ? uniLogo : `/${uniLogo}`;
        const imgUrl = uniLogo.startsWith("http") ? uniLogo : `${baseUrl}${rel}`;
        setTempLogoUrl(imgUrl);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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
    // 1. Validate University Name
    if (!profileData.name.trim()) {
      toast.error("University Name is required");
      return;
    }

    // 2. Validate Empty Mobile Number
    if (!profileData.phone.trim()) {
      toast.error("Phone / Mobile number is required");
      return;
    }

    // 3. Validate Website URL field
    let formattedWebsite = profileData.website.trim();
    if (formattedWebsite) {
      if (!/^https?:\/\//i.test(formattedWebsite)) {
        formattedWebsite = `https://${formattedWebsite}`;
      }
      try {
        const parsedUrl = new URL(formattedWebsite);
        if (!parsedUrl.hostname || !parsedUrl.hostname.includes(".")) {
          toast.error("Please enter a valid Website URL (e.g. https://example.com)");
          return;
        }
      } catch {
        toast.error("Please enter a valid Website URL (e.g. https://example.com)");
        return;
      }
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
          website: formattedWebsite,
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
        throw new Error(errorData.message || "Failed to update profile details");
      }

      const responseJson = await res.json();
      const updatedUni = responseJson.data || {};

      const stored = getStoredUserData() || {};
      const updatedUser = {
        ...stored,
        name: profileData.name.trim(),
        universityName: profileData.name.trim(),
        fullName: profileData.name.trim(),
        phone: profileData.phone.trim(),
        logo: logoUrl,
        profileImage: logoUrl,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage"));
      }

      // Preserve local state consistency immediately
      setProfileData(prev => ({
        ...prev,
        name: updatedUni.name || profileData.name.trim(),
        phone: updatedUni.phone || profileData.phone.trim(),
        website: updatedUni.website !== undefined ? updatedUni.website : formattedWebsite,
        region: updatedUni.region !== undefined ? updatedUni.region : profileData.region.trim(),
        country: updatedUni.country !== undefined ? updatedUni.country : profileData.country.trim(),
        city: updatedUni.city !== undefined ? updatedUni.city : profileData.city.trim(),
        logo: updatedUni.logo || logoUrl,
        accreditation: updatedUni.accreditation !== undefined ? updatedUni.accreditation : profileData.accreditation.trim(),
        description: updatedUni.description !== undefined ? updatedUni.description : profileData.description.trim()
      }));

      if (logoUrl) {
        const baseUrl = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
        const rel = logoUrl.startsWith("/") ? logoUrl : `/${logoUrl}`;
        const imgUrl = logoUrl.startsWith("http") ? logoUrl : `${baseUrl}${rel}`;
        setTempLogoUrl(imgUrl);
      }

      toast.success("Profile details updated successfully!");
      setActiveTab("profile");
      await fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Programmatic Document Download
  const handleDownload = async (docPath: string, docLabel: string) => {
    if (!docPath) {
      toast.error("File URL is invalid");
      return;
    }

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const rel = docPath.startsWith("/") ? docPath : `/${docPath}`;
      const fullUrl = docPath.startsWith("http") ? docPath : `${baseUrl}${rel}`;

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

  // Delete Document Handler
  const handleDeleteDocument = async (docId: string, docLabel: string) => {
    if (!window.confirm(`Are you sure you want to delete "${docLabel}"?`)) return;

    try {
      const token = localStorage.getItem("authToken");
      const updatedDocs = profileData.documents.filter((d) => d.id !== docId && d.path !== docId);

      let updatedCompDoc1 = profileData.companyDocument1;
      let updatedCompDoc2 = profileData.companyDocument2;
      if (docId === "compDoc1" || profileData.companyDocument1 === docId) updatedCompDoc1 = "";
      if (docId === "compDoc2" || profileData.companyDocument2 === docId) updatedCompDoc2 = "";

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/${profileData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documents: updatedDocs.map((d) => ({
            label: d.label,
            originalName: d.originalName,
            mimeType: d.mimeType,
            size: d.size,
            path: d.path,
          })),
          companyDocument1: updatedCompDoc1,
          companyDocument2: updatedCompDoc2,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete document");

      toast.success("Document deleted successfully");
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete document");
    }
  };

  // Add New Document Handler
  const handleAddDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocFile) {
      toast.error("Please select a document file");
      return;
    }

    try {
      setIsSubmittingDoc(true);
      toast.loading("Uploading new document...", { id: "add-doc" });
      const filePath = await uploadFile(newDocFile);

      const newDocItem: DocItem = {
        id: `new_${Date.now()}`,
        label: newDocLabel.trim() || "Supporting Document",
        originalName: newDocFile.name,
        mimeType: newDocFile.type,
        size: newDocFile.size,
        path: filePath,
        uploadedAt: new Date().toISOString()
      };

      const token = localStorage.getItem("authToken");
      const updatedDocs = [...profileData.documents, newDocItem];

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/${profileData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documents: updatedDocs.map((d) => ({
            label: d.label,
            originalName: d.originalName,
            mimeType: d.mimeType,
            size: d.size,
            path: d.path,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to save new document");

      toast.success("Document added successfully", { id: "add-doc" });
      setShowAddDocModal(false);
      setNewDocLabel("");
      setNewDocFile(null);
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to add document", { id: "add-doc" });
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  // Edit / Replace Document Handler
  const handleEditDocumentSave = async (docId: string, currentDoc: DocItem) => {
    try {
      toast.loading("Saving document changes...", { id: "edit-doc" });
      let newPath = currentDoc.path;
      let newOriginalName = currentDoc.originalName;
      let newSize = currentDoc.size;

      if (editDocFile) {
        newPath = await uploadFile(editDocFile);
        newOriginalName = editDocFile.name;
        newSize = editDocFile.size;
      }

      const labelToUse = editDocLabel.trim() || currentDoc.label;
      const updatedDocs = profileData.documents.map((d) => {
        if (d.id === docId || d.path === currentDoc.path) {
          return {
            ...d,
            label: labelToUse,
            originalName: newOriginalName,
            path: newPath,
            size: newSize,
          };
        }
        return d;
      });

      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/${profileData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documents: updatedDocs.map((d) => ({
            label: d.label,
            originalName: d.originalName,
            mimeType: d.mimeType,
            size: d.size,
            path: d.path,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to update document");

      toast.success("Document updated successfully", { id: "edit-doc" });
      setEditingDocId(null);
      setEditDocFile(null);
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to update document", { id: "edit-doc" });
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
            <button
              onClick={() => router.push("/university/profile/documents")}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              All Documents
            </button>
          </div>
        </div>

        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Card: Logo & Basic Info */}
            <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center space-y-4 shadow-xl">
              <div className="relative h-36 w-36 rounded-full overflow-hidden bg-gray-900 border-4 border-[#F68E2D]/40 flex items-center justify-center shadow-lg">
                {tempLogoUrl ? (
                  <img src={tempLogoUrl} alt={profileData.name} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="h-16 w-16 text-gray-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
                <p className="text-xs text-[#F68E2D] font-semibold mt-1">{profileData.website || "No website specified"}</p>
              </div>

              <div className="w-full pt-4 border-t border-gray-800 space-y-3 text-left text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    (profileData.status || "active").toLowerCase() === "active"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {profileData.status || "active"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-gray-400 font-semibold shrink-0">Email:</span>
                  <span className="font-bold text-white text-xs truncate" title={profileData.email}>{profileData.email || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-gray-400 font-semibold shrink-0">Phone:</span>
                  <span className="font-bold text-white text-xs">{profileData.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Location, Bold Description & Submitted Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* Location & Details */}
              <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-[#F68E2D] uppercase tracking-wider">INSTITUTION DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-1">City</span>
                    <span className="font-bold text-sm text-white">{profileData.city || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Region / State</span>
                    <span className="font-bold text-sm text-white">{profileData.region || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Country</span>
                    <span className="font-bold text-sm text-white">{profileData.country || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Accreditation</span>
                    <span className="font-bold text-sm text-white">{profileData.accreditation || "Not Specified"}</span>
                  </div>
                </div>

                {profileData.description && (
                  <div className="pt-4 border-t border-gray-800">
                    <span className="text-gray-400 block mb-1.5 text-xs uppercase font-bold">About / Description</span>
                    <p className="text-sm text-white font-bold leading-relaxed whitespace-pre-wrap">{profileData.description}</p>
                  </div>
                )}
              </div>

              {/* Submitted Supporting Documents with Edit & Delete */}
              <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F68E2D] uppercase tracking-wider">SUBMITTED SUPPORTING DOCUMENTS</h3>
                  <button
                    onClick={() => setShowAddDocModal(true)}
                    className="flex items-center gap-1.5 bg-[#F68E2D] hover:bg-[#e28124] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload Document</span>
                  </button>
                </div>

                {profileData.documents.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 p-4 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>No supporting documents uploaded yet.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.documents.map((doc) => {
                      const sizeInMB = doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : "PDF Document";
                      const isEditing = editingDocId === doc.id;

                      return (
                        <div key={doc.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="h-8 w-8 text-[#F68E2D] shrink-0" />
                              <div className="text-left overflow-hidden">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editDocLabel}
                                    onChange={(e) => setEditDocLabel(e.target.value)}
                                    className="bg-black/50 border border-[#F68E2D] rounded px-2 py-1 text-xs text-white outline-none w-full"
                                  />
                                ) : (
                                  <span className="text-xs font-bold block text-white truncate" title={doc.label}>{doc.label}</span>
                                )}
                                <span className="text-[10px] text-gray-400 block mt-0.5 truncate">{doc.originalName}</span>
                                <span className="text-[9px] text-gray-500 block">{sizeInMB}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Download, Edit, Delete */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800/80">
                            {isEditing ? (
                              <>
                                <label className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-200 cursor-pointer" title="Replace File">
                                  <Upload className="h-3.5 w-3.5" />
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) setEditDocFile(f);
                                    }}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  onClick={() => handleEditDocumentSave(doc.id, doc)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => { setEditingDocId(null); setEditDocFile(null); }}
                                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-bold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleDownload(doc.path, doc.originalName || "document.pdf")}
                                  className="p-1.5 bg-gray-800 hover:bg-gray-700 text-[#F68E2D] rounded transition-colors cursor-pointer"
                                  title="Download Document"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingDocId(doc.id);
                                    setEditDocLabel(doc.label);
                                  }}
                                  className="p-1.5 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded transition-colors cursor-pointer"
                                  title="Edit Document"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(doc.id, doc.label)}
                                  className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 border border-red-800/40 rounded transition-colors cursor-pointer"
                                  title="Delete Document"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
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
          <div className="max-w-3xl bg-[#14112E] border border-gray-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#F68E2D]">Edit University Information</h3>
            <div className="space-y-4 text-xs">
              {/* Profile Image Select */}
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                  {tempLogoUrl ? (
                    <img src={tempLogoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="h-10 w-10 text-gray-700" />
                  )}
                </div>
                <div>
                  <label className="bg-[#F68E2D] hover:bg-[#e28124] text-white px-4 py-2 rounded text-xs cursor-pointer font-bold inline-flex items-center gap-1.5 uppercase transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload New Logo</span>
                    <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
                  </label>
                  <span className="text-[10px] text-gray-400 block mt-1">PNG, JPG or WebP (Max 5MB)</span>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">
                    University Name <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter University Name"
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">
                    Email ID <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    readOnly
                    className="w-full bg-gray-900/80 border border-gray-800 rounded-lg p-3 text-gray-400 cursor-not-allowed outline-none select-none font-medium"
                    title="Email address cannot be modified"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">
                    Phone / Mobile <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9+\s-]/g, '') }))}
                    placeholder="Enter Phone / Mobile Number"
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Region / State</label>
                  <input
                    type="text"
                    value={profileData.region}
                    onChange={(e) => setProfileData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Accreditation Details</label>
                <input
                  type="text"
                  value={profileData.accreditation}
                  onChange={(e) => setProfileData(prev => ({ ...prev, accreditation: e.target.value }))}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">University Description</label>
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

        {/* ADD DOCUMENT MODAL */}
        {showAddDocModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-lg font-bold text-[#F68E2D]">Upload Supporting Document</h3>
                <button onClick={() => setShowAddDocModal(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleAddDocumentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Document Title / Label *</label>
                  <input
                    type="text"
                    value={newDocLabel}
                    onChange={(e) => setNewDocLabel(e.target.value)}
                    placeholder="e.g. Accreditation Certificate"
                    required
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Select File *</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setNewDocFile(f);
                    }}
                    required
                    className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-2.5 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAddDocModal(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDoc}
                    className="px-5 py-2 bg-[#F68E2D] hover:bg-[#e28124] text-white rounded-lg font-bold uppercase cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingDoc ? "Uploading..." : "Upload Document"}
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
