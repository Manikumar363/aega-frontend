import { ShieldAlert, Calendar } from "lucide-react";
import React from "react";

const stats = [
	[
		{ label: "Active Issue", value: "1" },
		{ label: "Over All Score", value: "99%" },
		{ label: "Risk Level", value: "LOW" },
	],
	[
		{ label: "No. of Audits", value: "15" },
		{ label: "Active Alerts", value: "99%" },
		{ label: "Risk Level", value: "LOW" },
	],
];

type AuditStatus = "Passed" | "Failed" | "Pending" | "Scheduled";

const statusStyles: Record<AuditStatus, { dot: string; text: string; border: string }> = {
	Passed: { dot: "bg-green-400", text: "text-green-400", border: "border-green-400" },
	Failed: { dot: "bg-rose-400", text: "text-rose-400", border: "border-rose-400" },
	Pending: { dot: "bg-green-400", text: "text-green-400", border: "border-green-400" },
	Scheduled: { dot: "bg-green-400", text: "text-green-400", border: "border-green-400" },
};

const audits: { title: string; status: AuditStatus; date: string }[] = [
	{ title: "BUSINESS HEALTH CHECK", status: "Passed", date: "2025-01-15" },
	{ title: "COMPLIANCE AUDIT", status: "Failed", date: "2025-01-15" },
	{ title: "DOCUMENTATION REVIEW", status: "Passed", date: "2025-01-15" },
	{ title: "DESIGN APPROVAL", status: "Passed", date: "2025-02-10" },
	{ title: "USER FEEDBACK SESSION", status: "Pending", date: "2025-03-05" },
	{ title: "FINAL IMPLEMENTATION", status: "Scheduled", date: "2025-03-20" },
];

const Audits: React.FC = () => (
	<div className="space-y-4">
		{/* Stat cards */}
		{stats.map((row, rowIdx) => (
			<div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 border border-[#3A3760]">
				{row.map((card, colIdx) => (
					<div
						key={colIdx}
						className={`bg-[#14123A] px-6 py-5 flex flex-col gap-4 ${
							colIdx < row.length - 1 ? "border-r border-[#3A3760]" : ""
						}`}
					>
						<div className="flex items-start justify-between">
							<ShieldAlert className="w-5 h-5 text-[#F68E2D]" />
							<span className="font-bold text-base text-[#F68E2D]">{card.value}</span>
						</div>
						<span className="text-white text-sm">{card.label}</span>
					</div>
				))}
			</div>
		))}

		{/* Audit cards grid */}
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{audits.map((audit, idx) => {
				const s = statusStyles[audit.status];
				return (
					<div
						key={idx}
						className="bg-[#14123A] border border-[#3A3760] px-6 py-5 flex flex-col gap-3"
					>
						<div className="flex items-center justify-between">
							<span className="text-white font-bold text-sm tracking-wide">{audit.title}</span>
							<span
								className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${s.border} ${s.text} text-xs font-semibold bg-transparent`}
							>
								<span className={`w-2 h-2 rounded-full ${s.dot}`} />
								{audit.status}
							</span>
						</div>
						<div className="flex items-center gap-2 text-gray-400 text-sm">
							<Calendar className="w-4 h-4" />
							<span>Date : {audit.date}</span>
						</div>
					</div>
				);
			})}
		</div>
	</div>
);

export default Audits;
