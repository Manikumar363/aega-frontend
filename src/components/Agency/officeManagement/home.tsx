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
import React, { useMemo, useState, useEffect, useCallback } from "react";
import AddOffice from "./addOffice";
import InfoView from "./info";
import toast from "react-hot-toast";

type Office = {
	id: string;
	location: string;
	address: string;
	mobile: string;
	email: string;
	employees: number;
};

type ApiOfficeResponse = {
	_id: string;
	agentId: string;
	location: string;
	fullAddress: string;
	email: string;
	mobileNumber: string;
	employees: any[];
	createdAt: string;
	updatedAt: string;
	__v: number;
};

const PAGE_SIZE = 8;

const OfficeManagementHome: React.FC = () => {
	const [offices, setOffices] = useState<Office[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [showAddOffice, setShowAddOffice] = useState(false);
	const [viewingOffice, setViewingOffice] = useState<Office | null>(null);
	
	// Edit states
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editData, setEditData] = useState<Omit<Office, "id" | "employees"> | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	
	// Delete states
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteOfficeId, setDeleteOfficeId] = useState<string | null>(null);
	const [deleteOfficeName, setDeleteOfficeName] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchOffices = useCallback(async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("authToken");
			const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offices`;
			console.log("Fetching from URL:", apiUrl);
			console.log("Auth token:", token ? "Present" : "Missing");
			
			const response = await fetch(
				apiUrl,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Response status:", response.status, response.statusText);

			if (!response.ok) {
				throw new Error("Failed to fetch offices");
			}

			const responseData = await response.json();
			console.log("Raw API response:", responseData);

			// Handle different response formats
			let data: ApiOfficeResponse[] = [];
			if (Array.isArray(responseData)) {
				data = responseData;
			} else if (responseData.offices && Array.isArray(responseData.offices)) {
				data = responseData.offices;
			} else if (responseData.data && Array.isArray(responseData.data)) {
				data = responseData.data;
			}

			console.log("Parsed data:", data);

			// Transform API response to component format
			const transformedOffices: Office[] = data.map((office) => ({
				id: office._id,
				location: office.location,
				address: office.fullAddress,
				mobile: office.mobileNumber,
				email: office.email,
				employees: Array.isArray(office.employees) ? office.employees.length : 0,
			}));

			console.log("Transformed offices:", transformedOffices);

			setOffices(transformedOffices);
			console.log("Offices state updated. Current offices count:", transformedOffices.length);
		} catch (error) {
			console.error("Error fetching offices:", error);
			toast.error("Failed to load offices");
			setOffices([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		console.log("OfficeManagementHome component mounted, fetching offices...");
		fetchOffices();
	}, []);

	// Log state changes for debugging
	useEffect(() => {
		console.log("Offices state changed:", offices.length, "offices");
	}, [offices]);

	const handleEditOffice = (office: Office) => {
		setEditingId(office.id);
		setEditData({
			location: office.location,
			address: office.address,
			mobile: office.mobile,
			email: office.email,
		});
	};

	const handleUpdateOffice = async () => {
		if (!editData || !editingId) return;

		if (!editData.location.trim() || !editData.address.trim() || !editData.email.trim() || !editData.mobile.trim()) {
			toast.error("All fields are required");
			return;
		}

		setIsSaving(true);
		try {
			const token = localStorage.getItem("authToken");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offices/${editingId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						location: editData.location,
						fullAddress: editData.address,
						email: editData.email,
						mobileNumber: editData.mobile,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to update office");
			}

			// Update the office in the list
			setOffices((prev) =>
				prev.map((o) =>
					o.id === editingId
						? {
							...o,
							location: editData.location,
							address: editData.address,
							email: editData.email,
							mobile: editData.mobile,
						}
						: o
				)
			);

			setEditingId(null);
			setEditData(null);
			toast.success("Office updated successfully");
		} catch (error) {
			console.error("Error updating office:", error);
			toast.error(error instanceof Error ? error.message : "Failed to update office");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteClick = (office: Office) => {
		setDeleteOfficeId(office.id);
		setDeleteOfficeName(office.location);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!deleteOfficeId) return;

		setIsDeleting(true);
		try {
			const token = localStorage.getItem("authToken");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offices/${deleteOfficeId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to delete office");
			}

			// Remove the office from the list
			setOffices((prev) => prev.filter((o) => o.id !== deleteOfficeId));
			setDeleteDialogOpen(false);
			setDeleteOfficeId(null);
			setDeleteOfficeName("");
			toast.success("Office deleted successfully");
		} catch (error) {
			console.error("Error deleting office:", error);
			toast.error(error instanceof Error ? error.message : "Failed to delete office");
		} finally {
			setIsDeleting(false);
		}
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditData(null);
	};

	const filtered = useMemo(
		() => {
			const result = offices.filter(
				(o) =>
					o.location.toLowerCase().includes(search.toLowerCase()) ||
					o.address.toLowerCase().includes(search.toLowerCase())
			);
			console.log("Filtered results:", result.length, "offices");
			return result;
		},
		[offices, search]
	);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	console.log("Pagination info - Total pages:", totalPages, "Current page:", page, "Paginated items:", paginated.length);

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
				<InfoView officeId={viewingOffice.id} />
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-white text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F68E2D]"></div>
					<p className="mt-4">Loading offices...</p>
				</div>
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
						{paginated.length > 0 ? (
							paginated.map((office) => (
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
												onClick={() => handleEditOffice(office)}
												className="w-7 h-7 rounded-lg bg-[#3F5AE6] hover:bg-[#334bd0] flex items-center justify-center transition-colors"
												aria-label="Edit"
											>
												<Pencil className="w-3.5 h-3.5 text-white" />
											</button>
											<button
												type="button"
												onClick={() => handleDeleteClick(office)}
												className="w-7 h-7 rounded-lg bg-[#ED3941] hover:bg-[#d1323a] flex items-center justify-center transition-colors"
												aria-label="Delete"
											>
												<Trash2 className="w-3.5 h-3.5 text-white" />
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className="px-5 py-12 text-center border border-[#2D2A50] text-white/60">
									No offices found
								</td>
							</tr>
						)}
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

			{/* Edit Modal */}
			{editingId && editData && (
				<div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
					<div className="w-full max-w-2xl bg-[#14123A] border border-[#2E325D] p-4 sm:p-6 rounded-lg">
						<h2 className="text-white text-2xl font-semibold mb-6">Edit Office</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-white text-base mb-2">
									Location <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={editData.location}
									onChange={(e) => setEditData({ ...editData, location: e.target.value })}
									placeholder="Location"
									disabled={isSaving}
									className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</div>

							<div>
								<label className="block text-white text-base mb-2">
									Full Address <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={editData.address}
									onChange={(e) => setEditData({ ...editData, address: e.target.value })}
									placeholder="Address"
									disabled={isSaving}
									className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-white text-base mb-2">
										Email ID <span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										value={editData.email}
										onChange={(e) => setEditData({ ...editData, email: e.target.value })}
										placeholder="loc@gmail.com"
										disabled={isSaving}
										className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
									/>
								</div>
								<div>
									<label className="block text-white text-base mb-2">
										Mobile Number <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={editData.mobile}
										onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
										placeholder="+1123 589 6740"
										disabled={isSaving}
										className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
									/>
								</div>
							</div>
						</div>

						<div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
							<button
								onClick={cancelEdit}
								disabled={isSaving}
								className="w-full sm:w-52 bg-[#E5E7EB] hover:bg-[#d9dbe0] text-[#8C95A0] text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								onClick={handleUpdateOffice}
								disabled={isSaving}
								className="w-full sm:w-52 bg-[#F7941D] hover:bg-[#e28518] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSaving ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			{deleteDialogOpen && (
				<div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
					<div className="w-full max-w-md bg-[#14123A] border border-[#2E325D] p-6 rounded-lg">
						<h2 className="text-white text-xl font-semibold mb-4">Delete Office</h2>
						<p className="text-white/80 mb-2">
							Are you sure you want to delete <span className="font-semibold">{deleteOfficeName}</span>?
						</p>
						<p className="text-red-400 text-sm mb-6">This action cannot be undone.</p>

						<div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
							<button
								onClick={() => setDeleteDialogOpen(false)}
								disabled={isDeleting}
								className="flex-1 bg-[#E5E7EB] hover:bg-[#d9dbe0] text-[#8C95A0] text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								disabled={isDeleting}
								className="flex-1 bg-[#ED3941] hover:bg-[#d1323a] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{showAddOffice && <AddOffice onClose={() => setShowAddOffice(false)} onOfficeAdded={fetchOffices} />}
		</div>
	);
};

export default OfficeManagementHome;
