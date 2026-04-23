import { ShieldAlert } from "lucide-react";
import React from "react";

const stats = [
	[
		{ label: "Active Issue", value: "1", valueColor: "#F68E2D" },
		{ label: "Over All Score", value: "99%", valueColor: "#F68E2D" },
		{ label: "Risk Level", value: "LOW", valueColor: "#F68E2D" },
	],
	[
		{ label: "No. of Audits", value: "15", valueColor: "#F68E2D" },
		{ label: "Active Alerts", value: "99%", valueColor: "#F68E2D" },
		{ label: "Risk Level", value: "LOW", valueColor: "#F68E2D" },
	],
];

const riskIndicators = [
	"Documentation",
	"Training Current",
	"Insurance",
	"Financial Health",
	"Basic Compliances Assement",
	"Visa Refusal Enrollment",
	"Customer Insights",
	"Operational Efficiency",
	"Competitive Analysis",
];

const Compliances: React.FC = () => (
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
							<span className="font-bold text-base" style={{ color: card.valueColor }}>
								{card.value}
							</span>
						</div>
						<span className="text-white text-sm">{card.label}</span>
					</div>
				))}
			</div>
		))}

		{/* Risk Indicator */}
		<div className="bg-[#14123A] border border-[#3A3760] p-6">
			<h3 className="text-white text-lg font-bold mb-4">Risk Indicator</h3>
			<div className="bg-[#0F0D2B] border border-[#3A3760]">
				{riskIndicators.map((item, idx) => (
					<div
						key={idx}
						className={`flex items-center justify-between px-5 py-4 ${
							idx < riskIndicators.length - 1 ? "border-b border-[#2D2A50]" : ""
						}`}
					>
						<span className="text-white text-sm">{item}</span>
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#00C48C] bg-transparent text-[#00C48C] text-xs font-semibold">
							<span className="w-2 h-2 rounded-full bg-[#00C48C]" />
							Compliant
						</span>
					</div>
				))}
			</div>
		</div>
	</div>
);

export default Compliances;
