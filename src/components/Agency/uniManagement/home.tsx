"use client";

import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Eye,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import AddUniversity from "./addUniveristy";
import InfoView from "./info";

type University = {
	id: number;
	name: string;
	mobile: string;
	email: string;
	location: string;
	shortCode: string;
	logoColor: string;
	verified: "green" | "yellow";
	online: boolean;
};

const universities: University[] = [
	{
		id: 1,
		name: "Loughborough University",
		mobile: "5506556340",
		email: "uni@gmail.com",
		location: "Loughborough",
		shortCode: "LU",
		logoColor: "#5C2EA8",
		verified: "green",
		online: true,
	},
	{
		id: 2,
		name: "Kingston University",
		mobile: "9876543210",
		email: "uni@gmail.com",
		location: "London",
		shortCode: "KU",
		logoColor: "#1F2937",
		verified: "yellow",
		online: true,
	},
	{
		id: 3,
		name: "City College London",
		mobile: "6543217890",
		email: "uni@gmail.com",
		location: "London",
		shortCode: "CL",
		logoColor: "#D9363E",
		verified: "green",
		online: false,
	},
	{
		id: 4,
		name: "KAIST",
		mobile: "7890123456",
		email: "uni@gmail.com",
		location: "Daejeon",
		shortCode: "KS",
		logoColor: "#0E7490",
		verified: "yellow",
		online: false,
	},
	{
		id: 5,
		name: "RMIT University",
		mobile: "1234567890",
		email: "uni@gmail.com",
		location: "Melbourne",
		shortCode: "RM",
		logoColor: "#DC2626",
		verified: "green",
		online: true,
	},
	{
		id: 6,
		name: "UCD Dublin",
		mobile: "4567890123",
		email: "uni@gmail.com",
		location: "Dublin",
		shortCode: "UC",
		logoColor: "#1D4ED8",
		verified: "green",
		online: true,
	},
	{
		id: 7,
		name: "TU Berlin",
		mobile: "9876504321",
		email: "uni@gmail.com",
		location: "Berlin",
		shortCode: "TB",
		logoColor: "#BE123C",
		verified: "green",
		online: true,
	},
	{
		id: 8,
		name: "MIT",
		mobile: "2345678901",
		email: "uni@gmail.com",
		location: "Cambridge",
		shortCode: "MI",
		logoColor: "#B91C1C",
		verified: "green",
		online: true,
	},
	{
		id: 9,
		name: "Carnegie Mellon University",
		mobile: "3456789012",
		email: "uni@gmail.com",
		location: "Pittsburgh",
		shortCode: "CM",
		logoColor: "#B91C1C",
		verified: "green",
		online: true,
	},
	{
		id: 10,
		name: "UC Berkley",
		mobile: "4567890123",
		email: "uni@gmail.com",
		location: "California",
		shortCode: "UB",
		logoColor: "#0369A1",
		verified: "yellow",
		online: true,
	},
];

const ENTRIES_OPTIONS = [8, 16, 24];
const TOTAL_ENTRIES = 50;

