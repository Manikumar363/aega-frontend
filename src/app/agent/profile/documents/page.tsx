"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/api/fileService";

interface DocumentWithDetails {
  id: number;
  label: string;
  path: string;
  date: string;
  size: string;
  isAdminUploaded?: boolean;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [router]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      // Fetch Profile User Documents
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      const userDocs = data.documents || [];

      // Also fetch admin-uploaded documents for this user
      let adminDocs: any[] = [];
      try {
        const adminRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/agent-management/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          adminDocs = Array.isArray(adminData) ? adminData : adminData.data || [];
        }
      } catch (err) {
        console.log("No admin documents fetched:", err);
      }

      const allCombined = [...userDocs, ...adminDocs];

      const docs: DocumentWithDetails[] = allCombined.map((doc: any, index: number) => {
        // Calculate exact formatted file size
        let sizeStr = "1.5 MB";
        const rawSize = Number(doc.size || doc.fileSize);
        if (rawSize && !isNaN(rawSize) && rawSize > 0) {
          if (rawSize >= 1024 * 1024) {
            sizeStr = `${(rawSize / (1024 * 1024)).toFixed(2)} MB`;
          } else {
            sizeStr = `${(rawSize / 1024).toFixed(1)} KB`;
          }
        }

        // Exact Uploaded Date
        const rawDate = doc.uploadedAt || doc.createdAt || doc.date;
        const dateObj = rawDate ? new Date(rawDate) : new Date();
        const dateStr = dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        // Exact Document Name
        const label = doc.documentName || doc.originalName || doc.fileName || doc.name || `Document ${index + 1}`;
        const path = doc.fileUrl || doc.path || doc.filePath || "";

        return {
          id: index + 1,
          label,
          path,
          date: dateStr,
          size: sizeStr,
          isAdminUploaded: !!doc.isAdminUploaded || !!doc.uploadedByAdmin,
        };
      });

      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  // Programmatic force file download
  const handleDownload = async (docPath: string, docLabel: string, docId: number) => {
    if (!docPath) {
      toast.error("File URL is invalid");
      return;
    }

    setDownloadingId(docId);
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const fullUrl = docPath.startsWith("http") ? docPath : `${baseUrl}/${docPath.replace(/^\/+/, "")}`;

      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("File fetch failed");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = docLabel || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success(`Downloaded ${docLabel}`);
    } catch (error) {
      console.error("Download error:", error);
      // Fallback opening
      const baseUrl = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const fullUrl = docPath.startsWith("http") ? docPath : `${baseUrl}/${docPath.replace(/^\/+/, "")}`;
      window.open(fullUrl, "_blank");
      toast.success(`Opened ${docLabel}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const fileKey = await uploadFile(selectedFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentName: documentName.trim() || selectedFile.name,
          fileUrl: fileKey,
          originalName: selectedFile.name,
          size: selectedFile.size,
          uploadedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save document");
      }

      toast.success("Document uploaded successfully!");
      setDocumentName("");
      setSelectedFile(null);
      setShowUploadModal(false);
      await fetchDocuments();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6 text-white pb-10">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-700 pb-3">
          <button onClick={() => router.push("/agent/profile")} className="text-base font-medium text-gray-400 hover:text-white cursor-pointer">
            Profile
          </button>
          <button onClick={() => router.push("/agent/profile")} className="text-base font-medium text-gray-400 hover:text-white cursor-pointer">
            Edit Profile
          </button>
          <button className="text-base font-semibold text-[#F68E2D] border-b-2 border-[#F68E2D]">
            Documents
          </button>
          <button onClick={() => router.push("/agent/profile/reset-password")} className="text-base font-medium text-gray-400 hover:text-white cursor-pointer">
            Reset Password
          </button>
        </div>

        {/* Upload Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Documents</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#F68E2D] hover:bg-[#e28124] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            Upload Document
          </button>
        </div>

        {isLoading && <p className="text-gray-400 py-8">Loading documents...</p>}

        {!isLoading && documents.length === 0 && (
          <div className="bg-[#14112E] border border-gray-800 rounded-xl p-10 text-center text-gray-400">
            No documents uploaded yet. Click "Upload Document" above.
          </div>
        )}

        {!isLoading && documents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-[#14112E] border border-gray-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#F68E2D] text-base font-bold truncate max-w-[280px]">
                      {doc.label}
                    </h3>
                    {doc.isAdminUploaded && (
                      <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">
                        Admin Document
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Uploaded: <span className="text-white font-medium">{doc.date}</span> • Size: <span className="text-white font-medium">{doc.size}</span>
                  </p>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-gray-800">
                  <button
                    onClick={() => handleDownload(doc.path, doc.label, doc.id)}
                    disabled={downloadingId === doc.id}
                    className="bg-[#0A0724] hover:bg-[#1A163E] text-white border border-white/20 text-xs px-4 py-2 rounded-lg font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {downloadingId === doc.id ? "Downloading..." : "Download Document"} ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-[#14112E] border border-gray-700 rounded-xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <h3 className="text-lg font-bold">Upload Supporting Document</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white font-bold">×</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Document Display Name</label>
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="e.g. Business License, Tax Certificate"
                    className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-[#F68E2D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Select File (PDF, JPG, PNG &lt; 10MB)</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={handleFileSelect}
                    className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2 text-gray-300 file:bg-[#F68E2D] file:text-white file:border-none file:px-3 file:py-1 file:rounded file:text-xs file:font-bold file:mr-3 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocument}
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#F68E2D] hover:bg-[#e28124] rounded-lg text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
