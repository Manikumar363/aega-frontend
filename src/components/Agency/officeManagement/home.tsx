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
import AddOffice from "./addOffice";
import InfoView from "./info";

type Office = {
	id: number;
	location: string;
	address: string;
	mobile: string;
	email: string;
	employees: number;
};

const offices: Office[] = [
	{ id: 1, location: "Hyderabad 1", address: "Salarpuria Cyber Park, Plot no 67", mobile: "5506556340", email: "loc@gmail.com", employees: 50 },
	{ id: 2, location: "Hyderabad 2", address: "Serilingampalli, Phase-3", mobile: "9876543210", email: "loc@gmail.com", employees: 29 },
	{ id: 3, location: "Bangalore 1", address: "India Development Centre", mobile: "6543217890", email: "loc@gmail.com", employees: 36 },
	{ id: 4, location: "Bangalore 2", address: "Bagmane Laurel, Krishnappa Garden", mobile: "7890123456", email: "loc@gmail.com", employees: 48 },
	{ id: 5, location: "Noida", address: "Lotus Business Park", mobile: "1234567890", email: "loc@gmail.com", employees: 43 },
	{ id: 6, location: "Mumbai 1", address: "Bandra Kurla Complex", mobile: "9123456780", email: "loc@gmail.com", employees: 61 },
	{ id: 7, location: "Mumbai 2", address: "Andheri East, MIDC", mobile: "9234567801", email: "loc@gmail.com", employees: 38 },
	{ id: 8, location: "Chennai", address: "Tidel Park, Taramani", mobile: "9345678012", email: "loc@gmail.com", employees: 27 },
	{ id: 9, location: "Pune", address: "Magarpatta City", mobile: "9456780123", email: "loc@gmail.com", employees: 55 },
	{ id: 10, location: "Delhi", address: "Connaught Place", mobile: "9567801234", email: "loc@gmail.com", employees: 72 },
];

const PAGE_SIZE = 8;

const OfficeManagementHome: React.FC = () => {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [showAddOffice, setShowAddOffice] = useState(false);
	const [viewingOffice, setViewingOffice] = useState<Office | null>(null);

	const filtered = useMemo(
		() =>
			offices.filter(
				(o) =>
					o.location.toLowerCase().includes(search.toLowerCase()) ||
					o.address.toLowerCase().includes(search.toLowerCase())
			),
		[search]
	);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

	const pageNumbers: (number | "...")[] = [];
	if (totalPages <= 5) {
		for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
	} else {
		pageNumbers.push(1, 2, 3, "...", totalPages);
	}

	if (viewingOffice) {
		return (
			<div className="space-y-4">
				<button
					onClick={() => setViewingOffice(null)}
					className="px-4 py-2 rounded border border-[#2D2A50] text-white text-sm hover:bg-[#14123A] transition-colors"
				>
					← Back to offices
				</button>
				<InfoView
					agent={{
						id: viewingOffice.id,
						name: viewingOffice.location,
						designation: "Office",
						mobile: viewingOffice.mobile,
						email: viewingOffice.email,
						location: viewingOffice.address,
						avatar: "",
						verified: "orange",
						online: true,
					}}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex items-center gap-3 justify-center">
                <div>
					<h1 className="text-white text-3xl font-semibold leading-tight">Office Management</h1>
					<p className="text-white/85 text-sm mt-2">Manage all of your offices here.</p>
				</div>
				<div className="relative w-full max-w-2xl">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search"
						value={search}
						onChange={(e) => { setSearch(e.target.value); setPage(1); }}
						className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none text-sm"
					/>
				</div>
				<button className="flex items-center gap-2 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2.5 rounded text-sm font-medium whitespace-nowrap transition-colors">
					Office Type <ChevronDown className="w-4 h-4" />
				</button>
				<button
					onClick={() => setShowAddOffice(true)}
					className="flex items-center gap-2 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2.5 rounded text-sm font-medium whitespace-nowrap transition-colors"
				>
					<Plus className="w-4 h-4" /> Add Office
				</button>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full min-w-[900px] border-collapse text-sm">
					<thead>
						<tr className="bg-[#14123A] text-white">
							{["Location", "Address", "Mobile Number", "Email", "Employee", "Action"].map((h) => (
								<th key={h} className="px-5 py-4 text-center font-semibold border border-[#2D2A50]">
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{paginated.map((office) => (
							<tr key={office.id} className="bg-[#0F0D2B] text-white hover:bg-[#14123A] transition-colors">
								<td className="px-5 py-4 text-center border border-[#2D2A50]">{office.location}</td>
								<td className="px-5 py-4 text-center border border-[#2D2A50]">{office.address}</td>
								<td className="px-5 py-4 text-center border border-[#2D2A50]">{office.mobile}</td>
								<td className="px-5 py-4 text-center border border-[#2D2A50]">{office.email}</td>
								<td className="px-5 py-4 text-center border border-[#2D2A50]">{office.employees}</td>
								<td className="px-5 py-4 text-center border border-[#2D2A50]">
									<div className="flex items-center justify-center gap-2">
										<button
											type="button"
											onClick={() => setViewingOffice(office)}
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

			{/* Pagination */}
			<div className="flex items-center justify-between mt-4 text-sm text-white">
				<div className="flex items-center gap-1">
					<button
						onClick={() => goTo(page - 1)}
						disabled={page === 1}
						className="p-1.5 rounded border border-[#2D2A50] disabled:opacity-40 hover:bg-[#14123A] transition-colors"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
					{pageNumbers.map((p, i) =>
						p === "..." ? (
							<span key={i} className="px-2 text-gray-400">...</span>
						) : (
							<button
								key={i}
								onClick={() => goTo(p as number)}
								className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
									page === p
										? "bg-[#F68E2D] text-white"
										: "border border-[#2D2A50] hover:bg-[#14123A] text-white"
								}`}
							>
								{p}
							</button>
						)
					)}
					<button
						onClick={() => goTo(page + 1)}
						disabled={page === totalPages}
						className="p-1.5 rounded border border-[#2D2A50] disabled:opacity-40 hover:bg-[#14123A] transition-colors"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
				<div className="flex items-center gap-2 text-gray-400 text-xs">
					<span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries</span>
					<button className="flex items-center gap-1 border border-[#2D2A50] px-3 py-1 rounded hover:bg-[#14123A] transition-colors">
						Show {PAGE_SIZE} <ChevronDown className="w-3 h-3" />
					</button>
				</div>
			</div>

			{showAddOffice && <AddOffice onClose={() => setShowAddOffice(false)} />}
		</div>
	);
};

export default OfficeManagementHome;
