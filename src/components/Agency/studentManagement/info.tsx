"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Eye, ChevronDown } from "lucide-react";
import Preferences from "./preferences";
import toast from "react-hot-toast";

type StudentInfoProps = {
	studentId: string;
	onClose?: () => void;
};

type InfoRow = {
	label: string;
	value: string;
};

type University = {
	id: number;
	region: string;
	country: string;
	universityName: string;
	location?: string;
	courseName?: string;
	intake?: string;
	eligibility?: string;
	applicationStatus?: string;
	startDate?: string;
	endDate?: string;
	tuitionFee?: string;
	termFee?: string;
};

const InfoSection = ({ title, rows }: { title: string; rows: InfoRow[] }) => {
	return (
		<section className="border border-[#2D2A50] bg-[#0F0D2B]">
			<h3 className="px-5 pt-5 pb-2 text-white text-lg sm:text-xl font-semibold uppercase tracking-wide">
				{title}
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-5 px-5 pb-6">
				{rows.map((item) => (
					<div key={`${title}-${item.label}`} className="flex items-center gap-3">
						<span className="text-white/85 text-sm sm:text-base font-medium min-w-[150px]">
							{item.label} :
						</span>
						<span className="text-white text-sm sm:text-base">{item.value}</span>
					</div>
				))}
			</div>
		</section>
	);
};

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

type StudentApiResponse = {
	_id: string;
	firstName: string;
	lastName: string;
	emailId: string;
	mobileNumber: string;
	tenthInformation: Array<{
		schoolOrCollege: string;
		boardOrUniversity: string;
		streamOrSpecialization: string;
		cgpaOrPercentage: string;
		yearOfPassing: string;
	}>;
	twelfthInformation: Array<{
		schoolOrCollege: string;
		boardOrUniversity: string;
		streamOrSpecialization: string;
		cgpaOrPercentage: string;
		yearOfPassing: string;
	}>;
	graduationInformation: Array<{
		schoolOrCollege: string;
		boardOrUniversity: string;
		streamOrSpecialization: string;
		cgpaOrPercentage: string;
		yearOfPassing: string;
	}>;
	postGraduationInformation: Array<{
		schoolOrCollege: string;
		boardOrUniversity: string;
		streamOrSpecialization: string;
		cgpaOrPercentage: string;
		yearOfPassing: string;
	}>;
	employmentInformation: Array<{
		companyName: string;
		role: string;
		emailId: string;
		phoneNumber: string;
		startDate: string;
		endDate: string;
		currentlyWorkingHere: boolean;
	}>;
	preferredRegionAndCollege: Array<{
		region: string;
		country: string;
		collegeName: string;
	}>;
	agentId?: {
		firstName: string;
		lastName: string;
	};
};

