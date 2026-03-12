import React, { useState } from "react";
import { Plus } from "lucide-react";
import Preferences from "./preferences";

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
				<button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded font-medium text-sm transition-colors inline-flex items-center gap-2">
					<Plus className="w-4 h-4" />
					Add
				</button>
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
		</div>
	);
};

export default StudentInfo;
