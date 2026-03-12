import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";

type PreferenceItem = {
	id: number;
	name: string;
	courseName: string;
	eligibilityStatus: "Hostile" | "Eligible" | "None";
	applicationStatus: "On-Going" | "Conditional Offer" | "Accepted" | "Rejected";
	shortCode: string;
	logoColor: string;
};

const preferences: PreferenceItem[] = [
	{ id: 1, name: "Loughborough University", courseName: "MSC Human-Computer Interaction", eligibilityStatus: "Hostile", applicationStatus: "On-Going", shortCode: "LU", logoColor: "#5A2EA6" },
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

const statusClasses: Record<PreferenceItem["eligibilityStatus"], string> = {
	Hostile: "bg-[#FFF7D6] text-[#E38817]",
	Eligible: "bg-[#E6F8E4] text-[#2B9B1F]",
	None: "bg-[#FFD8DF] text-[#E03137]",
};

const appStatusClasses: Record<PreferenceItem["applicationStatus"], string> = {
	"On-Going": "bg-[#FFF7D6] text-[#E38817]",
	"Conditional Offer": "bg-[#E9E4FF] text-[#5541D7]",
	Accepted: "bg-[#E6F8E4] text-[#2B9B1F]",
	Rejected: "bg-[#FFD8DF] text-[#E03137]",
};

const Preferences: React.FC = () => {
	return (
		<div className="border border-[#2D2A50] bg-[#0F0D2B] overflow-x-auto">
			<table className="min-w-[980px] w-full">
				<thead>
					<tr className="border-b border-[#3A3760] text-white/90 text-sm">
						<th className="px-4 py-4 text-center font-semibold">Image</th>
						<th className="px-4 py-4 text-center font-semibold">Name</th>
						<th className="px-4 py-4 text-center font-semibold">Couse Name</th>
						<th className="px-4 py-4 text-center font-semibold">Eligibility Status</th>
						<th className="px-4 py-4 text-center font-semibold">Application Status</th>
						<th className="px-4 py-4 text-center font-semibold">Action</th>
					</tr>
				</thead>
				<tbody>
					{preferences.map((item) => (
						<tr key={item.id} className="border-t border-[#3A3760] text-white text-sm">
							<td className="px-4 py-3">
								<div className="flex justify-center">
									<div
										className="w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
										style={{ backgroundColor: item.logoColor }}
									>
										{item.shortCode}
									</div>
								</div>
							</td>
							<td className="px-4 py-3 text-center whitespace-nowrap">{item.name}</td>
							<td className="px-4 py-3 text-center whitespace-nowrap">{item.courseName}</td>
							<td className="px-4 py-3 text-center">
								<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[item.eligibilityStatus]}`}>
									<span className="w-2 h-2 rounded-full bg-current" />
									{item.eligibilityStatus}
								</span>
							</td>
							<td className="px-4 py-3 text-center">
								<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${appStatusClasses[item.applicationStatus]}`}>
									<span className="w-2 h-2 rounded-full bg-current" />
									{item.applicationStatus}
								</span>
							</td>
							<td className="px-4 py-3">
								<div className="flex items-center justify-center gap-2">
									<button className="w-7 h-7 rounded-md bg-[#F68E2D] hover:bg-[#e57d1f] flex items-center justify-center" aria-label="View preference">
										<Eye className="w-3.5 h-3.5 text-white" />
									</button>
									<button className="w-7 h-7 rounded-md bg-[#3B49DF] hover:bg-[#3340c9] flex items-center justify-center" aria-label="Edit preference">
										<Pencil className="w-3.5 h-3.5 text-white" />
									</button>
									<button className="w-7 h-7 rounded-md bg-[#E03137] hover:bg-[#c82a30] flex items-center justify-center" aria-label="Delete preference">
										<Trash2 className="w-3.5 h-3.5 text-white" />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Preferences;
