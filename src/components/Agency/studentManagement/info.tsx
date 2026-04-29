import React, { useState } from "react";
import { Plus, X, Eye } from "lucide-react";
import Preferences from "./preferences";
import toast from "react-hot-toast";

type StudentSummary = {
	name: string;
	mobile: string;
	email: string;
};

type StudentInfoProps = {
	student: StudentSummary;
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

const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
	const [firstName, ...lastNameParts] = student.name.split(" ");
	const lastName = lastNameParts.join(" ") || "Decker";
	const [activeTab, setActiveTab] = useState<"info" | "preference">("info");
	const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);
	const [universities, setUniversities] = useState<University[]>([]);
	const [universityForm, setUniversityForm] = useState({
		region: "",
		country: "",
		universityName: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [viewingUniversity, setViewingUniversity] = useState<University | null>(null);

	const handleUniversityFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUniversityForm({ ...universityForm, [name]: value });
	};

	const handleAddUniversity = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!universityForm.region.trim()) {
			toast.error("Region is required");
			return;
		}
		if (!universityForm.country.trim()) {
			toast.error("Country is required");
			return;
		}
		if (!universityForm.universityName.trim()) {
			toast.error("University name is required");
			return;
		}

		setIsSubmitting(true);
		try {
			const newUniversity: University = {
				id: Date.now(),
				region: universityForm.region,
				country: universityForm.country,
				universityName: universityForm.universityName,
			};

			setUniversities([...universities, newUniversity]);
			setUniversityForm({ region: "", country: "", universityName: "" });
			setShowAddUniversityModal(false);
			toast.success("University added successfully!");
		} catch (error) {
			console.error("Error adding university:", error);
			toast.error("Failed to add university");
		} finally {
			setIsSubmitting(false);
		}
	};

	const removeUniversity = (id: number) => {
		setUniversities(universities.filter((uni) => uni.id !== id));
		toast.success("University removed");
	};

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
					<button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded font-medium text-sm transition-colors inline-flex items-center gap-2">
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
							{ label: "First Name", value: firstName || "Liam" },
							{ label: "Last Name", value: lastName },
							{ label: "Email ID", value: student.email },
							{ label: "Phone Number", value: student.mobile },
						]}
					/>

					<InfoSection
						title="10th Educational Information"
						rows={[
							{ label: "School", value: "School Name" },
							{ label: "Board Name", value: "Board Name" },
							{ label: "Percentage", value: "88%" },
							{ label: "Year", value: "2019" },
						]}
					/>

					<InfoSection
						title="12th Educational Information"
						rows={[
							{ label: "School", value: "School Name" },
							{ label: "Board Name", value: "Board Name" },
							{ label: "Percentage", value: "88%" },
							{ label: "Year", value: "2021" },
						]}
					/>

					<InfoSection
						title="Graduation Educational Information"
						rows={[
							{ label: "College", value: "School Name" },
							{ label: "University", value: "Board Name" },
							{ label: "Major", value: "CSE" },
							{ label: "CGPA", value: "7/10" },
							{ label: "Start", value: "2021" },
							{ label: "End", value: "2025" },
						]}
					/>

					<InfoSection
						title="Competitive Exam Information"
						rows={[
							{ label: "IELTS", value: "Score" },
							{ label: "GRE", value: "Score" },
							{ label: "TOFEL", value: "Score" },
							{ label: "GMAT", value: "Score" },
						]}
					/>

					<InfoSection
						title="Work Experience 1"
						rows={[
							{ label: "Company", value: "Company Name" },
							{ label: "Role", value: "UX Designer" },
							{ label: "Email ID", value: student.email },
							{ label: "Phone Number", value: student.mobile },
							{ label: "Start", value: "2021" },
							{ label: "End", value: "2025" },
						]}
					/>

					<InfoSection
						title="Work Experience 2"
						rows={[
							{ label: "Company", value: "Company Name" },
							{ label: "Role", value: "UX Designer" },
							{ label: "Email ID", value: student.email },
							{ label: "Phone Number", value: student.mobile },
							{ label: "Start", value: "2021" },
							{ label: "End", value: "2025" },
						]}
					/>
				</>
			) : (
				<Preferences />
			)}

			{/* Add University Modal */}
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

						<h2 className="text-white text-2xl font-bold mb-6">Add University</h2>

						<form onSubmit={handleAddUniversity} className="space-y-6">
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
									placeholder="Region"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
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
									placeholder="Country"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
								/>
							</div>

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
									placeholder="University Name"
									className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D]"
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 mt-8">
								<button
									type="button"
									onClick={() => setShowAddUniversityModal(false)}
									disabled={isSubmitting}
									className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-3 rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Discard
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex-1 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmitting ? "Adding..." : "Add"}
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
