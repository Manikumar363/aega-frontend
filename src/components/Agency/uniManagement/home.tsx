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
	X,
} from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import AddUniversity from "./addUniveristy";
import InfoView from "./info";
import { getUniversities, deleteUniversity, updateUniversity, type University } from "@/lib/api";

const ENTRIES_OPTIONS = [8, 16, 24];

const UniManagementHome: React.FC = () => {
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [showFilterDropdown, setShowFilterDropdown] = useState(false);
	const [entriesPerPage, setEntriesPerPage] = useState(8);
	const [currentPage, setCurrentPage] = useState(1);
	const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
	const [showAddUniversity, setShowAddUniversity] = useState(false);
	const [viewingUniversity, setViewingUniversity] = useState<University | null>(null);
	const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [editFormData, setEditFormData] = useState({ name: "", email: "", mobile: "", location: "" });
	const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
	const [universities, setUniversities] = useState<University[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch universities
	const fetchUniversities = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getUniversities();
			setUniversities(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch universities";
			setError(errorMessage);
			console.error("Error fetching universities:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUniversities();
	}, []);

	const filtered = useMemo(() => {
		let list = universities;
		if (filterStatus === "verified") {
			list = list.filter((item) => item.verified === "green");
		} else if (filterStatus === "pending") {
			list = list.filter((item) => item.verified === "yellow");
		} else if (filterStatus === "online") {
			list = list.filter((item) => item.online);
		}

		const query = search.trim().toLowerCase();
		if (!query) return list;

		return list.filter(
			(item) =>
				(item.name && item.name.toLowerCase().includes(query)) ||
				(item.email && item.email.toLowerCase().includes(query)) ||
				(item.location && item.location.toLowerCase().includes(query)),
		);
	}, [search, filterStatus, universities]);

	const totalEntries = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
	const startIndex = (currentPage - 1) * entriesPerPage;
	const paginatedRows = filtered.slice(startIndex, startIndex + entriesPerPage);

	const pageNumbers = useMemo(() => {
		const pages: (number | string)[] = [];
		const maxPagesToShow = 3;

		for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
			pages.push(i);
		}

		if (totalPages > maxPagesToShow) {
			pages.push("...");
			pages.push(totalPages);
		}

		return pages;
	}, [totalPages]);

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this university?")) return;
		try {
			setDeletingId(id);
			await deleteUniversity(id);
			toast.success("University deleted successfully");
			setUniversities((prev) => prev.filter((u) => u.id !== id));
		} catch (err: any) {
			toast.error(err.message || "Failed to delete university");
		} finally {
			setDeletingId(null);
		}
	};

	const openEditModal = (uni: University) => {
		setEditingUniversity(uni);
		setEditFormData({
			name: uni.name || "",
			email: uni.email || "",
			mobile: uni.mobile || "",
			location: uni.location || "",
		});
	};

	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingUniversity) return;
		try {
			setIsSubmittingEdit(true);
			const updated = await updateUniversity(editingUniversity.id, editFormData);
			toast.success("University updated successfully");
			setUniversities((prev) => prev.map((u) => (u.id === editingUniversity.id ? { ...u, ...editFormData, ...updated } : u)));
			setEditingUniversity(null);
		} catch (err: any) {
			toast.error(err.message || "Failed to update university");
		} finally {
			setIsSubmittingEdit(false);
		}
	};

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
						id: String(viewingUniversity.id),
						name: viewingUniversity.name,
						designation: viewingUniversity.location || "N/A",
						mobile: viewingUniversity.mobile || "N/A",
						email: viewingUniversity.email || "N/A",
						location: viewingUniversity.location || "N/A",
						avatar: viewingUniversity.avatar || viewingUniversity.logo || "/avatar.jpg",
						verified: viewingUniversity.verified === "green" ? "blue" : "orange",
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
					<p className="text-white/85 text-sm mt-2">Manage all of your universitys here</p>
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
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowFilterDropdown((prev) => !prev)}
							className="w-full bg-[#F7941D] hover:bg-[#e28518] text-white text-sm px-6 py-4 font-medium inline-flex items-center justify-center gap-2 transition-colors"
						>
							Filter ({filterStatus.toUpperCase()})
							<ChevronDown className="w-4 h-4" />
						</button>
						{showFilterDropdown && (
							<div className="absolute right-0 mt-1 bg-[#14123A] border border-[#5A6280] text-white rounded shadow-lg z-20 w-48">
								{[
									{ label: "All Universities", value: "all" },
									{ label: "Verified Only", value: "verified" },
									{ label: "Pending Verification", value: "pending" },
									{ label: "Online Now", value: "online" },
								].map((opt) => (
									<button
										key={opt.value}
										type="button"
										onClick={() => {
											setFilterStatus(opt.value);
											setShowFilterDropdown(false);
										}}
										className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#25385C] transition-colors ${
											filterStatus === opt.value ? "text-[#F7941D] font-bold" : "text-white/80"
										}`}
									>
										{opt.label}
									</button>
								))}
							</div>
						)}
					</div>
					<button
						type="button"
						onClick={() => setShowAddUniversity(true)}
						className="bg-[#F7941D] hover:bg-[#e28518] text-white text-sm px-6 py-4 font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
					>
						<Plus className="w-4 h-4" />
						Add University
					</button>
				</div>
			</div>

			{/* Error Banner */}
			{error && (
				<div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
					<p className="text-red-400">{error}</p>
				</div>
			)}

			{/* Loading State */}
			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7941D] mb-4"></div>
						<p className="text-white/70">Loading universities...</p>
					</div>
				</div>
			) : (
				<>
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
								{paginatedRows.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-12 text-center text-white/70">
											{universities.length === 0 ? "No universities found." : "No results match your search / filter."}
										</td>
									</tr>
								) : (
									paginatedRows.map((university) => (
										<tr key={university.id} className="border-t border-[#6A708D] text-white/95 text-sm">
											<td className="px-6 py-4">
												<div className="relative flex justify-center">
													{university.avatar || university.logo ? (
														<img
															src={university.avatar || university.logo}
															alt={university.name}
															className="w-8 h-8 rounded-full object-cover border border-white/20"
														/>
													) : (
														<div
															className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
															style={{ backgroundColor: university.logoColor }}
														>
															{university.shortCode}
														</div>
													)}
													<span
														className={`absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white ${
															university.online ? "bg-[#32D74B]" : "bg-[#A0A0A0]"
														}`}
													/>
												</div>
											</td>
											<td className="px-6 py-4 text-center whitespace-nowrap">
												<div className="inline-flex items-center gap-1.5">
													{university.name || "N/A"}
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
											<td className="px-6 py-4 text-center whitespace-nowrap">{university.mobile || "N/A"}</td>
											<td className="px-6 py-4 text-center whitespace-nowrap">{university.email || "N/A"}</td>
											<td className="px-6 py-4 text-center whitespace-nowrap">{university.location || "N/A"}</td>
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
														onClick={() => openEditModal(university)}
														className="w-7 h-7 rounded-lg bg-[#3F5AE6] hover:bg-[#334bd0] flex items-center justify-center transition-colors"
														aria-label="Edit"
													>
														<Pencil className="w-3.5 h-3.5 text-white" />
													</button>
													<button
														type="button"
														disabled={deletingId === university.id}
														onClick={() => handleDelete(university.id)}
														className="w-7 h-7 rounded-lg bg-[#ED3941] hover:bg-[#d1323a] flex items-center justify-center transition-colors disabled:opacity-50"
														aria-label="Delete"
													>
														<Trash2 className="w-3.5 h-3.5 text-white" />
													</button>
												</div>
											</td>
										</tr>
									))
								)}
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
								Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
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
				</>
			)}

			{/* Edit University Modal */}
			{editingUniversity && (
				<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
					<form onSubmit={handleEditSubmit} className="w-full max-w-lg bg-[#14123A] border border-[#2E325D] p-6 space-y-4 rounded-lg relative text-white">
						<button
							type="button"
							onClick={() => setEditingUniversity(null)}
							className="absolute top-4 right-4 text-white/70 hover:text-white"
						>
							<X className="w-5 h-5" />
						</button>
						<h2 className="text-xl font-bold border-b border-[#2C2A45] pb-2">Edit University Profile</h2>
						<div>
							<label className="block text-sm mb-1 text-white/80">University Name</label>
							<input
								type="text"
								value={editFormData.name}
								onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
								required
								className="w-full bg-[#181537] border border-[#3E4268] text-white text-sm px-3 py-2 outline-none rounded"
							/>
						</div>
						<div>
							<label className="block text-sm mb-1 text-white/80">Email</label>
							<input
								type="email"
								value={editFormData.email}
								onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
								className="w-full bg-[#181537] border border-[#3E4268] text-white text-sm px-3 py-2 outline-none rounded"
							/>
						</div>
						<div>
							<label className="block text-sm mb-1 text-white/80">Mobile Number</label>
							<input
								type="text"
								value={editFormData.mobile}
								onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
								className="w-full bg-[#181537] border border-[#3E4268] text-white text-sm px-3 py-2 outline-none rounded"
							/>
						</div>
						<div>
							<label className="block text-sm mb-1 text-white/80">Location</label>
							<input
								type="text"
								value={editFormData.location}
								onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
								className="w-full bg-[#181537] border border-[#3E4268] text-white text-sm px-3 py-2 outline-none rounded"
							/>
						</div>
						<div className="flex justify-end gap-3 pt-2">
							<button
								type="button"
								onClick={() => setEditingUniversity(null)}
								className="px-4 py-2 text-sm border border-white/30 text-white rounded hover:bg-white/10"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmittingEdit}
								className="px-5 py-2 text-sm bg-[#F7941D] hover:bg-[#e28518] text-white rounded font-medium disabled:opacity-50"
							>
								{isSubmittingEdit ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</form>
				</div>
			)}

			{showAddUniversity && (
				<AddUniversity
					onClose={() => {
						setShowAddUniversity(false);
						fetchUniversities();
					}}
				/>
			)}
		</div>
	);
};

export default UniManagementHome;
