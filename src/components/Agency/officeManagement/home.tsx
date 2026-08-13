"use client";

import {
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
	numberOfEmployees?: number;
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

			const response = await fetch(
				apiUrl,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch offices");
			}

			const responseData = await response.json();
			let data: ApiOfficeResponse[] = [];
			if (Array.isArray(responseData)) {
				data = responseData;
			} else if (responseData.offices && Array.isArray(responseData.offices)) {
				data = responseData.offices;
			} else if (responseData.data && Array.isArray(responseData.data)) {
				data = responseData.data;
			}

			const transformedOffices: Office[] = data.map((office) => ({
				id: office._id,
				location: office.location,
				address: office.fullAddress,
				mobile: office.mobileNumber,
				email: office.email,
				employees: typeof office.numberOfEmployees === "number" ? office.numberOfEmployees : (Array.isArray(office.employees) ? office.employees.length : 0),
			}));

			setOffices(transformedOffices);
		} catch (error) {
			console.error("Error fetching offices:", error);
			toast.error("Failed to load offices");
			setOffices([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOffices();
	}, [fetchOffices]);

	const handleEditOffice = (office: Office) => {
		setEditingId(office.id);
		setEditData({
			location: office.location,
			address: office.address,
			mobile: office.mobile,
			email: office.email,
		});
	};

	const handleSaveEdit = async () => {
		if (!editingId || !editData) return;

		if (!editData.location.trim() || !editData.address.trim() || !editData.mobile.trim() || !editData.email.trim()) {
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
				throw new Error("Failed to update office");
			}

			toast.success("Office updated successfully");
			setEditingId(null);
			setEditData(null);
			fetchOffices();
		} catch (error) {
			console.error("Error updating office:", error);
			toast.error("Failed to update office");
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
				throw new Error("Failed to delete office");
			}

			setOffices((prev) => prev.filter((o) => o.id !== deleteOfficeId));
			setDeleteDialogOpen(false);
			setDeleteOfficeId(null);
			setDeleteOfficeName("");
			toast.success("Office deleted successfully");
		} catch (error) {
			console.error("Error deleting office:", error);
			toast.error("Failed to delete office");
		} finally {
			setIsDeleting(false);
		}
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditData(null);
	};

	// Search Filter matching Location, Address, Email ID AND Mobile Number
	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return offices;
		return offices.filter(
			(o) =>
				(o.location && o.location.toLowerCase().includes(q)) ||
				(o.address && o.address.toLowerCase().includes(q)) ||
				(o.email && o.email.toLowerCase().includes(q)) ||
				(o.mobile && o.mobile.toLowerCase().includes(q))
		);
	}, [offices, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	if (viewingOffice) {
		return (
			<div className="space-y-4">
				<button
					onClick={() => setViewingOffice(null)}
					className="px-4 py-2 rounded border border-[#2D2A50] text-white text-sm hover:bg-[#14123A] transition-colors cursor-pointer"
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
		<div className="space-y-4 text-white">
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
				<div>
					<h1 className="text-3xl font-semibold leading-tight">Office Management</h1>
					<p className="text-white/85 text-sm mt-1">Manage all of your offices here.</p>
				</div>

				<div className="flex items-center gap-3 w-full sm:w-auto">
					{/* Search Input */}
					<div className="relative w-full sm:w-80">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search by location, address, email or mobile..."
							value={search}
							onChange={(e) => { setSearch(e.target.value); setPage(1); }}
							className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 border border-gray-300 rounded text-xs outline-none"
						/>
					</div>

					<button
						onClick={() => setShowAddOffice(true)}
						className="flex items-center gap-2 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-5 py-2 rounded text-xs font-bold uppercase transition-colors shrink-0 cursor-pointer"
					>
						<Plus className="w-4 h-4" /> Add Office
					</button>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto bg-[#14123A] border border-[#2D2A50] rounded-xl">
				<table className="w-full min-w-[900px] border-collapse text-sm text-left">
					<thead>
						<tr className="bg-[#0A0724] border-b border-[#2D2A50] text-gray-300 font-bold uppercase text-xs">
							<th className="px-5 py-4">Location</th>
							<th className="px-5 py-4">Address</th>
							<th className="px-5 py-4">Mobile Number</th>
							<th className="px-5 py-4">Email</th>
							<th className="px-5 py-4 text-center">Employees</th>
							<th className="px-5 py-4 text-center">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#2D2A50]/60">
						{paginated.length > 0 ? (
							paginated.map((office) => (
								<tr key={office.id} className="hover:bg-[#1A163E] transition-colors text-xs">
									<td className="px-5 py-4 font-semibold text-white">
										{editingId === office.id ? (
											<input
												type="text"
												value={editData?.location || ""}
												onChange={(e) => setEditData((prev) => prev ? ({ ...prev, location: e.target.value }) : null)}
												className="bg-[#0A0724] border border-gray-600 rounded px-2 py-1 text-white text-xs w-full outline-none"
											/>
										) : (
											office.location
										)}
									</td>

									<td className="px-5 py-4 text-gray-300">
										{editingId === office.id ? (
											<input
												type="text"
												value={editData?.address || ""}
												onChange={(e) => setEditData((prev) => prev ? ({ ...prev, address: e.target.value }) : null)}
												className="bg-[#0A0724] border border-gray-600 rounded px-2 py-1 text-white text-xs w-full outline-none"
											/>
										) : (
											office.address
										)}
									</td>

									<td className="px-5 py-4 text-gray-300">
										{editingId === office.id ? (
											<input
												type="text"
												value={editData?.mobile || ""}
												onChange={(e) => {
													const val = e.target.value.replace(/[^0-9+\s-]/g, '');
													setEditData((prev) => prev ? ({ ...prev, mobile: val }) : null);
												}}
												className="bg-[#0A0724] border border-gray-600 rounded px-2 py-1 text-white text-xs w-full outline-none"
											/>
										) : (
											office.mobile
										)}
									</td>

									<td className="px-5 py-4 text-gray-300">
										{editingId === office.id ? (
											<input
												type="email"
												value={editData?.email || ""}
												onChange={(e) => {
													const val = e.target.value.trim();
													setEditData((prev) => prev ? ({ ...prev, email: val }) : null);
												}}
												className="bg-[#0A0724] border border-gray-600 rounded px-2 py-1 text-white text-xs w-full outline-none"
											/>
										) : (
											office.email
										)}
									</td>

									<td className="px-5 py-4 text-center font-bold text-[#F68E2D]">
										{office.employees}
									</td>

									<td className="px-5 py-4 text-center">
										{editingId === office.id ? (
											<div className="flex items-center justify-center gap-2">
												<button
													onClick={handleSaveEdit}
													disabled={isSaving}
													className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer"
												>
													Save
												</button>
												<button
													onClick={cancelEdit}
													className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-bold cursor-pointer"
												>
													Cancel
												</button>
											</div>
										) : (
											<div className="flex items-center justify-center gap-2">
												<button
													onClick={() => setViewingOffice(office)}
													title="View Office"
													className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
												>
													<Eye className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleEditOffice(office)}
													title="Edit Office"
													className="p-1.5 bg-blue-900/40 hover:bg-blue-800 text-blue-300 rounded transition-colors cursor-pointer"
												>
													<Pencil className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDeleteClick(office)}
													title="Delete Office"
													className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded transition-colors cursor-pointer"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className="px-5 py-12 text-center text-gray-400 font-medium">
									No offices found matching your search.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Modal Add Office */}
			{showAddOffice && (
				<AddOffice
					onClose={() => setShowAddOffice(false)}
					onOfficeAdded={() => {
						fetchOffices();
						setShowAddOffice(false);
					}}
				/>
			)}

			{/* Delete Modal */}
			{deleteDialogOpen && (
				<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
					<div className="bg-[#14123A] border border-[#2E325D] p-6 max-w-sm w-full text-center space-y-4 rounded-xl">
						<h3 className="text-lg font-bold text-red-400">Delete Office?</h3>
						<p className="text-xs text-gray-300">
							Are you sure you want to delete office in <span className="font-bold text-white">{deleteOfficeName}</span>?
						</p>
						<div className="flex justify-center gap-3 pt-2">
							<button
								onClick={() => setDeleteDialogOpen(false)}
								className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold cursor-pointer"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								disabled={isDeleting}
								className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OfficeManagementHome;
