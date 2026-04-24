"use client";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/api/fileService";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  dateOfBirth?: string;
  buildingNumber?: string;
  streetName?: string;
  streetAddress?: string;
  state?: string;
  city?: string;
  postCode?: string;
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
    dateOfBirth: "",
    buildingNumber: "",
    streetName: "",
    streetAddress: "",
    state: "",
    city: "",
    postCode: "",
  });

  const [originalData, setOriginalData] = useState<ProfileData>(profileData);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
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
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Profile data:", data);

        const profileInfo: ProfileData = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          companyName: data.companyName || "",
          dateOfBirth: data.dateOfBirth || "",
          buildingNumber: data.buildingNumber || "",
          streetName: data.streetName || "",
          streetAddress: data.streetAddress || "",
          state: data.state || "",
          city: data.city || "",
          postCode: data.postCode || "",
        };

        setUserId(data.id);
        setProfileData(profileInfo);
        setOriginalData(profileInfo);

        // Load profile image if it exists
        if (data.profileImage) {
          setProfileImage(`${process.env.NEXT_PUBLIC_ANTRYK_BASE_URL}/${data.profileImage}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
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
    toast.success("Image removed");
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    // Validate required fields
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      let profileImagePath = null;

      // Upload profile image if changed
      if (profileImageFile) {
        try {
          toast.loading("Uploading profile image...");
          profileImagePath = await uploadFile(profileImageFile);
          toast.dismiss();
          console.log("Profile image uploaded:", profileImagePath);
        } catch (error) {
          toast.dismiss();
          toast.error("Failed to upload profile image");
          setIsSaving(false);
          return;
        }
      }

      // Prepare update data
      const updateData = {
        ...profileData,
        ...(profileImagePath && { profileImage: profileImagePath }),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      console.log("Profile updated:", updatedProfile);

      setOriginalData(profileData);
      setProfileImageFile(null);
      toast.success("Profile updated successfully!");
      setActiveTab("profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setProfileData(originalData);
    setProfileImage(null);
    setProfileImageFile(null);
    toast.success("Changes discarded");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted."
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/me/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      toast.success("Account deleted successfully");
      localStorage.removeItem("authToken");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="agent">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-lg">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-2 text-base font-medium transition-colors ${
              activeTab === "profile"
                ? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`pb-2 text-base font-medium transition-colors ${
              activeTab === "edit"
                ? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => router.push("/agent/profile/documents")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Documents
          </button>
          <button
            onClick={() => router.push("/agent/profile/reset-password")}
            className="pb-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Reset Password
          </button>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden border-4 border-[#F68E2D]">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* View-Only Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm mb-2">First Name</label>
                <div className="bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white">
                  {profileData.firstName}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Last Name</label>
                <div className="bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white">
                  {profileData.lastName}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Email</label>
                <div className="bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white">
                  {profileData.email}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Phone</label>
                <div className="bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white">
                  {profileData.phone || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Company Name
                </label>
                <div className="bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white">
                  {profileData.companyName || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Date of Birth
                </label>
                <div className="bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white">
                  {profileData.dateOfBirth || "N/A"}
                </div>
              </div>
            </div>

            {(profileData.buildingNumber ||
              profileData.streetName ||
              profileData.streetAddress ||
              profileData.state ||
              profileData.city ||
              profileData.postCode) && (
              <div>
                <label className="block text-white text-sm mb-2">
                  Address
                </label>
                <div className="bg-[#14112E] border border-gray-700 rounded-md p-4 text-white text-sm leading-relaxed">
                  {profileData.buildingNumber && (
                    <p>Building Number: {profileData.buildingNumber}</p>
                  )}
                  {profileData.streetName && (
                    <p>Street Name: {profileData.streetName}</p>
                  )}
                  {profileData.streetAddress && (
                    <p>Street Address: {profileData.streetAddress}</p>
                  )}
                  {(profileData.state ||
                    profileData.city ||
                    profileData.postCode) && (
                    <p>
                      {profileData.state && `State: ${profileData.state}`}
                      {profileData.state && profileData.city && ", "}
                      {profileData.city && `City: ${profileData.city}`}
                    </p>
                  )}
                  {profileData.postCode && (
                    <p>Post Code: {profileData.postCode}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Tab Content */}
        {activeTab === "edit" && (
          <div className="space-y-6">
            {/* Profile Image with Upload/Delete */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden border-4 border-[#F68E2D]">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <label
                  htmlFor="profile-upload"
                  className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer transition-colors"
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
                  onClick={handleDeleteImage}
                  className="bg-[#E03137] hover:bg-[#c41e24] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Picture
                </button>
              </div>
            </div>

            {/* Editable Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, firstName: e.target.value })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.companyName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, companyName: e.target.value })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.dateOfBirth}
                  onChange={(e) =>
                    setProfileData({ ...profileData, dateOfBirth: e.target.value })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Building Number"
                  value={profileData.buildingNumber}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      buildingNumber: e.target.value,
                    })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
                <input
                  type="text"
                  placeholder="Street Name"
                  value={profileData.streetName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      streetName: e.target.value,
                    })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={profileData.streetAddress}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      streetAddress: e.target.value,
                    })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={profileData.state}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      state: e.target.value,
                    })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={profileData.city}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      city: e.target.value,
                    })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
                <input
                  type="text"
                  placeholder="Post Code"
                  value={profileData.postCode}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      postCode: e.target.value,
                    })
                  }
                  className="w-full bg-[#14112E] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#F68E2D] focus:ring-1 focus:ring-[#F68E2D]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="bg-transparent hover:bg-gray-800 border border-gray-600 text-white px-12 py-3 rounded-md text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-12 py-3 rounded-md text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Details"}
              </button>
            </div>

            {/* Delete Account Section */}
            <div className="bg-[#14112E] border border-gray-800 rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold text-[#F68E2D] mb-4">
                DELETE ACCOUNT !!
              </h2>
              <p className="text-white mb-2">We're sorry to see you go.,</p>
              <ul className="text-white text-sm space-y-1 list-disc list-inside mb-6">
                <li>
                  If you'd like to reduce your email notifications, you can disable them here or if you just want to change your username, you can do that here.
                </li>
                <li>
                  Be advised, account deletion is final. There will be no way to restore your account.
                </li>
              </ul>
              <div className="flex justify-end gap-4">
                <button className="bg-white hover:bg-gray-100 text-gray-700 px-8 py-2.5 rounded-md text-sm transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-[#E03137] hover:bg-[#c41e24] text-white px-8 py-2.5 rounded-md text-sm transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
