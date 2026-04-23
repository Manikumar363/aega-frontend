"use client";

import React, { useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";

type AgentRow = {
	id: number;
	name: string;
	designation: string;
	mobile: string;
	email: string;
	location: string;
	initials: string;
	online: boolean;
};

const agentRows: AgentRow[] = [
	{ id: 1, name: "Liam", designation: "Managing Director", mobile: "5506556340", email: "liam@gmail.com", location: "Hyderabad", initials: "L", online: true },
	{ id: 2, name: "Mason", designation: "Chief Operating Officer", mobile: "9876543210", email: "mason@gmail.com", location: "Hyderabad", initials: "M", online: true },
	{ id: 3, name: "Liam", designation: "Chief Marketing Officer", mobile: "6543217890", email: "liam@gmail.com", location: "Bangalore", initials: "L", online: false },
	{ id: 4, name: "Liam", designation: "Chief Financial Officer", mobile: "7890123456", email: "liam@gmail.com", location: "Hyderabad", initials: "L", online: false },
	{ id: 5, name: "Mason", designation: "Education Counselor", mobile: "1234567890", email: "mason@gmail.com", location: "Bangalore", initials: "M", online: true },
	{ id: 6, name: "Mason", designation: "Student Counselor", mobile: "4567890123", email: "mason@gmail.com", location: "Hyderabad", initials: "M", online: true },
	{ id: 7, name: "Liam", designation: "Career Counselor", mobile: "9876504321", email: "liam@gmail.com", location: "Bangalore", initials: "L", online: true },
	{ id: 8, name: "James", designation: "Academic Advisor", mobile: "2345678901", email: "james@gmail.com", location: "Bangalore", initials: "J", online: true },
	{ id: 9, name: "Sarah", designation: "Admissions Counselor", mobile: "3456789012", email: "sarah@email.com", location: "Bangalore", initials: "S", online: true },
	{ id: 10, name: "Michael", designation: "Visa Counselor", mobile: "4567890123", email: "michael@domain.com", location: "Noida", initials: "M", online: true },
];

const ENTRIES_OPTIONS = [8, 16, 24];

export default function Agents() {
	const [search, setSearch] = useState("");
	const [entriesPerPage, setEntriesPerPage] = useState(8);
	const [currentPage, setCurrentPage] = useState(1);
	const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return agentRows;

		return agentRows.filter(
			(agent) =>
				agent.name.toLowerCase().includes(query) ||
				agent.designation.toLowerCase().includes(query) ||
				agent.email.toLowerCase().includes(query) ||
				agent.location.toLowerCase().includes(query),
		);
	}, [search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
	const paginatedRows = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<div className="relative w-full max-w-[720px] flex-1">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search"
						className="h-[62px] w-full border border-[#8A91AC] bg-transparent px-5 pr-12 text-sm text-white outline-none placeholder:text-white/65"
					/>
					<Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0F1A36]" />
				</div>
			</div>

			<div className="overflow-hidden border border-[#8A91AC] bg-[#14112E]">
				<div className="overflow-x-auto">
					<table className="min-w-[1280px] w-full border-separate border-spacing-0">
						<thead>
							<tr className="text-sm font-semibold text-white">
								<th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Image</th>
								<th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Name</th>
								<th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Designation</th>
								<th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Mobile Number</th>
								<th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Email</th>
								<th className="border-b border-r border-[#8A91AC] px-6 py-5 text-center">Location</th>
								<th className="border-b border-[#8A91AC] px-6 py-5 text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{paginatedRows.map((agent, index) => (
								<tr key={agent.id} className="text-sm text-white/90">
									<td className={`border-r border-[#8A91AC] px-6 py-5 ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
										<div className="relative mx-auto h-10 w-10 rounded-full bg-[#FFE66D] p-0.5">
											<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#1B153D] text-[10px] font-bold text-white">
												{agent.initials}
											</div>
											<span
												className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#14112E] ${agent.online ? "bg-lime-400" : "bg-red-500"}`}
											/>
										</div>
									</td>
									<td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
										{agent.name}
									</td>
									<td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
										{agent.designation}
									</td>
									<td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
										{agent.mobile}
									</td>
									<td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
										{agent.email}
									</td>
									<td className={`border-r border-[#8A91AC] px-6 py-5 text-center ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
										{agent.location}
									</td>
									<td className={`px-6 py-5 ${index !== paginatedRows.length - 1 ? "border-b border-[#8A91AC]" : ""}`}>
										<div className="flex items-center justify-center gap-2">
											<button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F68E2D] text-white transition-colors hover:bg-[#e57d1f]" aria-label="View agent">
												<Eye className="h-4 w-4" />
											</button>
											<button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4A5BE7] text-white transition-colors hover:bg-[#3e4fd3]" aria-label="Edit agent">
												<Pencil className="h-4 w-4" />
											</button>
											<button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E03137] text-white transition-colors hover:bg-[#c62830]" aria-label="Delete agent">
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className="flex flex-col gap-4 pb-3 pt-1 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex items-center gap-2">
					<button
						onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
						disabled={currentPage === 1}
						className="flex h-8 w-8 items-center justify-center rounded-md border border-white/85 text-white transition-colors hover:bg-white/5 disabled:opacity-40"
					>
						&lt;
					</button>

					{[1, 2, 3, "...", Math.max(1, totalPages)].map((page, index) =>
						typeof page === "number" ? (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium transition-colors ${currentPage === page ? "bg-[#F68E2D] text-white" : "text-white/75 hover:bg-white/5"}`}
							>
								{page}
							</button>
						) : (
							<span key={`${page}-${index}`} className="px-1 text-white/70">
								...
							</span>
						),
					)}

					<button
						onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
						disabled={currentPage === totalPages}
						className="flex h-8 w-8 items-center justify-center rounded-md border border-white/85 text-white transition-colors hover:bg-white/5 disabled:opacity-40"
					>
						&gt;
					</button>
				</div>

				<div className="flex items-center gap-4 text-sm text-white/75">
					<span>Showing 1 to {Math.min(entriesPerPage, filtered.length)} of {filtered.length} entries</span>

					<div className="relative">
						<button
							type="button"
							onClick={() => setShowEntriesDropdown((value) => !value)}
							className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm text-[#222]"
						>
							Show {entriesPerPage}
							<svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>

						{showEntriesDropdown && (
							<div className="absolute right-0 top-full z-20 mt-2 w-24 overflow-hidden rounded-md border border-white/10 bg-[#14112E] shadow-lg">
								{ENTRIES_OPTIONS.map((option) => (
									<button
										key={option}
										type="button"
										onClick={() => {
											setEntriesPerPage(option);
											setCurrentPage(1);
											setShowEntriesDropdown(false);
										}}
										className="block w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
									>
										{option}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
