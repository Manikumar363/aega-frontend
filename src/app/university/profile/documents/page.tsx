"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/api/fileService";
import { FileText, Download, Upload, AlertCircle } from "lucide-react";

interface DocumentWithDetails {
  id: number;
  label: string;
  path: string;
  date: string;
  size: string;
  isAdminUploaded?: boolean;
}

export default function UniversityDocumentsPage() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities/me/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch university profile");
      }

      const resData = await response.json();
      const userDocs = resData.data?.userId?.documents || [];

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
          label: label === "supportingDocument1" ? "Supporting Document 1" : label === "supportingDocument2" ? "Supporting Document 2" : label,
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
      const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
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
      toast.error("Failed to download file");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <DashboardLayout role="university">
      <div className="space-y-6 text-white pb-10">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Supporting Documents</h1>
            <p className="text-xs text-gray-400">View and download all official submitted and admin-assigned files</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F68E2D]"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>No documents found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-[#14112E] border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-900/50 rounded-lg">
                    <FileText className="h-8 w-8 text-[#F68E2D]" />
                  </div>
                  <div className="text-left space-y-1">
                    <span className="text-xs font-bold text-white block truncate max-w-[200px]" title={doc.label}>
                      {doc.label}
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate max-w-[200px]">
                      {doc.path.split("/").pop()}
                    </span>
                    {doc.isAdminUploaded && (
                      <span className="inline-block bg-[#F68E2D]/20 text-[#F68E2D] px-1.5 py-0.5 rounded text-[8px] uppercase font-bold">
                        Admin Assigned
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-[10px] text-gray-400">
                  <div>
                    <span className="block text-gray-500">Size: {doc.size}</span>
                    <span className="block text-gray-500">Date: {doc.date}</span>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.path, doc.label, doc.id)}
                    disabled={downloadingId === doc.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-[#F68E2D] hover:text-white rounded text-xs transition-colors cursor-pointer text-[#F68E2D] disabled:opacity-50"
                  >
                    <Download className="h-3 w-3" />
                    <span>{downloadingId === doc.id ? "..." : "Download"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