const UniManagementHome: React.FC = () => {
	const [search, setSearch] = useState("");
	const [entriesPerPage, setEntriesPerPage] = useState(8);
	const [currentPage, setCurrentPage] = useState(1);
	const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
	const [showAddUniversity, setShowAddUniversity] = useState(false);
	const [viewingUniversity, setViewingUniversity] = useState<University | null>(null);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return universities;

		return universities.filter(
			(item) =>
				item.name.toLowerCase().includes(query) ||
				item.email.toLowerCase().includes(query) ||
				item.location.toLowerCase().includes(query),
		);
	}, [search]);

	const totalPages = Math.max(1, Math.ceil(TOTAL_ENTRIES / entriesPerPage));
	const startIndex = (currentPage - 1) * entriesPerPage;
	const paginatedRows = filtered.slice(startIndex, startIndex + entriesPerPage);

	const pageNumbers = [1, 2, 3, "...", totalPages];

	if (viewingUniversity) {
		return (
			<div className="space-y-4">
				<button
					type="button"
					onClick={() => setViewingUniversity(null)}
					className="text-white/80 hover:text-white text-sm"
				>
					← Back to Uni Management
				</button>
				<InfoView
					agent={{
						id: viewingUniversity.id,
						name: viewingUniversity.name,
						designation: viewingUniversity.location,
						mobile: viewingUniversity.mobile,
						email: viewingUniversity.email,
						location: viewingUniversity.location,
						avatar: "/avatar.jpg",
						verified: "blue",
						online: viewingUniversity.online,
					}}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-4 relative">
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
				<div>
					<h1 className="text-white text-3xl font-semibold leading-tight">Uni Management</h1>
					<p className="text-white/85 text-sm mt-2">Manage all of your Agent and Agency here.</p>
				</div>
				<div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					<div className="relative min-w-[280px] lg:min-w-[420px]">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search"
							className="w-full bg-transparent border border-[#5A6280] text-white text-sm placeholder-white/70 px-4 py-4 pr-12 outline-none"
						/>
						<Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#25385C]" />
					</div>
					<button className="bg-[#F7941D] hover:bg-[#e28518] text-white text-sm px-6 py-4 font-medium inline-flex items-center justify-center gap-2 transition-colors">
						University Type
						<ChevronDown className="w-4 h-4" />
					</button>
						<button
							type="button"
							onClick={() => setShowAddUniversity(true)}
							className="bg-[#F7941D] hover:bg-[#e28518] text-white text-sm px-6 py-4 font-medium inline-flex items-center justify-center gap-2 transition-colors"
						>
                            <Plus className="w-4 h-4" />
                            Add University
                        </button>
				</div>
			</div>

			<div className="border border-[#6A708D] overflow-x-auto">
				<table className="min-w-[1220px] w-full bg-[#14123A]">
					<thead>
						<tr className="border-b border-[#6A708D]">
							<th className="px-6 py-5 text-white text-center text-sm font-semibold">Image</th>
							<th className="px-6 py-5 text-white text-center text-sm font-semibold">Name</th>
							<th className="px-6 py-5 text-white text-center text-sm font-semibold">Mobile Number</th>
							<th className="px-6 py-5 text-white text-center text-sm font-semibold">Email</th>
							<th className="px-6 py-5 text-white text-center text-sm font-semibold">Location</th>
							<th className="px-6 py-5 text-white text-center text-sm font-semibold">Action</th>
						</tr>
					</thead>
					<tbody>
						{paginatedRows.map((university) => (
							<tr key={university.id} className="border-t border-[#6A708D] text-white/95 text-sm">
								<td className="px-6 py-4">
									<div className="relative flex justify-center">
										<div
											className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
											style={{ backgroundColor: university.logoColor }}
										>
											{university.shortCode}
										</div>
										<span
											className={`absolute -bottom-0.5 right-[calc(50%-16px)] translate-x-4 w-2.5 h-2.5 rounded-full border border-white ${
												university.online ? "bg-[#32D74B]" : "bg-[#A0A0A0]"
											}`}
										/>
									</div>
								</td>
								<td className="px-6 py-4 text-center whitespace-nowrap">
									<div className="inline-flex items-center gap-1.5">
										{university.name}
										<span
											className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
												university.verified === "green" ? "bg-[#00D39B]" : "bg-[#FACC15]"
											}`}
										>
											<svg viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-[#161435]">
												<path
													fillRule="evenodd"
													d="M16.704 5.29a1 1 0 010 1.415l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 011.415-1.415l2.492 2.493 6.492-6.493a1 1 0 011.416 0z"
													clipRule="evenodd"
												/>
											</svg>
										</span>
									</div>
								</td>
								<td className="px-6 py-4 text-center whitespace-nowrap">{university.mobile}</td>
								<td className="px-6 py-4 text-center whitespace-nowrap">{university.email}</td>
								<td className="px-6 py-4 text-center whitespace-nowrap">{university.location}</td>
								<td className="px-6 py-4">
									<div className="flex items-center justify-center gap-2">
										<button
											type="button"
									onClick={() => setViewingUniversity(university)}
											className="w-7 h-7 rounded-lg bg-[#F7941D] hover:bg-[#e28518] flex items-center justify-center transition-colors"
											aria-label="View"
										>
											<Eye className="w-3.5 h-3.5 text-white" />
										</button>
										<button
											type="button"
											className="w-7 h-7 rounded-lg bg-[#3F5AE6] hover:bg-[#334bd0] flex items-center justify-center transition-colors"
											aria-label="Edit"
										>
											<Pencil className="w-3.5 h-3.5 text-white" />
										</button>
										<button
											type="button"
											className="w-7 h-7 rounded-lg bg-[#ED3941] hover:bg-[#d1323a] flex items-center justify-center transition-colors"
											aria-label="Delete"
										>
											<Trash2 className="w-3.5 h-3.5 text-white" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div className="flex items-center gap-2 text-white text-xs">
					<button
						type="button"
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
						disabled={currentPage === 1}
						className="w-7 h-7 rounded-lg border border-white/60 text-white inline-flex items-center justify-center disabled:opacity-40"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
					{pageNumbers.map((page, index) =>
						typeof page === "number" ? (
							<button
								type="button"
								key={`${page}-${index}`}
								onClick={() => setCurrentPage(page)}
								className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-medium ${
									page === currentPage ? "bg-[#F7941D] text-white" : "text-white/90"
								}`}
							>
								{page}
							</button>
						) : (
							<span key={`${page}-${index}`} className="px-1 text-white/80">
								{page}
							</span>
						),
					)}
					<button
						type="button"
						onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
						disabled={currentPage === totalPages}
						className="w-7 h-7 rounded-lg border border-white/60 text-white inline-flex items-center justify-center disabled:opacity-40"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>

				<div className="flex items-center gap-3">
					<span className="text-white/70 text-xs">
						Showing {startIndex + 1} to {Math.min(currentPage * entriesPerPage, TOTAL_ENTRIES)} of {TOTAL_ENTRIES} entries
					</span>
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowEntriesDropdown((prev) => !prev)}
							className="bg-[#F3F4F6] text-black text-xs px-3 py-1 rounded inline-flex items-center gap-2"
						>
							Show {entriesPerPage}
							<ChevronDown className="w-3 h-3" />
						</button>
						{showEntriesDropdown && (
							<div className="absolute right-0 mt-1 bg-white rounded shadow-md z-10 min-w-20 overflow-hidden">
								{ENTRIES_OPTIONS.map((option) => (
									<button
										type="button"
										key={option}
										onClick={() => {
											setEntriesPerPage(option);
											setCurrentPage(1);
											setShowEntriesDropdown(false);
										}}
										className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
									>
										{option}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{showAddUniversity && <AddUniversity onClose={() => setShowAddUniversity(false)} />}
		</div>
	);
};

export default UniManagementHome;