const StudentInfo: React.FC<StudentInfoProps> = ({ studentId, onClose }) => {
	const [studentData, setStudentData] = useState<StudentApiResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"info" | "preference">("info");
	const [isEditMode, setIsEditMode] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);
	const [universities, setUniversities] = useState<University[]>([]);
	const [universityForm, setUniversityForm] = useState({
		universityName: "",
		courseName: "",
		region: "",
		country: "",
		location: "",
		eligibilityStatus: "Eligible" as "Hostile" | "Eligible" | "None",
		applicationStatus: "On-Going" as "On-Going" | "Conditional Offer" | "Accepted" | "Rejected",
		intakeDate: "",
		startDate: "",
		endDate: "",
		tuitionFee: "",
		firstTermFee: "",
		logoUrl: "",
		universityEmail: "",
	});
	const [expandedSections, setExpandedSections] = useState({
		graduation: false,
		postGraduation: false,
	});

	// Edit form state
	const [editFormData, setEditFormData] = useState({
		firstName: "",
		lastName: "",
		emailId: "",
		mobileNumber: "",
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
		graduationEducation: {
			school: "",
			board: "",
			percentage: "",
			yearOfPassing: "",
		} as EducationInfo,
		postGraduationEducation: {
			school: "",
			board: "",
			percentage: "",
			yearOfPassing: "",
		} as EducationInfo,
	});

	const [editExperiences, setEditExperiences] = useState<ExperienceInfo[]>([]);
	const [editPreferences, setEditPreferences] = useState<PreferenceInfo[]>([]);

	// Fetch student data on mount
	useEffect(() => {
		const fetchStudent = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("authToken");
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch student");
				}

				const data: StudentApiResponse = await response.json();
				setStudentData(data);

				// Transform API data to form structure for edit mode
				transformDataToFormStructure(data);
			} catch (error) {
				console.error("Error fetching student:", error);
				toast.error("Failed to load student data");
			} finally {
				setLoading(false);
			}
		};

		fetchStudent();
	}, [studentId]);

	const transformDataToFormStructure = (data: StudentApiResponse) => {
		const tenth = data.tenthInformation?.[0];
		const twelfth = data.twelfthInformation?.[0];
		const graduation = data.graduationInformation?.[0];
		const postGrad = data.postGraduationInformation?.[0];

		setEditFormData({
			firstName: data.firstName,
			lastName: data.lastName,
			emailId: data.emailId,
			mobileNumber: data.mobileNumber,
			tenthEducation: {
				school: tenth?.schoolOrCollege || "",
				board: tenth?.boardOrUniversity || "",
				percentage: tenth?.cgpaOrPercentage || "",
				yearOfPassing: tenth?.yearOfPassing || "",
			},
			twelfthEducation: {
				school: twelfth?.schoolOrCollege || "",
				board: twelfth?.boardOrUniversity || "",
				percentage: twelfth?.cgpaOrPercentage || "",
				yearOfPassing: twelfth?.yearOfPassing || "",
			},
			graduationEducation: {
				school: graduation?.schoolOrCollege || "",
				board: graduation?.streamOrSpecialization || "",
				percentage: graduation?.cgpaOrPercentage || "",
				yearOfPassing: graduation?.yearOfPassing || "",
			},
			postGraduationEducation: {
				school: postGrad?.schoolOrCollege || "",
				board: postGrad?.streamOrSpecialization || "",
				percentage: postGrad?.cgpaOrPercentage || "",
				yearOfPassing: postGrad?.yearOfPassing || "",
			},
		});

		const experiences = data.employmentInformation?.map(emp => ({
			companyName: emp.companyName,
			role: emp.role,
			emailId: emp.emailId,
			phoneNumber: emp.phoneNumber,
			startDate: emp.startDate,
			endDate: emp.endDate,
			currentlyWorking: emp.currentlyWorkingHere,
		})) || [];

		setEditExperiences(experiences.length > 0 ? experiences : [
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

		const prefs = data.preferredRegionAndCollege?.map(pref => ({
			region: pref.region,
			country: pref.country,
			collegeName: pref.collegeName,
		})) || [];

		setEditPreferences(prefs.length > 0 ? prefs : [
			{
				region: "",
				country: "",
				collegeName: "",
			},
		]);
	};

	const transformDataForAPI = () => {
		const graduationInformation = editFormData.graduationEducation.school || editFormData.graduationEducation.board || editFormData.graduationEducation.percentage || editFormData.graduationEducation.yearOfPassing
			? [{
				schoolOrCollege: editFormData.graduationEducation.school,
				boardOrUniversity: "",
				streamOrSpecialization: editFormData.graduationEducation.board,
				cgpaOrPercentage: editFormData.graduationEducation.percentage,
				yearOfPassing: editFormData.graduationEducation.yearOfPassing,
			}]
			: [];

		const postGraduationInformation = editFormData.postGraduationEducation.school || editFormData.postGraduationEducation.board || editFormData.postGraduationEducation.percentage || editFormData.postGraduationEducation.yearOfPassing
			? [{
				schoolOrCollege: editFormData.postGraduationEducation.school,
				boardOrUniversity: "",
				streamOrSpecialization: editFormData.postGraduationEducation.board,
				cgpaOrPercentage: editFormData.postGraduationEducation.percentage,
				yearOfPassing: editFormData.postGraduationEducation.yearOfPassing,
			}]
			: [];

		const tenthInformation = editFormData.tenthEducation.school || editFormData.tenthEducation.board || editFormData.tenthEducation.percentage || editFormData.tenthEducation.yearOfPassing
			? [{
				schoolOrCollege: editFormData.tenthEducation.school,
				boardOrUniversity: editFormData.tenthEducation.board,
				streamOrSpecialization: "",
				cgpaOrPercentage: editFormData.tenthEducation.percentage,
				yearOfPassing: editFormData.tenthEducation.yearOfPassing,
			}]
			: [];

		const twelfthInformation = editFormData.twelfthEducation.school || editFormData.twelfthEducation.board || editFormData.twelfthEducation.percentage || editFormData.twelfthEducation.yearOfPassing
			? [{
				schoolOrCollege: editFormData.twelfthEducation.school,
				boardOrUniversity: editFormData.twelfthEducation.board,
				streamOrSpecialization: "",
				cgpaOrPercentage: editFormData.twelfthEducation.percentage,
				yearOfPassing: editFormData.twelfthEducation.yearOfPassing,
			}]
			: [];

		const employmentInformation = editExperiences
			.filter(exp => exp.companyName || exp.role || exp.emailId || exp.phoneNumber)
			.map(exp => ({
				companyName: exp.companyName,
				role: exp.role,
				emailId: exp.emailId,
				phoneNumber: exp.phoneNumber,
				startDate: exp.startDate,
				endDate: exp.endDate,
				currentlyWorkingHere: exp.currentlyWorking,
			}));

		const preferredRegionAndCollege = editPreferences
			.filter(pref => pref.region || pref.country || pref.collegeName)
			.map(pref => ({
				region: pref.region,
				country: pref.country,
				collegeName: pref.collegeName,
			}));

		return {
			firstName: editFormData.firstName,
			lastName: editFormData.lastName,
			emailId: editFormData.emailId,
			mobileNumber: editFormData.mobileNumber,
			tenthInformation,
			twelfthInformation,
			graduationInformation,
			postGraduationInformation,
			employmentInformation,
			preferredRegionAndCollege,
		};
	};

	const handleSaveChanges = async () => {
		if (!editFormData.firstName.trim()) {
			toast.error("First name is required");
			return;
		}
		if (!editFormData.lastName.trim()) {
			toast.error("Last name is required");
			return;
		}
		if (!editFormData.emailId.trim()) {
			toast.error("Email ID is required");
			return;
		}
		if (!editFormData.mobileNumber.trim()) {
			toast.error("Mobile number is required");
			return;
		}

		setIsSaving(true);
		try {
			const apiData = transformDataForAPI();
			const token = localStorage.getItem("authToken");

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(apiData),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to update student");
			}

			const result = await response.json();
			setStudentData(result.student);
			setIsEditMode(false);
			toast.success("Student updated successfully!");
		} catch (error) {
			console.error("Error updating student:", error);
			toast.error(error instanceof Error ? error.message : "Failed to update student");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDiscardChanges = () => {
		if (studentData) {
			transformDataToFormStructure(studentData);
		}
		setIsEditMode(false);
	};

	const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditFormData({ ...editFormData, [name]: value });
	};

	const handleEducationChange = (
		section: "tenthEducation" | "twelfthEducation" | "graduationEducation" | "postGraduationEducation",
		field: keyof EducationInfo,
		value: string
	) => {
		setEditFormData({
			...editFormData,
			[section]: {
				...editFormData[section],
				[field]: value,
			},
		});
	};

	const handleExperienceChange = (index: number, field: keyof ExperienceInfo, value: string | boolean) => {
		const updatedExperiences = [...editExperiences];
		updatedExperiences[index] = {
			...updatedExperiences[index],
			[field]: value,
		};
		setEditExperiences(updatedExperiences);
	};

	const addExperience = () => {
		setEditExperiences([
			...editExperiences,
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
		setEditExperiences(editExperiences.filter((_, i) => i !== index));
	};

	const handlePreferenceChange = (index: number, field: keyof PreferenceInfo, value: string) => {
		const updatedPreferences = [...editPreferences];
		updatedPreferences[index] = {
			...updatedPreferences[index],
			[field]: value,
		};
		setEditPreferences(updatedPreferences);
	};

	const addPreference = () => {
		setEditPreferences([
			...editPreferences,
			{
				region: "",
				country: "",
				collegeName: "",
			},
		]);
	};

	const removePreference = (index: number) => {
		setEditPreferences(editPreferences.filter((_, i) => i !== index));
	};

	const handleUniversityFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUniversityForm({ ...universityForm, [name]: value });
	};

	const handleAddUniversity = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!universityForm.universityName.trim()) {
			toast.error("University name is required");
			return;
		}
		if (!universityForm.courseName.trim()) {
			toast.error("Course name is required");
			return;
		}
		if (!universityForm.region.trim()) {
			toast.error("Region is required");
			return;
		}
		if (!universityForm.country.trim()) {
			toast.error("Country is required");
			return;
		}

		setIsSubmitting(true);
		try {
			const token = localStorage.getItem("authToken");
			const payload = {
				universityName: universityForm.universityName,
				courseName: universityForm.courseName,
				region: universityForm.region,
				country: universityForm.country,
				location: universityForm.location || universityForm.region,
				eligibilityStatus: universityForm.eligibilityStatus,
				applicationStatus: universityForm.applicationStatus,
				intakeDate: universityForm.intakeDate,
				startDate: universityForm.startDate,
				endDate: universityForm.endDate,
				tuitionFee: universityForm.tuitionFee,
				firstTermFee: universityForm.firstTermFee,
				logoUrl: universityForm.logoUrl,
				universityEmail: universityForm.universityEmail,
			};

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}/preferences`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to add university preference");
			}

			const result = await response.json();

			// Transform API response to local University format for display
			const newUniversity: University = {
				id: Date.now(),
				region: result.preference.region,
				country: result.preference.country,
				universityName: result.preference.universityName,
				location: result.preference.location,
				courseName: result.preference.courseName,
				intake: result.preference.intakeDate,
				eligibility: result.preference.eligibilityStatus,
				applicationStatus: result.preference.applicationStatus,
				startDate: result.preference.startDate,
				endDate: result.preference.endDate,
				tuitionFee: result.preference.tuitionFee,
				termFee: result.preference.firstTermFee,
			};

			setUniversities([...universities, newUniversity]);
			setUniversityForm({
				universityName: "",
				courseName: "",
				region: "",
				country: "",
				location: "",
				eligibilityStatus: "Eligible",
				applicationStatus: "On-Going",
				intakeDate: "",
				startDate: "",
				endDate: "",
				tuitionFee: "",
				firstTermFee: "",
				logoUrl: "",
				universityEmail: "",
			});
			setShowAddUniversityModal(false);
			toast.success("University preference added successfully!");
		} catch (error) {
			console.error("Error adding university:", error);
			toast.error(error instanceof Error ? error.message : "Failed to add university preference");
		} finally {
			setIsSubmitting(false);
		}
	};

	const removeUniversity = (id: number) => {
		setUniversities(universities.filter((uni) => uni.id !== id));
		toast.success("University removed");
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-white text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D]"></div>
					<p className="mt-4">Loading student data...</p>
				</div>
			</div>
		);
	}

	if (!studentData) {
		return (
			<div className="text-white text-center py-8">
				<p>Failed to load student data</p>
			</div>
		);
	}

	if (isEditMode) {
		return (
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-[#F68E2D]">Edit Student</h1>
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
								value={editFormData.firstName}
								onChange={handleEditFormChange}
								placeholder="Jane"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Last Name</label>
							<input
								type="text"
								name="lastName"
								value={editFormData.lastName}
								onChange={handleEditFormChange}
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
								value={editFormData.emailId}
								onChange={handleEditFormChange}
								placeholder="janerios@gmail.com"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Mobile Number</label>
							<input
								type="text"
								name="mobileNumber"
								value={editFormData.mobileNumber}
								onChange={handleEditFormChange}
								placeholder="+1 123 589 6740"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
					</div>
				</div>

				{/* 10th Education */}
				<div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
					<h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">10th Educational Information</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm text-white/80 mb-2">School/College</label>
							<input
								type="text"
								value={editFormData.tenthEducation.school}
								onChange={(e) => handleEducationChange("tenthEducation", "school", e.target.value)}
								placeholder="School Name"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Board</label>
							<input
								type="text"
								value={editFormData.tenthEducation.board}
								onChange={(e) => handleEducationChange("tenthEducation", "board", e.target.value)}
								placeholder="Board Name"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Percentage/CGPA</label>
							<input
								type="text"
								value={editFormData.tenthEducation.percentage}
								onChange={(e) => handleEducationChange("tenthEducation", "percentage", e.target.value)}
								placeholder="88%"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Year of Passing</label>
							<input
								type="text"
								value={editFormData.tenthEducation.yearOfPassing}
								onChange={(e) => handleEducationChange("tenthEducation", "yearOfPassing", e.target.value)}
								placeholder="2019"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
					</div>
				</div>

				{/* 12th Education */}
				<div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
					<h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">12th Educational Information</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm text-white/80 mb-2">School/College</label>
							<input
								type="text"
								value={editFormData.twelfthEducation.school}
								onChange={(e) => handleEducationChange("twelfthEducation", "school", e.target.value)}
								placeholder="School Name"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Board</label>
							<input
								type="text"
								value={editFormData.twelfthEducation.board}
								onChange={(e) => handleEducationChange("twelfthEducation", "board", e.target.value)}
								placeholder="Board Name"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Percentage/CGPA</label>
							<input
								type="text"
								value={editFormData.twelfthEducation.percentage}
								onChange={(e) => handleEducationChange("twelfthEducation", "percentage", e.target.value)}
								placeholder="88%"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block text-sm text-white/80 mb-2">Year of Passing</label>
							<input
								type="text"
								value={editFormData.twelfthEducation.yearOfPassing}
								onChange={(e) => handleEducationChange("twelfthEducation", "yearOfPassing", e.target.value)}
								placeholder="2021"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
							/>
						</div>
					</div>
				</div>

				{/* Graduation (Collapsible) */}
				<div className="bg-[#14112E] border border-gray-800 rounded-lg">
					<button
						type="button"
						onClick={() => setExpandedSections({ ...expandedSections, graduation: !expandedSections.graduation })}
						className="w-full px-8 py-5 flex items-center justify-between hover:bg-[#1a1640] transition-colors"
					>
						<h2 className="text-lg font-bold text-white uppercase tracking-wide">Graduation Educational Information</h2>
						<ChevronDown
							className={`w-5 h-5 text-white transition-transform ${expandedSections.graduation ? "rotate-180" : ""}`}
						/>
					</button>

					{expandedSections.graduation && (
						<div className="px-8 pb-8 pt-4 border-t border-gray-800">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm text-white/80 mb-2">School/College</label>
									<input
										type="text"
										value={editFormData.graduationEducation.school}
										onChange={(e) => handleEducationChange("graduationEducation", "school", e.target.value)}
										placeholder="College Name"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
								<div>
									<label className="block text-sm text-white/80 mb-2">Stream/Specialization</label>
									<input
										type="text"
										value={editFormData.graduationEducation.board}
										onChange={(e) => handleEducationChange("graduationEducation", "board", e.target.value)}
										placeholder="Computer Science"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
								<div>
									<label className="block text-sm text-white/80 mb-2">CGPA/Percentage</label>
									<input
										type="text"
										value={editFormData.graduationEducation.percentage}
										onChange={(e) => handleEducationChange("graduationEducation", "percentage", e.target.value)}
										placeholder="7/10"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
								<div>
									<label className="block text-sm text-white/80 mb-2">Year of Passing</label>
									<input
										type="text"
										value={editFormData.graduationEducation.yearOfPassing}
										onChange={(e) => handleEducationChange("graduationEducation", "yearOfPassing", e.target.value)}
										placeholder="2025"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Post Graduation (Collapsible) */}
				<div className="bg-[#14112E] border border-gray-800 rounded-lg">
					<button
						type="button"
						onClick={() => setExpandedSections({ ...expandedSections, postGraduation: !expandedSections.postGraduation })}
						className="w-full px-8 py-5 flex items-center justify-between hover:bg-[#1a1640] transition-colors"
					>
						<h2 className="text-lg font-bold text-white uppercase tracking-wide">Post Graduation Educational Information</h2>
						<ChevronDown
							className={`w-5 h-5 text-white transition-transform ${expandedSections.postGraduation ? "rotate-180" : ""}`}
						/>
					</button>

					{expandedSections.postGraduation && (
						<div className="px-8 pb-8 pt-4 border-t border-gray-800">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm text-white/80 mb-2">School/College</label>
									<input
										type="text"
										value={editFormData.postGraduationEducation.school}
										onChange={(e) => handleEducationChange("postGraduationEducation", "school", e.target.value)}
										placeholder="University Name"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
								<div>
									<label className="block text-sm text-white/80 mb-2">Stream/Specialization</label>
									<input
										type="text"
										value={editFormData.postGraduationEducation.board}
										onChange={(e) => handleEducationChange("postGraduationEducation", "board", e.target.value)}
										placeholder="MBA"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
								<div>
									<label className="block text-sm text-white/80 mb-2">CGPA/Percentage</label>
									<input
										type="text"
										value={editFormData.postGraduationEducation.percentage}
										onChange={(e) => handleEducationChange("postGraduationEducation", "percentage", e.target.value)}
										placeholder="8/10"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
								<div>
									<label className="block text-sm text-white/80 mb-2">Year of Passing</label>
									<input
										type="text"
										value={editFormData.postGraduationEducation.yearOfPassing}
										onChange={(e) => handleEducationChange("postGraduationEducation", "yearOfPassing", e.target.value)}
										placeholder="2027"
										className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Work Experience */}
				<div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-bold text-white uppercase tracking-wide">Work Experience</h2>
						<button
							type="button"
							onClick={addExperience}
							className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center gap-2"
						>
							<Plus className="w-4 h-4" />
							Add
						</button>
					</div>

					<div className="space-y-6">
						{editExperiences.map((exp, index) => (
							<div key={index} className="bg-[#0A0820] border border-gray-700 rounded-lg p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-white font-semibold">Experience {index + 1}</h3>
									{editExperiences.length > 1 && (
										<button
											type="button"
											onClick={() => removeExperience(index)}
											className="text-red-500 hover:text-red-400 transition-colors"
										>
											<X className="w-5 h-5" />
										</button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm text-white/80 mb-2">Company Name</label>
										<input
											type="text"
											value={exp.companyName}
											onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
											placeholder="Company Name"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
									<div>
										<label className="block text-sm text-white/80 mb-2">Role</label>
										<input
											type="text"
											value={exp.role}
											onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
											placeholder="UX Designer"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
									<div>
										<label className="block text-sm text-white/80 mb-2">Email</label>
										<input
											type="email"
											value={exp.emailId}
											onChange={(e) => handleExperienceChange(index, "emailId", e.target.value)}
											placeholder="email@company.com"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
									<div>
										<label className="block text-sm text-white/80 mb-2">Phone Number</label>
										<input
											type="text"
											value={exp.phoneNumber}
											onChange={(e) => handleExperienceChange(index, "phoneNumber", e.target.value)}
											placeholder="+1 123 456 7890"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
									<div>
										<label className="block text-sm text-white/80 mb-2">Start Date</label>
										<input
											type="text"
											value={exp.startDate}
											onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
											placeholder="2021"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
									<div>
										<label className="block text-sm text-white/80 mb-2">End Date</label>
										<input
											type="text"
											value={exp.endDate}
											onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
											placeholder="2024"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
								</div>

								<div className="mt-4">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={exp.currentlyWorking}
											onChange={(e) => handleExperienceChange(index, "currentlyWorking", e.target.checked)}
											className="w-4 h-4"
										/>
										<span className="text-white text-sm">Currently Working Here</span>
									</label>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Preferences */}
				<div className="bg-[#14112E] border border-gray-800 rounded-lg p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-bold text-white uppercase tracking-wide">University Preferences</h2>
						<button
							type="button"
							onClick={addPreference}
							className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center gap-2"
						>
							<Plus className="w-4 h-4" />
							Add
						</button>
					</div>

					<div className="space-y-6">
						{editPreferences.map((pref, index) => (
							<div key={index} className="bg-[#0A0820] border border-gray-700 rounded-lg p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-white font-semibold">Preference {index + 1}</h3>
									{editPreferences.length > 1 && (
										<button
											type="button"
											onClick={() => removePreference(index)}
											className="text-red-500 hover:text-red-400 transition-colors"
										>
											<X className="w-5 h-5" />
										</button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm text-white/80 mb-2">Region</label>
										<input
											type="text"
											value={pref.region}
											onChange={(e) => handlePreferenceChange(index, "region", e.target.value)}
											placeholder="North America"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
									<div>
										<label className="block text-sm text-white/80 mb-2">Country</label>
										<input
											type="text"
											value={pref.country}
											onChange={(e) => handlePreferenceChange(index, "country", e.target.value)}
											placeholder="USA"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
									<div>
										<label className="block text-sm text-white/80 mb-2">College Name</label>
										<input
											type="text"
											value={pref.collegeName}
											onChange={(e) => handlePreferenceChange(index, "collegeName", e.target.value)}
											placeholder="MIT"
											className="w-full bg-[#14112E] border border-gray-600 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4">
					<button
						type="button"
						onClick={handleDiscardChanges}
						disabled={isSaving}
						className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-3 rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						Discard
					</button>
					<button
						type="button"
						onClick={handleSaveChanges}
						disabled={isSaving}
						className="flex-1 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						{isSaving ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-8 text-white text-xs sm:text-sm">
					<button
						type="button"
						onClick={() => setActiveTab("info")}
						className={`pb-2 font-semibold text-sm ${
							activeTab === "info"
								? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
								: "text-white/80"
						}`}
					>
						Info
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("preference")}
						className={`pb-2 font-semibold text-sm ${
							activeTab === "preference"
								? "text-[#F68E2D] border-b-2 border-[#F68E2D]"
								: "text-white/80"
						}`}
					>
						Preference
					</button>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsEditMode(true)}
						className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded font-medium text-sm transition-colors inline-flex items-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Edit
					</button>
					<button
						onClick={() => setShowAddUniversityModal(true)}
						className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded font-medium text-sm transition-colors inline-flex items-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Add
					</button>
				</div>
			</div>

			{activeTab === "info" ? (
				<>
					<InfoSection
						title="Basic Information"
						rows={[
							{ label: "First Name", value: studentData.firstName },
							{ label: "Last Name", value: studentData.lastName },
							{ label: "Email ID", value: studentData.emailId },
							{ label: "Phone Number", value: studentData.mobileNumber },
						]}
					/>

					{studentData.tenthInformation.length > 0 && (
						<InfoSection
							title="10th Educational Information"
							rows={[
								{ label: "School", value: studentData.tenthInformation[0].schoolOrCollege },
								{ label: "Board Name", value: studentData.tenthInformation[0].boardOrUniversity },
								{ label: "Percentage", value: studentData.tenthInformation[0].cgpaOrPercentage },
								{ label: "Year", value: studentData.tenthInformation[0].yearOfPassing },
							]}
						/>
					)}

					{studentData.twelfthInformation.length > 0 && (
						<InfoSection
							title="12th Educational Information"
							rows={[
								{ label: "School", value: studentData.twelfthInformation[0].schoolOrCollege },
								{ label: "Board Name", value: studentData.twelfthInformation[0].boardOrUniversity },
								{ label: "Percentage", value: studentData.twelfthInformation[0].cgpaOrPercentage },
								{ label: "Year", value: studentData.twelfthInformation[0].yearOfPassing },
							]}
						/>
					)}

					{studentData.graduationInformation.length > 0 && (
						<InfoSection
							title="Graduation Educational Information"
							rows={[
								{ label: "College", value: studentData.graduationInformation[0].schoolOrCollege },
								{ label: "Stream", value: studentData.graduationInformation[0].streamOrSpecialization },
								{ label: "CGPA", value: studentData.graduationInformation[0].cgpaOrPercentage },
								{ label: "Year", value: studentData.graduationInformation[0].yearOfPassing },
							]}
						/>
					)}

					{studentData.postGraduationInformation.length > 0 && (
						<InfoSection
							title="Post Graduation Educational Information"
							rows={[
								{ label: "College", value: studentData.postGraduationInformation[0].schoolOrCollege },
								{ label: "Stream", value: studentData.postGraduationInformation[0].streamOrSpecialization },
								{ label: "CGPA", value: studentData.postGraduationInformation[0].cgpaOrPercentage },
								{ label: "Year", value: studentData.postGraduationInformation[0].yearOfPassing },
							]}
						/>
					)}

					{studentData.employmentInformation.length > 0 && (
						studentData.employmentInformation.map((emp, idx) => (
							<InfoSection
								key={idx}
								title={`Work Experience ${idx + 1}`}
								rows={[
									{ label: "Company", value: emp.companyName },
									{ label: "Role", value: emp.role },
									{ label: "Email ID", value: emp.emailId },
									{ label: "Phone Number", value: emp.phoneNumber },
									{ label: "Start", value: emp.startDate },
									{ label: "End", value: emp.endDate },
									{ label: "Currently Working", value: emp.currentlyWorkingHere ? "Yes" : "No" },
								]}
							/>
						))
					)}
				</>
			) : (
				<Preferences studentId={studentId} />
			)}
			{showAddUniversityModal && (
				<div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
					<div className="bg-[#14112E] border border-gray-700 rounded-lg p-8 w-full max-w-md mx-4">
						{/* Close Button */}
						<button
							onClick={() => setShowAddUniversityModal(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
						>
							<X className="w-6 h-6" />
						</button>

						<h2 className="text-white text-2xl font-bold mb-6">Add University Preference</h2>

						<form onSubmit={handleAddUniversity} className="space-y-4 max-h-96 overflow-y-auto pr-2">
							{/* University Name Input */}
							<div>
								<label className="block text-white text-sm mb-2">
									University Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="universityName"
									value={universityForm.universityName}
									onChange={handleUniversityFormChange}
									placeholder="E.g., Loughborough University"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Course Name Input */}
							<div>
								<label className="block text-white text-sm mb-2">
									Course Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="courseName"
									value={universityForm.courseName}
									onChange={handleUniversityFormChange}
									placeholder="E.g., MSC Human-Computer Interaction"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Region Input */}
							<div>
								<label className="block text-white text-sm mb-2">
									Region <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="region"
									value={universityForm.region}
									onChange={handleUniversityFormChange}
									placeholder="E.g., East Midlands"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Country Input */}
							<div>
								<label className="block text-white text-sm mb-2">
									Country <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="country"
									value={universityForm.country}
									onChange={handleUniversityFormChange}
									placeholder="E.g., United Kingdom"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Location Input */}
							<div>
								<label className="block text-white text-sm mb-2">Location</label>
								<input
									type="text"
									name="location"
									value={universityForm.location}
									onChange={handleUniversityFormChange}
									placeholder="E.g., Loughborough"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Eligibility Status */}
							<div>
								<label className="block text-white text-sm mb-2">Eligibility Status</label>
								<select
									name="eligibilityStatus"
									value={universityForm.eligibilityStatus}
									onChange={handleUniversityFormChange}
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
								>
									<option value="Eligible">Eligible</option>
									<option value="Hostile">Hostile</option>
									<option value="None">None</option>
								</select>
							</div>

							{/* Application Status */}
							<div>
								<label className="block text-white text-sm mb-2">Application Status</label>
								<select
									name="applicationStatus"
									value={universityForm.applicationStatus}
									onChange={handleUniversityFormChange}
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
								>
									<option value="On-Going">On-Going</option>
									<option value="Conditional Offer">Conditional Offer</option>
									<option value="Accepted">Accepted</option>
									<option value="Rejected">Rejected</option>
								</select>
							</div>

							{/* Intake Date */}
							<div>
								<label className="block text-white text-sm mb-2">Intake Date</label>
								<input
									type="text"
									name="intakeDate"
									value={universityForm.intakeDate}
									onChange={handleUniversityFormChange}
									placeholder="E.g., September 2026"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Start Date */}
							<div>
								<label className="block text-white text-sm mb-2">Start Date</label>
								<input
									type="date"
									name="startDate"
									value={universityForm.startDate}
									onChange={handleUniversityFormChange}
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* End Date */}
							<div>
								<label className="block text-white text-sm mb-2">End Date</label>
								<input
									type="date"
									name="endDate"
									value={universityForm.endDate}
									onChange={handleUniversityFormChange}
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Tuition Fee */}
							<div>
								<label className="block text-white text-sm mb-2">Tuition Fee</label>
								<input
									type="text"
									name="tuitionFee"
									value={universityForm.tuitionFee}
									onChange={handleUniversityFormChange}
									placeholder="E.g., £27,300"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* First Term Fee */}
							<div>
								<label className="block text-white text-sm mb-2">First Term Fee</label>
								<input
									type="text"
									name="firstTermFee"
									value={universityForm.firstTermFee}
									onChange={handleUniversityFormChange}
									placeholder="E.g., £4,300"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Logo URL */}
							<div>
								<label className="block text-white text-sm mb-2">Logo URL</label>
								<input
									type="text"
									name="logoUrl"
									value={universityForm.logoUrl}
									onChange={handleUniversityFormChange}
									placeholder="E.g., https://example.com/logo.png"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* University Email */}
							<div>
								<label className="block text-white text-sm mb-2">University Email</label>
								<input
									type="email"
									name="universityEmail"
									value={universityForm.universityEmail}
									onChange={handleUniversityFormChange}
									placeholder="E.g., admissions@lboro.ac.uk"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 mt-6 pt-4 border-t border-gray-700">
								<button
									type="button"
									onClick={() => setShowAddUniversityModal(false)}
									disabled={isSubmitting}
									className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex-1 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
								>
									{isSubmitting ? "Adding..." : "Add Preference"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Display Added Universities */}
			{universities.length > 0 && (
				<div className="space-y-4 mt-6">
					<h3 className="text-white text-lg font-semibold">Added Universities</h3>
					{universities.map((uni) => (
						<div
							key={uni.id}
							className="border border-[#2D2A50] bg-[#0F0D2B] p-4 rounded flex items-center justify-between"
						>
							<div className="space-y-2">
								<p className="text-white font-medium">{uni.universityName}</p>
								<p className="text-white/60 text-sm">
									{uni.region}, {uni.country}
								</p>
							</div>
							<button
								onClick={() => removeUniversity(uni.id)}
								className="text-red-500 hover:text-red-400 transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default StudentInfo;
