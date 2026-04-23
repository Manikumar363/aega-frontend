// src/lib/api/fileService.ts

// Get API base URL from environment - this should be: https://aega-backend.onrender.com
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UploadResponse {
  success: boolean;
  files: Array<{
    key: string; // Used for signup request (e.g., "uploads/uuid_filename.pdf")
    url: string; // Relative URL for display (e.g., "/uploads/uuid_filename.pdf")
  }>;
}

/**
 * Uploads a file to the server
 * Endpoint: {API_BASE_URL}/api/upload/public
 * @param file - The file to upload
 * @returns The file key to be used in signup request
 */
export async function uploadFile(file: File): Promise<string> {
  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please add NEXT_PUBLIC_API_BASE_URL to your environment variables."
    );
  }

  // Validate file
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file provided");
  }

  const formData = new FormData();
  formData.append("file", file);

  // Construct full upload URL using the base URL from env
  const uploadUrl = `${API_BASE_URL}/api/upload/public`;

  console.log("📤 Uploading file:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadUrl: uploadUrl,
  });

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      // Note: Do NOT set Content-Type header; browser will set it with boundary for multipart
    });

    console.log("📡 Upload response status:", response.status);
    console.log("📡 Response headers:", {
      contentType: response.headers.get("content-type"),
    });

    if (!response.ok) {
      let errorMessage = `File upload failed with status ${response.status}`;
      try {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        errorMessage = errorText || errorMessage;
      } catch (e) {
        console.error("Error reading response:", e);
      }
      throw new Error(errorMessage);
    }

    // Get response text first for debugging
    const responseText = await response.text();
    console.log("📡 Raw response text:", responseText);

    let data: UploadResponse;
    try {
      data = JSON.parse(responseText) as UploadResponse;
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response:", parseError);
      throw new Error(
        `Invalid response format from server. Expected JSON but got: ${responseText.substring(0, 100)}`
      );
    }

    console.log("✅ Upload response data:", data);

    if (!data.success || !data.files || data.files.length === 0) {
      throw new Error("No file returned from server. Response: " + JSON.stringify(data));
    }

    // Return the key to be used in signup request
    // The key is what backend expects: "uploads/uuid_filename.pdf"
    const fileKey = data.files[0].key;
    console.log("✅ File uploaded successfully with key:", fileKey);
    return fileKey;
  } catch (error) {
    console.error("🔴 File upload error:", error);
    
    if (error instanceof TypeError) {
      // TypeError usually means network error or CORS issue
      throw new Error(
        `Network error: Failed to reach ${uploadUrl}. Make sure the backend is running and CORS is configured correctly.`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during file upload");
  }
}

/**
 * Uploads multiple files
 * @param files - Array of files to upload
 * @returns Array of file keys for signup request
 */
export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadFile(file));
    const fileKeys = await Promise.all(uploadPromises);
    return fileKeys;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An error occurred while uploading files");
  }
}

/**
 * Constructs full URL for displaying uploaded files
 * @param fileUrl - Relative URL from upload response (e.g., "/uploads/uuid_filename.pdf")
 * @returns Full URL with Antryk base URL
 */
export function getFileDisplayUrl(fileUrl: string): string {
  const ANTRYK_BASE_URL = process.env.NEXT_PUBLIC_ANTRYK_BASE_URL;

  if (!ANTRYK_BASE_URL) {
    console.warn(
      "ANTRYK_BASE_URL is not configured. Using relative URL:",
      fileUrl
    );
    return fileUrl;
  }

  // Remove leading slash if present
  const cleanUrl = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
  return `${ANTRYK_BASE_URL}/${cleanUrl}`;
}
