"use client";

import { useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

interface EducationInfo {
  school: string;
  board: string;
  percentage: string;
  yearOfPassing: string;
}

interface ExperienceInfo {
  companyName: string;
  role: string;
  emailId: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
}

interface PreferenceInfo {
  region: string;
  country: string;
  collegeName: string;
}

export default function AddStudent({ onClose, onSubmit }: { onClose: () => void; onSubmit?: (data: any) => void }) {
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",

    // Educational Information
    tenthEducation: {
      school: "",
      board: "",
      percentage: "",
      yearOfPassing: "",
    } as EducationInfo,
    twelfthEducation: {
      school: "",
      board: "",
      percentage: "",
      yearOfPassing: "",
    } as EducationInfo,

    // Graduation
    graduationEducation: {
      school: "",
      board: "",
      percentage: "",
      yearOfPassing: "",
    } as EducationInfo,

    // Post Graduation
    postGraduationEducation: {
      school: "",
      board: "",
      percentage: "",
      yearOfPassing: "",
    } as EducationInfo,
  });

  const [experiences, setExperiences] = useState<ExperienceInfo[]>([
    {
      companyName: "",
      role: "",
      emailId: "",
      phoneNumber: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    },
  ]);

  const [preferences, setPreferences] = useState<PreferenceInfo[]>([
    {
      region: "",
      country: "",
      collegeName: "",
    },
  ]);

  const [expandedSections, setExpandedSections] = useState({
    graduation: false,
    postGraduation: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEducationChange = (
    section: "tenthEducation" | "twelfthEducation" | "graduationEducation" | "postGraduationEducation",
    field: keyof EducationInfo,
    value: string
  ) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceInfo, value: string | boolean) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        companyName: "",
        role: "",
        emailId: "",
        phoneNumber: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handlePreferenceChange = (index: number, field: keyof PreferenceInfo, value: string) => {
    const updatedPreferences = [...preferences];
    updatedPreferences[index] = {
      ...updatedPreferences[index],
      [field]: value,
    };
    setPreferences(updatedPreferences);
  };

  const addPreference = () => {
    setPreferences([
      ...preferences,
      {
        region: "",
        country: "",
        collegeName: "",
      },
    ]);
  };

  const removePreference = (index: number) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.emailId.trim()) {
      toast.error("Email ID is required");
      return false;
    }
    if (!formData.mobileNumber.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const completeData = {
        ...formData,
        experiences,
        preferences,
      };

      console.log("Student data:", completeData);

      if (onSubmit) {
        await onSubmit(completeData);
      }

      toast.success("Student added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#F68E2D]">Add Student</h1>
      </div>

      {/* Basic Information */}
      <div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-white/80 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Jane"
              className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Loveros"
              className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm text-white/80 mb-2">Email ID</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
              placeholder="janerios@gmail.com"
              className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="+1 123 0881 6745"
              className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
            />
          </div>
        </div>
      </div>

      {/* Educational Information */}
      <div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Educational Information</h2>

        {/* 10th Information */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-white mb-4 uppercase">10th Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-white/80 mb-2">10th School</label>
              <input
                type="text"
                value={formData.tenthEducation.school}
                onChange={(e) => handleEducationChange("tenthEducation", "school", e.target.value)}
                placeholder="School Name"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">10th Board</label>
              <input
                type="text"
                value={formData.tenthEducation.board}
                onChange={(e) => handleEducationChange("tenthEducation", "board", e.target.value)}
                placeholder="Board Name"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm text-white/80 mb-2">10th Percentage</label>
              <input
                type="text"
                value={formData.tenthEducation.percentage}
                onChange={(e) => handleEducationChange("tenthEducation", "percentage", e.target.value)}
                placeholder="82.33%"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">10th Year of Passing</label>
              <input
                type="text"
                value={formData.tenthEducation.yearOfPassing}
                onChange={(e) => handleEducationChange("tenthEducation", "yearOfPassing", e.target.value)}
                placeholder="2019"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
          </div>
        </div>

        {/* 12th Information */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 uppercase">12th Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-white/80 mb-2">12th School</label>
              <input
                type="text"
                value={formData.twelfthEducation.school}
                onChange={(e) => handleEducationChange("twelfthEducation", "school", e.target.value)}
                placeholder="School Name"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">12th Board</label>
              <input
                type="text"
                value={formData.twelfthEducation.board}
                onChange={(e) => handleEducationChange("twelfthEducation", "board", e.target.value)}
                placeholder="Board Name"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm text-white/80 mb-2">12th Percentage</label>
              <input
                type="text"
                value={formData.twelfthEducation.percentage}
                onChange={(e) => handleEducationChange("twelfthEducation", "percentage", e.target.value)}
                placeholder="82.33%"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">12th Year of Passing</label>
              <input
                type="text"
                value={formData.twelfthEducation.yearOfPassing}
                onChange={(e) => handleEducationChange("twelfthEducation", "yearOfPassing", e.target.value)}
                placeholder="2019"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
          </div>
        </div>

        {/* Graduation Information */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <button
            type="button"
            onClick={() => setExpandedSections({ ...expandedSections, graduation: !expandedSections.graduation })}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-sm font-bold text-white uppercase">Graduation Information</h3>
            <ChevronDown
              className={`w-5 h-5 text-[#F68E2D] transform transition-transform ${
                expandedSections.graduation ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.graduation && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2">Graduation School/College</label>
                  <input
                    type="text"
                    value={formData.graduationEducation.school}
                    onChange={(e) => handleEducationChange("graduationEducation", "school", e.target.value)}
                    placeholder="School Name"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Stream/Specialization</label>
                  <input
                    type="text"
                    value={formData.graduationEducation.board}
                    onChange={(e) => handleEducationChange("graduationEducation", "board", e.target.value)}
                    placeholder="Stream"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2">CGPA/Percentage</label>
                  <input
                    type="text"
                    value={formData.graduationEducation.percentage}
                    onChange={(e) => handleEducationChange("graduationEducation", "percentage", e.target.value)}
                    placeholder="82.33%"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Year of Passing</label>
                  <input
                    type="text"
                    value={formData.graduationEducation.yearOfPassing}
                    onChange={(e) => handleEducationChange("graduationEducation", "yearOfPassing", e.target.value)}
                    placeholder="2022"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Post Graduation Information */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <button
            type="button"
            onClick={() => setExpandedSections({ ...expandedSections, postGraduation: !expandedSections.postGraduation })}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-sm font-bold text-white uppercase">Post Graduation Information</h3>
            <ChevronDown
              className={`w-5 h-5 text-[#F68E2D] transform transition-transform ${
                expandedSections.postGraduation ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.postGraduation && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2">Post Graduation School/College</label>
                  <input
                    type="text"
                    value={formData.postGraduationEducation.school}
                    onChange={(e) => handleEducationChange("postGraduationEducation", "school", e.target.value)}
                    placeholder="School Name"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Stream/Specialization</label>
                  <input
                    type="text"
                    value={formData.postGraduationEducation.board}
                    onChange={(e) => handleEducationChange("postGraduationEducation", "board", e.target.value)}
                    placeholder="Stream"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2">CGPA/Percentage</label>
                  <input
                    type="text"
                    value={formData.postGraduationEducation.percentage}
                    onChange={(e) => handleEducationChange("postGraduationEducation", "percentage", e.target.value)}
                    placeholder="82.33%"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Year of Passing</label>
                  <input
                    type="text"
                    value={formData.postGraduationEducation.yearOfPassing}
                    onChange={(e) => handleEducationChange("postGraduationEducation", "yearOfPassing", e.target.value)}
                    placeholder="2024"
                    className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employment Information */}
      <div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Employment Information</h2>
        </div>

        {experiences.map((experience, index) => (
          <div key={index} className="mb-8 pb-8 border-b border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white uppercase">Experience {index + 1}</h3>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-white/80 mb-2">Company Name</label>
                <input
                  type="text"
                  value={experience.companyName}
                  onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
                  placeholder="XYZ"
                  className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">Role</label>
                <input
                  type="text"
                  value={experience.role}
                  onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                  placeholder="Designer"
                  className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm text-white/80 mb-2">Email ID</label>
                <input
                  type="email"
                  value={experience.emailId}
                  onChange={(e) => handleExperienceChange(index, "emailId", e.target.value)}
                  placeholder="janerios@gmail.com"
                  className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={experience.phoneNumber}
                  onChange={(e) => handleExperienceChange(index, "phoneNumber", e.target.value)}
                  placeholder="+1 123 0881 6745"
                  className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm text-white/80 mb-2">Start Date</label>
                <input
                  type="text"
                  value={experience.startDate}
                  onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                  placeholder="2024"
                  className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">End Date</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={experience.endDate}
                    onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                    placeholder="2025"
                    className="flex-1 bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                  />
                  <label className="text-sm text-white/80 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={experience.currentlyWorking}
                      onChange={(e) => handleExperienceChange(index, "currentlyWorking", e.target.checked)}
                      className="w-4 h-4"
                    />
                    Currently Working
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 text-[#F68E2D] hover:text-[#e57d1f] font-medium mt-6"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {/* Preferred Region and College */}
      <div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Preferred Region and College</h2>
        </div>

        {preferences.map((preference, index) => (
          <div key={index} className="mb-8 pb-8 border-b border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white uppercase">Preference {index + 1}</h3>
              {preferences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePreference(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-white/80 mb-2">Region</label>
                <input
                  type="text"
                  value={preference.region}
                  onChange={(e) => handlePreferenceChange(index, "region", e.target.value)}
                  placeholder="XYZ"
                  className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">Country</label>
                <input
                  type="text"
                  value={preference.country}
                  onChange={(e) => handlePreferenceChange(index, "country", e.target.value)}
                  placeholder="Designer"
                  className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-white/80 mb-2">College Name</label>
              <input
                type="text"
                value={preference.collegeName}
                onChange={(e) => handlePreferenceChange(index, "collegeName", e.target.value)}
                placeholder="Name"
                className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addPreference}
          className="flex items-center gap-2 text-[#F68E2D] hover:text-[#e57d1f] font-medium mt-6"
        >
          <Plus className="w-5 h-5" />
          Add Preference
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center md:justify-start">
        <button
          type="button"
          onClick={onClose}
          className="px-12 py-3 border border-gray-600 text-white rounded font-medium hover:bg-gray-700 transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-12 py-3 bg-[#F68E2D] hover:bg-[#e57d1f] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Add Student"}
        </button>
      </div>
    </form>
  );
}
