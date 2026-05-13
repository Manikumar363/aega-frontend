import { Eye, Pencil, Plus, Trash2, X, GripVertical } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type PreferenceItem = {
	id: string;
	name: string;
	courseName: string;
	eligibilityStatus: "Hostile" | "Eligible" | "None";
	applicationStatus: "On-Going" | "Conditional Offer" | "Accepted" | "Rejected";
	shortCode: string;
	logoColor: string;
	location?: string;
	intake?: string;
	intakeDate?: string;
	startDate?: string;
	endDate?: string;
	tuitionFee?: string;
	termFee?: string;
	logoUrl?: string;
};

type PreferencesProps = {
	studentId: string;
};

type ApiPreferenceResponse = {
	_id: string;
	universityName: string;
	courseName: string;
	region: string;
	country: string;
	location?: string;
	eligibilityStatus: "Hostile" | "Eligible" | "None";
	applicationStatus: "On-Going" | "Conditional Offer" | "Accepted" | "Rejected";
	intakeDate?: string;
	startDate?: string;
	endDate?: string;
	tuitionFee?: string;
	firstTermFee?: string;
	logoUrl?: string;
	universityEmail?: string;
	createdAt?: string;
	updatedAt?: string;
};

const logoColors = [
	"#5A2EA6",
	"#1F2937",
	"#D9363E",
	"#0E7490",
	"#DC2626",
	"#1D4ED8",
	"#BE123C",
	"#B91C1C",
	"#0369A1",
	"#7C3AED",
];

const getShortCode = (universityName: string): string => {
	return universityName
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 3);
};

const getLogoColor = (index: number): string => {
	return logoColors[index % logoColors.length];
};

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

