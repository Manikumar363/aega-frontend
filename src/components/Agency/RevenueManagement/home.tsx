"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, Pencil, Shield, Trash2 } from "lucide-react";

type RevenueBand = {
	country: string;
	range: string;
	current: number;
	total: number;
	color: string;
};

type Transaction = {
	studentName: string;
	agentName: string;
	universityName: string;
	startDate: string;
	endDate: string;
	amount: string;
	status: "Pending" | "Success";
};

const summaryCards = [
	{ title: "Total Revenue", amount: "$808000" },
	{ title: "Under Grad's Commission", amount: "$50000" },
	{ title: "Post Grad's Commission", amount: "$30000" },
];

const revenueDistribution: RevenueBand[] = [
	{ country: "UK", range: "85% -100%", current: 50, total: 75, color: "#10F1C2" },
	{ country: "USA", range: "50% - 84%", current: 24, total: 75, color: "#56A8FF" },
	{ country: "Ireland", range: "50% - 84%", current: 24, total: 75, color: "#56A8FF" },
	{ country: "Canada", range: "50% - 84%", current: 24, total: 75, color: "#56A8FF" },
	{ country: "Australia", range: "0% - 49%", current: 1, total: 75, color: "#FF9C2A" },
];

const transactions: Transaction[] = [
	{
		studentName: "Liam",
		agentName: "Liam",
		universityName: "Loughborough University",
		startDate: "01/09/2026",
		endDate: "01/09/2027",
		amount: "$500",
		status: "Pending",
	},
	{
		studentName: "Mason",
		agentName: "Mason",
		universityName: "Kingston University",
		startDate: "13/09/2026",
		endDate: "13/09/2027",
		amount: "$500",
		status: "Success",
	},
	{
		studentName: "Liam",
		agentName: "Liam",
		universityName: "City College London",
		startDate: "15/09/2026",
		endDate: "15/09/2027",
		amount: "$500",
		status: "Success",
	},
];

const RevenueManagementHome: React.FC = () => {
	const router = useRouter();

	return (
		<div className="space-y-4 pb-2 w-full max-w-full overflow-x-hidden">
			<section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<h1 className="text-white text-2xl leading-tight font-semibold">Revenue Report</h1>
					<p className="mt-1.5 text-white/85 text-md">Manage all of your Agent and Agency here.</p>
				</div>

				<button className="self-start bg-[#F7941D] hover:bg-[#E38416] transition-colors text-white text-xs font-medium px-5 py-2.5 inline-flex items-center gap-2 border border-[#E28C28]">
					Download
					<ChevronDown className="w-3.5 h-3.5" />
				</button>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{summaryCards.map((card) => (
					<article key={card.title} className="bg-[#14113A] border border-[#343868] px-7 py-6">
						<div className="flex items-center justify-between">
							<Shield className="w-5 h-5 text-[#F7941D]" />
							<span className="text-[#F7941D] text-3xl leading-none font-semibold">{card.amount}</span>
						</div>
						<p className="mt-3 text-white text-lg leading-tight font-medium wrap-break-word">{card.title}</p>
					</article>
				))}
			</section>

			<section className="bg-[#14113A] border border-[#343868] px-7 py-7">
				<h2 className="text-white text-2xl leading-tight font-semibold uppercase">Revenue Distribution</h2>

				<div className="mt-4 space-y-4">
					{revenueDistribution.map((item) => {
						const percentage = (item.current / item.total) * 100;

						return (
							<div key={item.country}>
								<div className="flex items-center justify-between mb-2">
									<p className="text-white text-base leading-tight">
										{item.country} ({item.range})
									</p>
									<p className="text-white text-base leading-tight font-medium">
										{String(item.current).padStart(2, "0")}/{item.total}
									</p>
								</div>

								<div className="h-3 bg-white rounded-full overflow-hidden">
									<div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
								</div>
							</div>
						);
					})}
				</div>
			</section>

			<section>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-white text-2xl leading-tight font-semibold uppercase">Recent Transactions</h2>
					<button
						onClick={() => router.push("/agent/revenue/recent-transactions")}
						className="bg-[#F7941D] hover:bg-[#E38416] transition-colors text-white text-xs font-medium px-4 py-2 border border-[#E28C28]"
					>
						View All
					</button>
				</div>

				<div className="border border-[#6A708D] overflow-hidden">
					<table className="w-full table-fixed bg-[#14113A]">
						<thead>
							<tr className="border-b border-[#6A708D]">
								<th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Student</th>
								<th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Agent</th>
								<th className="px-2 py-3 text-center text-white text-[15px] font-semibold">University</th>
								<th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Start</th>
								<th className="px-2 py-3 text-center text-white text-[15px] font-semibold">End</th>
								<th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Amount</th>
								<th className="px-2 py-3 text-center text-white text-[15px] font-semibold">Status</th>
								<th className="px-2 py-3 text-center text-white text-[11px] font-semibold">Action</th>
							</tr>
						</thead>

						<tbody>
							{transactions.map((row, idx) => (
								<tr key={`${row.studentName}-${idx}`} className="border-t border-[#6A708D]">
									<td className="px-2 py-3 text-center text-white text-[13px]">{row.studentName}</td>
									<td className="px-2 py-3 text-center text-white text-[13px]">{row.agentName}</td>
									<td className="px-2 py-3 text-center text-white text-[13px] wrap-break-word leading-tight">{row.universityName}</td>
									<td className="px-2 py-3 text-center text-white text-[13px]">{row.startDate}</td>
									<td className="px-2 py-3 text-center text-white text-[13px]">{row.endDate}</td>
									<td className="px-2 py-3 text-center text-white text-[13px] font-medium">{row.amount}</td>

									<td className="px-2 py-3 text-center">
										<span
											className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
												row.status === "Pending"
													? "bg-[#FFF4D1] text-[#F7941D]"
													: "bg-[#D6F9CC] text-[#4EAD2E]"
											}`}
										>
											<span
												className={`w-2 h-2 rounded-full ${
													row.status === "Pending" ? "bg-[#F7941D]" : "bg-[#4EAD2E]"
												}`}
											/>
											{row.status}
										</span>
									</td>

									<td className="px-2 py-3">
										<div className="flex items-center justify-center gap-3">
											<button
												className="w-7 h-7 rounded-md bg-[#F7941D] hover:bg-[#E38416] text-white inline-flex items-center justify-center transition-colors"
												aria-label="View transaction"
											>
												<Eye className="w-3.5 h-3.5" />
											</button>
											<button
												className="w-7 h-7 rounded-md bg-[#4761E5] hover:bg-[#3F57D2] text-white inline-flex items-center justify-center transition-colors"
												aria-label="Edit transaction"
											>
												<Pencil className="w-3.5 h-3.5" />
											</button>
											<button
												className="w-7 h-7 rounded-md bg-[#F03B46] hover:bg-[#DA3440] text-white inline-flex items-center justify-center transition-colors"
												aria-label="Delete transaction"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export default RevenueManagementHome;
