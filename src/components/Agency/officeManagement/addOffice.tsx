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
};

const AddOffice: React.FC<AddOfficeProps> = ({ onClose, onOfficeAdded }) => {
	const [form, setForm] = useState<AddOfficeForm>({
		location: "",
		fullAddress: "",
		email: "",
		mobileNumber: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddOffice = async () => {
		// Validate required fields
		if (!form.location.trim() || !form.fullAddress.trim() || !form.email.trim() || !form.mobileNumber.trim()) {
			toast.error("All fields are required");
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
					body: JSON.stringify(form),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to add office");
			}

			const data = await response.json();
			toast.success("Office added successfully");

			// Reset form
			setForm({
				location: "",
				fullAddress: "",
				email: "",
				mobileNumber: "",
			});

			// Callback to refresh office list
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
		<div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
			<div className="w-full max-w-4xl bg-[#14123A] border border-[#2E325D] p-4 sm:p-6">
				<div className="mx-auto w-full">
					<h2 className="text-white text-3xl font-semibold mb-5">Add Office</h2>

					<div className="space-y-4">
					<div>
						<label className="block text-white text-base mb-2">
							Location <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="location"
							placeholder="Location"
							value={form.location}
							onChange={handleInputChange}
							disabled={isSubmitting}
							className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>

					<div>
						<label className="block text-white text-base mb-2">
							Full Address <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="fullAddress"
							placeholder="Address"
							value={form.fullAddress}
							onChange={handleInputChange}
							disabled={isSubmitting}
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
								name="email"
								placeholder="loc@gmail.com"
								value={form.email}
								onChange={handleInputChange}
								disabled={isSubmitting}
								className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							/>
						</div>
						<div>
							<label className="block text-white text-base mb-2">
								Mobile Number <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="mobileNumber"
								placeholder="+1123 589 6740"
								value={form.mobileNumber}
								onChange={handleInputChange}
								disabled={isSubmitting}
								className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							/>
						</div>
					</div>
					</div>

					<div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
						<button
							onClick={onClose}
							disabled={isSubmitting}
							className="w-full sm:w-52 bg-[#E5E7EB] hover:bg-[#d9dbe0] text-[#8C95A0] text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Discard
						</button>
						<button 
							onClick={handleAddOffice}
							disabled={isSubmitting}
							className="w-full sm:w-52 bg-[#F7941D] hover:bg-[#e28518] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Adding..." : "Add Office"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddOffice;
