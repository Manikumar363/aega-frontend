"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type PreferenceItem = {
	id: number;
	name: string;
	courseName: string;
	eligibilityStatus: "Hostile" | "Eligible" | "None";
	applicationStatus: "On-Going" | "Conditional Offer" | "Accepted" | "Rejected";
	shortCode: string;
	logoColor: string;
	location?: string;
	intake?: string;
	startDate?: string;
	endDate?: string;
	tuitionFee?: string;
	termFee?: string;
};

const preferences: PreferenceItem[] = [
	{ id: 1, name: "Loughborough University", courseName: "MSC User Experience Design and Experience", eligibilityStatus: "Eligible", applicationStatus: "Conditional Offer", shortCode: "LU", logoColor: "#5A2EA6", location: "Loughborough", intake: "September 2026", startDate: "21st September 2026", endDate: "21st September 2027", tuitionFee: "£27,300", termFee: "£4,300" },
	{ id: 2, name: "Kingston University", courseName: "MSC Digital Design", eligibilityStatus: "Eligible", applicationStatus: "Conditional Offer", shortCode: "KU", logoColor: "#1F2937" },
	{ id: 3, name: "City College London", courseName: "MSC User Experience and Service Design", eligibilityStatus: "Eligible", applicationStatus: "Conditional Offer", shortCode: "CC", logoColor: "#D9363E" },
	{ id: 4, name: "KAIST", courseName: "MSC Human-Centred Interactive Technologies", eligibilityStatus: "Hostile", applicationStatus: "On-Going", shortCode: "KS", logoColor: "#0E7490" },
	{ id: 5, name: "RMIT University", courseName: "MSC Digital Design", eligibilityStatus: "Eligible", applicationStatus: "On-Going", shortCode: "RM", logoColor: "#DC2626" },
	{ id: 6, name: "UCD Dublin", courseName: "MSC Human-AI Interaction", eligibilityStatus: "Hostile", applicationStatus: "Accepted", shortCode: "UC", logoColor: "#1D4ED8" },
	{ id: 7, name: "TU Berlin", courseName: "MSC Integrated Product Design", eligibilityStatus: "Hostile", applicationStatus: "Rejected", shortCode: "TB", logoColor: "#BE123C" },
	{ id: 8, name: "MIT", courseName: "MSC User Experience Design MSc", eligibilityStatus: "Hostile", applicationStatus: "Rejected", shortCode: "MT", logoColor: "#B91C1C" },
	{ id: 9, name: "Carnegie Mellon University", courseName: "MSC Human-Computer Interaction", eligibilityStatus: "None", applicationStatus: "Rejected", shortCode: "CM", logoColor: "#B91C1C" },
	{ id: 10, name: "UC Berkley", courseName: "MSC Human-Computer Interaction", eligibilityStatus: "None", applicationStatus: "Rejected", shortCode: "UB", logoColor: "#0369A1" },
];

const PreferenceDetailPage: React.FC = () => {
	const router = useRouter();
	const params = useParams();
	const id = Number(params.id);

	const preference = preferences.find((p) => p.id === id);

	if (!preference) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-[#14112E]">
				<div className="text-white text-center">
					<h2 className="text-2xl font-bold mb-4">University Not Found</h2>
					<button
						onClick={() => router.back()}
						className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-6 py-2 rounded-md transition-colors"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	const getStatusClass = (status: PreferenceItem["eligibilityStatus"]) => {
		const classes: Record<PreferenceItem["eligibilityStatus"], string> = {
			Hostile: "bg-[#FFF7D6] text-[#E38817]",
			Eligible: "bg-[#E6F8E4] text-[#2B9B1F]",
			None: "bg-[#FFD8DF] text-[#E03137]",
		};
		return classes[status];
	};

	const getAppStatusClass = (status: PreferenceItem["applicationStatus"]) => {
		const classes: Record<PreferenceItem["applicationStatus"], string> = {
			"On-Going": "bg-[#FFF7D6] text-[#E38817]",
			"Conditional Offer": "bg-[#E9E4FF] text-[#5541D7]",
			Accepted: "bg-[#E6F8E4] text-[#2B9B1F]",
			Rejected: "bg-[#FFD8DF] text-[#E03137]",
		};
		return classes[status];
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-[#14112E] border-b border-gray-700 px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.back()}
						className="text-white hover:text-[#F68E2D] transition-colors"
						aria-label="Go back"
					>
						<ArrowLeft className="w-6 h-6" />
					</button>
					<h1 className="text-[#F68E2D] text-xl font-semibold">Info</h1>
				</div>
				<button className="bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors">
					<span>✏️</span>
					Edit
				</button>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-6 py-12">
				{/* University Information Section */}
				<div className="mb-12">
					<h2 className="text-[#14112E] text-2xl font-bold mb-8 uppercase tracking-wide">UNIVERSITY INFORMATION</h2>
					<div className="bg-[#1a1838] border border-gray-300 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Name :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.name}</p>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Location :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.location || "-"}</p>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Course :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.courseName}</p>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Intake :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.intake || "-"}</p>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Eligibility :</span>
							<div className="mt-1">
								<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(preference.eligibilityStatus)}`}>
									<span className="w-2 h-2 rounded-full bg-current" />
									{preference.eligibilityStatus}
								</span>
							</div>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Application :</span>
							<div className="mt-1">
								<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getAppStatusClass(preference.applicationStatus)}`}>
									<span className="w-2 h-2 rounded-full bg-current" />
									{preference.applicationStatus}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Duration and Fees Section */}
				<div>
					<h2 className="text-[#14112E] text-2xl font-bold mb-8 uppercase tracking-wide">DURATION AND FEES</h2>
					<div className="bg-[#1a1838] border border-gray-300 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Start Date :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.startDate || "-"}</p>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">End Date :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.endDate || "-"}</p>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">Tuition Fee :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.tuitionFee || "-"}</p>
						</div>
						<div>
							<span className="text-[#14112E]/70 text-sm font-medium">1st Term Fee :</span>
							<p className="text-[#14112E] font-semibold mt-1">{preference.termFee || "-"}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PreferenceDetailPage;
