"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/api/fileService";

interface SupportingDocument {
  label: string;
  path: string;
}

interface DocumentWithDetails extends SupportingDocument {
  id: number;
  date: string;
  size: string;
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

  // Fetch documents from profile API
  useEffect(() => {
    fetchDocuments();
  }, [router]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login first");
        router.push("/agent/login");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      
      // Transform supportingDocuments to include details
      const docs: DocumentWithDetails[] = (data.supportingDocuments || []).map(
        (doc: SupportingDocument, index: number) => ({
          ...doc,
          id: index + 1,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          size: "Unknown",
        })
      );

      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load documents"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (docPath: string, docLabel: string, docId: number) => {
    setDownloadingId(docId);
    try {
      const fullUrl = `${process.env.NEXT_PUBLIC_ANTRYK_BASE_URL}/${docPath}`;
      
      // Fetch the file
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      // Get the file blob
      const blob = await response.blob();

      // Create blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      
      // Get file extension from path or use default
      const fileName = docLabel || "document";
      const hasExtension = fileName.includes(".");
      const fileExtension = docPath.split(".").pop() || "pdf";
      a.download = hasExtension ? fileName : `${fileName}.${fileExtension}`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success(`${docLabel} downloaded successfully!`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to download document"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    setSelectedFile(file);
  };

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!documentName.trim()) {
      toast.error("Document name is required");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login first");
        router.push("/agent/login");
        return;
      }

      // Upload file using the same uploadFile function from signup
      const fileKey = await uploadFile(selectedFile);

      // Call POST /api/profile/documents with the uploaded file path
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            documentName: documentName,
            fileUrl: fileKey,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save document");
      }

      toast.success("Document uploaded successfully!");
      
      // Reset form
      setDocumentName("");
      setSelectedFile(null);
      setShowUploadModal(false);

      // Refresh documents list
      await fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload document"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isUploading) {
      setShowUploadModal(false);
      setDocumentName("");
      setSelectedFile(null);
    }
  };

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 border-b border-gray-700">
          <button
            onClick={() => router.push("/agent/profile")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => router.push("/agent/profile")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Edit Profile
          </button>
          <button className="pb-2 text-base font-medium text-[#F68E2D] border-b-2 border-[#F68E2D] transition-colors">
            Documents
          </button>
          <button
            onClick={() => router.push("/agent/profile/reset-password")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Reset Password
          </button>
        </div>

        {/* Upload Document Button */}
        <div className="flex justify-between">
            <h1 className="text-white font-medium text-3xl ">My Documents</h1>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2.5 rounded-md flex items-center gap-2 text-sm transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload Document
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading documents...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && documents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No documents available</p>
          </div>
        )}

        {/* Documents Grid */}
        {!isLoading && documents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#14112E] border border-gray-800 rounded-lg p-6"
            >
              {/* Document Header */}
              <div className="flex items-start gap-3 mb-4">
                <svg
                  className="w-6 h-6 text-[#F68E2D] shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-[#F68E2D] text-lg font-medium">
                  {doc.label}
                </h3>
              </div>

              {/* Document Info */}
              <p className="text-white text-sm mb-4">
                {doc.date} • {doc.size}
              </p>

              {/* Action Button */}
              <button 
                onClick={() => handleDownload(doc.path, doc.label, doc.id)}
                disabled={downloadingId === doc.id}
                className="w-full bg-[#0A0820] hover:bg-[#160F3A] border border-gray-700 text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`w-4 h-4 ${downloadingId === doc.id ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {downloadingId === doc.id ? "Downloading..." : "Download Document"}
              </button>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-100">
          <div className="bg-[#14112E] border border-gray-700 rounded-lg p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              disabled={isUploading}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-white text-2xl font-bold mb-6 pr-8">Upload Document</h2>

            {/* Document Name Input */}
            <div className="mb-6">
              <label className="block text-white text-sm mb-2">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g., Passport, License"
                disabled={isUploading}
                className="w-full bg-[#0A0820] border border-gray-700 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D] disabled:opacity-50"
              />
            </div>

            {/* File Upload Input */}
            <div className="mb-6">
              <label className="block text-white text-sm mb-2">
                Select File <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="block w-full bg-[#0A0820] border border-gray-700 rounded-md px-4 py-3 text-gray-400 cursor-pointer hover:border-[#F68E2D] transition-colors disabled:opacity-50"
                >
                  {selectedFile ? (
                    <span className="text-white">{selectedFile.name}</span>
                  ) : (
                    <span>Choose file (PDF, JPG, PNG - Max 10MB)</span>
                  )}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCloseModal}
                disabled={isUploading}
                className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-3 rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDocument}
                disabled={isUploading}
                className="flex-1 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
