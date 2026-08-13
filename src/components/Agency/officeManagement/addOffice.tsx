import React, { useState } from "react";
import toast from "react-hot-toast";

type AddOfficeProps = {
	onClose: () => void;
	onOfficeAdded?: () => void;
};

type AddOfficeForm = {
	location: string;
	fullAddress: string;
	email: string;
	mobileNumber: string;
	numberOfEmployees: string;
};

const AddOffice: React.FC<AddOfficeProps> = ({ onClose, onOfficeAdded }) => {
	const [form, setForm] = useState<AddOfficeForm>({
		location: "",
		fullAddress: "",
		email: "",
		mobileNumber: "",
		numberOfEmployees: "1",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "mobileNumber") {
			// Restrict alphabets: allow only digits, spaces, +, -
			const cleanVal = value.replace(/[^0-9+\s-]/g, '');
			setForm((prev) => ({ ...prev, [name]: cleanVal }));
		} else if (name === "email") {
			// Trim spacing for email
			setForm((prev) => ({ ...prev, [name]: value.trim() }));
		} else {
			setForm((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleAddOffice = async () => {
		// Validate required fields
		if (!form.location.trim() || !form.fullAddress.trim() || !form.email.trim() || !form.mobileNumber.trim()) {
			toast.error("All required fields must be filled.");
			return;
		}

		// Validate Email format regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(form.email.trim())) {
			toast.error("Please enter a valid email address without spaces.");
			return;
		}

		try {
			setIsSubmitting(true);
			const token = localStorage.getItem("authToken");

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offices`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						location: form.location.trim(),
						fullAddress: form.fullAddress.trim(),
						email: form.email.trim(),
						mobileNumber: form.mobileNumber.trim(),
						numberOfEmployees: parseInt(form.numberOfEmployees, 10) || 1,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				if (response.status === 409 || errorData?.error?.toLowerCase().includes("exist") || errorData?.message?.toLowerCase().includes("exist")) {
					toast.error("Company already exist with this emailid");
				} else {
					toast.error(errorData.error || errorData.message || "Failed to add office");
				}
				return;
			}

			toast.success("Office added successfully");

			// Reset form
			setForm({
				location: "",
				fullAddress: "",
				email: "",
				mobileNumber: "",
				numberOfEmployees: "1",
			});

			onOfficeAdded?.();
			onClose();
		} catch (error) {
			console.error("Error adding office:", error);
			const errorMessage = error instanceof Error ? error.message : "Failed to add office";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
			<div className="w-full max-w-2xl bg-[#14123A] border border-[#2E325D] p-6 rounded-xl text-white space-y-5 shadow-2xl">
				<div className="flex items-center justify-between border-b border-gray-800 pb-3">
					<h2 className="text-2xl font-bold text-[#F68E2D]">Add New Office</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
				</div>

				<div className="space-y-4 text-xs">
					<div>
						<label className="block font-semibold mb-1 text-gray-300">
							Office Location <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="location"
							placeholder="e.g. London Head Office"
							value={form.location}
							onChange={handleInputChange}
							disabled={isSubmitting}
							className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white placeholder-white/40 outline-none focus:border-[#F68E2D]"
						/>
					</div>

					<div>
						<label className="block font-semibold mb-1 text-gray-300">
							Full Address <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="fullAddress"
							placeholder="e.g. 123 Oxford Street, London, W1D 1BS, UK"
							value={form.fullAddress}
							onChange={handleInputChange}
							disabled={isSubmitting}
							className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white placeholder-white/40 outline-none focus:border-[#F68E2D]"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block font-semibold mb-1 text-gray-300">
								Email ID <span className="text-red-500">*</span>
							</label>
							<input
								type="email"
								name="email"
								placeholder="e.g. london.office@agency.com"
								value={form.email}
								onChange={handleInputChange}
								disabled={isSubmitting}
								className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white placeholder-white/40 outline-none focus:border-[#F68E2D]"
							/>
						</div>
						<div>
							<label className="block font-semibold mb-1 text-gray-300">
								Mobile Number <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="mobileNumber"
								placeholder="e.g. +44 20 7946 0912"
								value={form.mobileNumber}
								onChange={handleInputChange}
								disabled={isSubmitting}
								className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white placeholder-white/40 outline-none focus:border-[#F68E2D]"
							/>
						</div>
					</div>

					<div>
						<label className="block font-semibold mb-1 text-gray-300">
							Number of Employees
						</label>
						<input
							type="number"
							min="1"
							name="numberOfEmployees"
							placeholder="e.g. 10"
							value={form.numberOfEmployees}
							onChange={handleInputChange}
							disabled={isSubmitting}
							className="w-full bg-[#0A0724] border border-gray-700 rounded-lg p-2.5 text-white placeholder-white/40 outline-none focus:border-[#F68E2D]"
						/>
					</div>
				</div>

				<div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleAddOffice}
						disabled={isSubmitting}
						className="px-6 py-2.5 bg-[#F68E2D] hover:bg-[#e57d1f] text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
					>
						{isSubmitting ? "Adding..." : "Save Office"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddOffice;
