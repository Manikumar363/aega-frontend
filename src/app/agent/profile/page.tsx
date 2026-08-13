"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  companyAddress?: string;
}

export default function AgentProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "edit">("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyAddress: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Please login first");
          router.push("/login");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        const fullAddr = [data.buildingNumber, data.streetName, data.streetAddress, data.city, data.state, data.postCode]
          .filter(Boolean)
          .join(", ") || data.streetAddress || data.address || "";

        const profileInfo: ProfileData = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || data.mobileNumber || "",
          companyName: data.companyName || fullName || "Company Name",
          companyAddress: fullAddr,
        };

        setUserId(data.id || data._id);
        setProfileData(profileInfo);

        // Load profile image if it exists
        const rawPic = data.profileImage || data.profilePic || data.avatar || data.profilePhoto || (data.user && (data.user.profilePic || data.user.avatar));
        if (rawPic) {
          const baseUrl = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
          const imgUrl = rawPic.startsWith("http") ? rawPic : `${baseUrl}/${rawPic.replace(/^\/+/, "")}`;
          setProfileImage(imgUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, GIF, and WebP images are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setProfileImageFile(file);
        toast.success("Image selected");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setProfileImageFile(null);
    toast.success("Profile image removed");
  };

  const handleSaveProfile = async () => {
    if (!profileData.companyName?.trim()) {
      toast.error("Company Name is required");
      return;
    }
    if (!profileData.phone?.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      let uploadedPicPath = undefined;
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("file", profileImageFile);
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedPicPath = uploadData.filePath || uploadData.url;
        }
      }

      // First and last name update from Company Name if single field
      const nameParts = profileData.companyName.trim().split(" ");
      const firstName = nameParts[0] || profileData.companyName;
      const lastName = nameParts.slice(1).join(" ") || "Agency";

      const payload: any = {
        firstName,
        lastName,
        companyName: profileData.companyName,
        phone: profileData.phone,
        mobileNumber: profileData.phone,
        streetAddress: profileData.companyAddress,
      };

      if (uploadedPicPath !== undefined) {
        payload.profileImage = uploadedPicPath;
      } else if (profileImage === null) {
        payload.profileImage = "";
      }

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setActiveTab("profile");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="agent">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="agent">
      <div className="max-w-4xl mx-auto space-y-6 text-white pb-10">
        {/* Header Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-700 pb-3">
          <button
            onClick={() => setActiveTab("profile")}
            className={`text-lg font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "text-[#F68E2D] border-[#F68E2D]"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`text-lg font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "edit"
                ? "text-[#F68E2D] border-[#F68E2D]"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => router.push("/agent/profile/reset-password")}
            className="text-lg font-semibold pb-2 text-gray-400 hover:text-white border-b-2 border-transparent transition-colors cursor-pointer"
          >
            Reset Password
          </button>
        </div>

        {/* PROFILE VIEW TAB */}
        {activeTab === "profile" && (
          <div className="bg-[#14112E] border border-gray-800 rounded-xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden border-4 border-[#F68E2D]">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profileData.companyName}</h2>
                <p className="text-xs text-[#F68E2D] font-semibold uppercase">{profileData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase mb-1">Company Name</label>
                <div className="bg-[#0A0724] border border-gray-700 rounded-lg p-3 text-white font-medium">
                  {profileData.companyName || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase mb-1">Email ID</label>
                <div className="bg-[#0A0724] border border-gray-700 rounded-lg p-3 text-white font-medium flex items-center justify-between">
                  <span>{profileData.email}</span>
                  <span className="text-emerald-400 text-xs">✓ Verified</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase mb-1">Mobile Number</label>
                <div className="bg-[#0A0724] border border-gray-700 rounded-lg p-3 text-white font-medium">
                  {profileData.phone || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase mb-1">Company Address</label>
                <div className="bg-[#0A0724] border border-gray-700 rounded-lg p-3 text-white font-medium">
                  {profileData.companyAddress || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT PROFILE TAB (SIMPLIFIED TO 5 CORE FIELDS) */}
        {activeTab === "edit" && (
          <div className="bg-[#14112E] border border-gray-800 rounded-xl p-8 space-y-6 shadow-xl">
            {/* 1. Profile Pic Field */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-800">
              <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-4 border-[#F68E2D] shrink-0">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <label
                  htmlFor="profile-upload"
                  className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-4 py-2 rounded-md text-xs cursor-pointer transition-colors"
                >
                  Upload New Picture
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md text-xs transition-colors cursor-pointer"
                >
                  Delete Picture
                </button>
              </div>
            </div>

            {/* 4 Core Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. Company Name */}
              <div>
                <label className="block text-white text-xs font-semibold uppercase mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.companyName}
                  onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                  className="w-full bg-[#0A0724] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D]"
                  placeholder="Enter company name"
                />
              </div>

              {/* 3. Email ID (Read-only) */}
              <div>
                <label className="block text-white text-xs font-semibold uppercase mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full bg-[#0A0724] border border-gray-700 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed outline-none"
                />
              </div>

              {/* 4. Mobile Number */}
              <div>
                <label className="block text-white text-xs font-semibold uppercase mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-[#0A0724] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D]"
                  placeholder="Enter mobile number"
                />
              </div>

              {/* 5. Company Address */}
              <div>
                <label className="block text-white text-xs font-semibold uppercase mb-2">
                  Company Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.companyAddress}
                  onChange={(e) => setProfileData({ ...profileData, companyAddress: e.target.value })}
                  className="w-full bg-[#0A0724] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D]"
                  placeholder="Enter full company address"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end gap-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="px-6 py-2.5 rounded-lg border border-gray-600 text-white/80 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-[#F68E2D] hover:bg-[#e28124] text-white px-8 py-2.5 rounded-lg font-bold text-xs uppercase transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