const Preferences: React.FC<PreferencesProps> = ({ studentId }) => {
	const router = useRouter();
	const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editData, setEditData] = useState<PreferenceItem | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletePreferenceId, setDeletePreferenceId] = useState<string | null>(null);
	const [deletePreferenceName, setDeletePreferenceName] = useState<string>("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [draggedItem, setDraggedItem] = useState<string | null>(null);
	const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null);
	const [isReordering, setIsReordering] = useState(false);

	useEffect(() => {
		const fetchPreferences = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("authToken");
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}/preferences`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch preferences");
				}

				const data: ApiPreferenceResponse[] = await response.json();
				
				// Transform API response to component format
				const transformedPreferences: PreferenceItem[] = data.map((pref, index) => ({
					id: pref._id,
					name: pref.universityName,
					courseName: pref.courseName,
					eligibilityStatus: pref.eligibilityStatus,
					applicationStatus: pref.applicationStatus,
					shortCode: getShortCode(pref.universityName),
					logoColor: getLogoColor(index),
					location: pref.location || `${pref.region}, ${pref.country}`,
					intake: pref.intakeDate,
					intakeDate: pref.intakeDate,
					startDate: pref.startDate,
					endDate: pref.endDate,
					tuitionFee: pref.tuitionFee,
					termFee: pref.firstTermFee,
					logoUrl: pref.logoUrl,
				}));

				setPreferences(transformedPreferences);
			} catch (error) {
				console.error("Error fetching preferences:", error);
				toast.error("Failed to load preferences");
				setPreferences([]);
			} finally {
				setLoading(false);
			}
		};

		if (studentId) {
			fetchPreferences();
		}
	}, [studentId]);

	const handleViewPreference = (id: string) => {
		router.push(`/agent/student-management/preference/${id}`);
	};

	const handleEditPreference = (item: PreferenceItem) => {
		setEditingId(item.id);
		setEditData({ ...item });
		setIsEditing(true);
	};

	const handleDiscardEdit = () => {
		setEditingId(null);
		setEditData(null);
		setIsEditing(false);
	};

	const handleUpdatePreference = async () => {
		if (!editData || !editingId) return;

		setIsSaving(true);
		try {
			const token = localStorage.getItem("authToken");
			const payload = {
				applicationStatus: editData.applicationStatus,
				eligibilityStatus: editData.eligibilityStatus,
				courseName: editData.courseName,
				startDate: editData.startDate,
				endDate: editData.endDate,
				intakeDate: editData.intakeDate,
				tuitionFee: editData.tuitionFee,
				termFee: editData.termFee,
			};

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}/preferences/${editingId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to update preference");
			}

			const result = await response.json();

			// Update the preferences list with the new data
			setPreferences(
				preferences.map((pref) =>
					pref.id === editingId
						? {
								...pref,
								applicationStatus: result.preference.applicationStatus,
								eligibilityStatus: result.preference.eligibilityStatus,
								courseName: result.preference.courseName,
								startDate: result.preference.startDate,
								endDate: result.preference.endDate,
								intakeDate: result.preference.intakeDate,
								tuitionFee: result.preference.tuitionFee,
								termFee: result.preference.firstTermFee,
						  }
						: pref
				)
			);

			setEditingId(null);
			setEditData(null);
			setIsEditing(false);
			toast.success("Preference updated successfully!");
		} catch (error) {
			console.error("Error updating preference:", error);
			toast.error(error instanceof Error ? error.message : "Failed to update preference");
		} finally {
			setIsSaving(false);
		}
	};

	const handleEditFieldChange = (field: keyof PreferenceItem, value: any) => {
		if (editData) {
			setEditData({ ...editData, [field]: value });
		}
	};

	const openDeleteDialog = (id: string, name: string) => {
		setDeletePreferenceId(id);
		setDeletePreferenceName(name);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!deletePreferenceId) return;

		setIsDeleting(true);
		try {
			const token = localStorage.getItem("authToken");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}/preferences/${deletePreferenceId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to delete preference");
			}

			setPreferences(preferences.filter((pref) => pref.id !== deletePreferenceId));
			setDeleteDialogOpen(false);
			setDeletePreferenceId(null);
			setDeletePreferenceName("");
			toast.success("Preference deleted successfully!");
		} catch (error) {
			console.error("Error deleting preference:", error);
			toast.error(error instanceof Error ? error.message : "Failed to delete preference");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setDeletePreferenceId(null);
		setDeletePreferenceName("");
	};

	const handleDragStart = (e: React.DragEvent, itemId: string) => {
		setDraggedItem(itemId);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent, itemId: string) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDraggedOverItem(itemId);
	};

	const handleDragLeave = () => {
		setDraggedOverItem(null);
	};

	const handleDrop = async (e: React.DragEvent, targetItemId: string) => {
		e.preventDefault();
		
		if (!draggedItem || draggedItem === targetItemId) {
			setDraggedItem(null);
			setDraggedOverItem(null);
			return;
		}

		const fromIndex = preferences.findIndex((p) => p.id === draggedItem);
		const toIndex = preferences.findIndex((p) => p.id === targetItemId);

		if (fromIndex === -1 || toIndex === -1) {
			setDraggedItem(null);
			setDraggedOverItem(null);
			return;
		}

		setIsReordering(true);
		try {
			const token = localStorage.getItem("authToken");
			
			if (!token) {
				throw new Error("Authentication token not found");
			}

			const payload = {
				id: draggedItem,
				from: fromIndex + 1,  // Convert to 1-based index
				to: toIndex + 1,      // Convert to 1-based index
			};

			console.log("Reorder payload:", payload);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}/preferences/reorder`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				let errorMessage = "Failed to reorder preferences";
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorMessage;
				} catch (e) {
					// If response is not JSON, use status text
					errorMessage = response.statusText || errorMessage;
				}
				throw new Error(errorMessage);
			}

			const result = await response.json();

			// Validate that we got preferences in response
			if (!result.preferences || !Array.isArray(result.preferences)) {
				throw new Error("Invalid response format from server");
			}

			// Transform API response to component format
			const transformedPreferences: PreferenceItem[] = result.preferences.map((pref: ApiPreferenceResponse, index: number) => ({
				id: pref._id,
				name: pref.universityName,
				courseName: pref.courseName,
				eligibilityStatus: pref.eligibilityStatus,
				applicationStatus: pref.applicationStatus,
				shortCode: getShortCode(pref.universityName),
				logoColor: getLogoColor(index),
				location: pref.location || `${pref.region}, ${pref.country}`,
				intake: pref.intakeDate,
				intakeDate: pref.intakeDate,
				startDate: pref.startDate,
				endDate: pref.endDate,
				tuitionFee: pref.tuitionFee,
				termFee: pref.firstTermFee,
				logoUrl: pref.logoUrl,
			}));

			setPreferences(transformedPreferences);
			toast.success("Preferences reordered successfully!");
		} catch (error) {
			console.error("Error reordering preferences:", error);
			toast.error(error instanceof Error ? error.message : "Failed to reorder preferences");
		} finally {
			setIsReordering(false);
			setDraggedItem(null);
			setDraggedOverItem(null);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-white text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68E2D]"></div>
					<p className="mt-3">Loading preferences...</p>
				</div>
			</div>
		);
	}

	if (preferences.length === 0) {
		return (
			<div className="border border-[#2D2A50] bg-[#0F0D2B] p-8 text-center">
				<p className="text-white/60">No preferences found for this student.</p>
			</div>
		);
	}

	return (
		<>
			<div className="border border-[#2D2A50] bg-[#0F0D2B] overflow-x-auto">
				<table className="min-w-[980px] w-full">
				<thead>
					<tr className="border-b border-[#3A3760] text-white/90 text-sm">
						<th className="px-4 py-4 text-center font-semibold w-12">Reorder</th>
						<th className="px-4 py-4 text-center font-semibold">Image</th>
						<th className="px-4 py-4 text-center font-semibold">Name</th>
						<th className="px-4 py-4 text-center font-semibold">Course Name</th>
						<th className="px-4 py-4 text-center font-semibold">Eligibility Status</th>
						<th className="px-4 py-4 text-center font-semibold">Application Status</th>
						<th className="px-4 py-4 text-center font-semibold">Action</th>
					</tr>
				</thead>
				<tbody>
					{preferences.map((item) => (
						<tr 
							key={item.id} 
							draggable
							onDragStart={(e) => handleDragStart(e, item.id)}
							onDragOver={(e) => handleDragOver(e, item.id)}
							onDragLeave={handleDragLeave}
							onDrop={(e) => handleDrop(e, item.id)}
							className={`border-t border-[#3A3760] text-white text-sm transition-colors cursor-move ${
								draggedItem === item.id ? "opacity-50 bg-[#1a1640]" : ""
							} ${
								draggedOverItem === item.id && draggedItem !== item.id
									? "bg-[#2D2A50] border-b-2 border-[#F68E2D]"
									: ""
							} ${isReordering ? "pointer-events-none opacity-75" : ""}`}
						>
							<td className="px-4 py-3 text-center">
								<GripVertical className="w-4 h-4 text-gray-400 mx-auto" />
							</td>
							<td className="px-4 py-3">
								<div className="flex justify-center">
									{item.logoUrl ? (
										<img
											src={item.logoUrl}
											alt={item.name}
											className="w-8 h-8 rounded-full object-cover border border-gray-600"
										/>
									) : (
										<div
											className="w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
											style={{ backgroundColor: item.logoColor }}
										>
											{item.shortCode}
										</div>
									)}
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
									<button 
										onClick={() => handleViewPreference(item.id)}
										className="w-7 h-7 rounded-md bg-[#F68E2D] hover:bg-[#e57d1f] flex items-center justify-center transition-colors" 
										aria-label="View preference"
									>
										<Eye className="w-3.5 h-3.5 text-white" />
									</button>
									<button 
										onClick={() => handleEditPreference(item)}
										className="w-7 h-7 rounded-md bg-[#3B49DF] hover:bg-[#3340c9] flex items-center justify-center transition-colors" 
										aria-label="Edit preference"
									>
										<Pencil className="w-3.5 h-3.5 text-white" />
									</button>
									<button 
										onClick={() => openDeleteDialog(item.id, item.name)}
										className="w-7 h-7 rounded-md bg-[#E03137] hover:bg-[#c82a30] flex items-center justify-center transition-colors" 
										aria-label="Delete preference"
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

			{/* Edit Modal */}
			{isEditing && editData && (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<div className="bg-[#14112E] border border-gray-700 rounded-lg p-8 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-white text-2xl font-bold">Edit Preference</h2>
						<button
							onClick={handleDiscardEdit}
							className="text-gray-400 hover:text-white transition-colors"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					<form className="space-y-4">
						{/* Course Name */}
						<div>
							<label className="block text-white text-sm mb-2">Course Name</label>
							<input
								type="text"
								value={editData.courseName}
								onChange={(e) => handleEditFieldChange("courseName", e.target.value)}
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
							/>
						</div>

						{/* Eligibility Status */}
						<div>
							<label className="block text-white text-sm mb-2">Eligibility Status</label>
							<select
								value={editData.eligibilityStatus}
								onChange={(e) =>
									handleEditFieldChange(
										"eligibilityStatus",
										e.target.value as "Hostile" | "Eligible" | "None"
									)
								}
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
							>
								<option value="Eligible">Eligible</option>
								<option value="Hostile">Hostile</option>
								<option value="None">None</option>
							</select>
						</div>

						{/* Application Status */}
						<div>
							<label className="block text-white text-sm mb-2">Application Status</label>
							<select
								value={editData.applicationStatus}
								onChange={(e) =>
									handleEditFieldChange(
										"applicationStatus",
										e.target.value as "On-Going" | "Conditional Offer" | "Accepted" | "Rejected"
									)
								}
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
							>
								<option value="On-Going">On-Going</option>
								<option value="Conditional Offer">Conditional Offer</option>
								<option value="Accepted">Accepted</option>
								<option value="Rejected">Rejected</option>
							</select>
						</div>

						{/* Intake Date */}
						<div>
							<label className="block text-white text-sm mb-2">Intake Date</label>
							<input
								type="text"
								value={editData.intakeDate || ""}
								onChange={(e) => handleEditFieldChange("intakeDate", e.target.value)}
								placeholder="E.g., September 2026"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
							/>
						</div>

						{/* Start Date */}
						<div>
							<label className="block text-white text-sm mb-2">Start Date</label>
							<input
								type="date"
								value={editData.startDate || ""}
								onChange={(e) => handleEditFieldChange("startDate", e.target.value)}
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
							/>
						</div>

						{/* End Date */}
						<div>
							<label className="block text-white text-sm mb-2">End Date</label>
							<input
								type="date"
								value={editData.endDate || ""}
								onChange={(e) => handleEditFieldChange("endDate", e.target.value)}
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-[#F68E2D] text-sm"
							/>
						</div>

						{/* Tuition Fee */}
						<div>
							<label className="block text-white text-sm mb-2">Tuition Fee</label>
							<input
								type="text"
								value={editData.tuitionFee || ""}
								onChange={(e) => handleEditFieldChange("tuitionFee", e.target.value)}
								placeholder="E.g., £27,300"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
							/>
						</div>

						{/* First Term Fee */}
						<div>
							<label className="block text-white text-sm mb-2">First Term Fee</label>
							<input
								type="text"
								value={editData.termFee || ""}
								onChange={(e) => handleEditFieldChange("termFee", e.target.value)}
								placeholder="E.g., £4,300"
								className="w-full bg-[#0A0820] border border-gray-700 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#F68E2D] text-sm"
							/>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-4 mt-6 pt-4 border-t border-gray-700">
							<button
								type="button"
								onClick={handleDiscardEdit}
								disabled={isSaving}
								className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleUpdatePreference}
								disabled={isSaving}
								className="flex-1 bg-[#F68E2D] hover:bg-[#e57d1f] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
							>
								{isSaving ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</form>
				</div>
			</div>
		)}

		{/* Delete Confirmation Dialog */}
		{deleteDialogOpen && (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<div className="bg-[#14112E] border border-gray-700 rounded-lg p-8 w-full max-w-md mx-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-white text-xl font-bold">Delete Preference</h2>
						<button
							onClick={handleDeleteCancel}
							className="text-gray-400 hover:text-white transition-colors"
							disabled={isDeleting}
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					<div className="mb-6">
						<p className="text-white/80 text-sm mb-3">
							Are you sure you want to delete the preference for{" "}
							<span className="text-[#F68E2D] font-semibold">{deletePreferenceName}</span>?
						</p>
						<p className="text-white/60 text-sm">This action cannot be undone.</p>
					</div>

					<div className="flex gap-4">
						<button
							onClick={handleDeleteCancel}
							disabled={isDeleting}
							className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
						>
							Cancel
						</button>
						<button
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
							className="flex-1 bg-[#E03137] hover:bg-[#c82a30] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</button>
					</div>
				</div>
			</div>
		)}
		</>
	);
};

export default Preferences;
