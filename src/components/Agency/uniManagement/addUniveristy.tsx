"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

type AddUniversityProps = {
	onClose: () => void;
	onSuccess?: () => void;
};

const AddUniversity: React.FC<AddUniversityProps> = ({ onClose, onSuccess }) => {
	const [universityName, setUniversityName] = useState("");
	const [email, setEmail] = useState("");
	const [location, setLocation] = useState("");
	const [mobile, setMobile] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Restrict alphabets: allow only digits, spaces, +, -
		const cleanVal = e.target.value.replace(/[^0-9+\s-]/g, '');
		setMobile(cleanVal);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Remove spacing
		setEmail(e.target.value.trim());
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!universityName.trim()) {
			toast.error("Please enter university name.");
			return;
		}

		if (!email.trim()) {
			toast.error("Please enter university email address.");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email.trim())) {
			toast.error("Please enter a valid email address without spaces.");
			return;
		}

		try {
			setIsSubmitting(true);
			const token = localStorage.getItem("authToken");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent-management/universities`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: universityName.trim(),
						email: email.trim(),
						location: location.trim() || undefined,
						mobile: mobile.trim() || undefined,
						message: message.trim() || undefined,
						sendCredentialsEmail: true,
					}),
				}
			);

			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				if (response.status === 409 || data?.error?.toLowerCase().includes("exist") || data?.message?.toLowerCase().includes("exist")) {
					toast.error("Company already exist with this emailid");
				} else {
					toast.error(data?.error || data?.message || "Failed to add university");
				}
				return;
			}

			toast.success("University added successfully!");
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error("Error adding university:", error);
			toast.error("Failed to add university");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl bg-[#14123A] border border-[#2E325D] p-6 sm:p-8 rounded-xl shadow-2xl space-y-5 text-white"
			>
				<div className="flex items-center justify-between border-b border-[#2C2A45] pb-3">
					<h2 className="text-[#F68E2D] text-2xl font-bold">Add New University</h2>
					<button type="button" onClick={onClose} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
				</div>

				<div className="space-y-4 text-xs">
					<div>
						<label htmlFor="university-name" className="block font-semibold mb-1 text-gray-300">
							University Name <span className="text-red-500">*</span>
						</label>
						<input
							id="university-name"
							type="text"
							value={universityName}
							onChange={(event) => setUniversityName(event.target.value)}
							placeholder="Enter university name"
							required
							disabled={isSubmitting}
							className="w-full bg-[#0A0724] border border-[#4E5277] text-white text-xs px-4 py-2.5 outline-none rounded-lg focus:border-[#F68E2D] disabled:opacity-60"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor="university-email" className="block font-semibold mb-1 text-gray-300">
								Email Address <span className="text-red-500">*</span>
							</label>
							<input
								id="university-email"
								type="email"
								value={email}
								onChange={handleEmailChange}
								placeholder="contact@university.ac.uk"
								required
								disabled={isSubmitting}
								className="w-full bg-[#0A0724] border border-[#4E5277] text-white text-xs px-4 py-2.5 outline-none rounded-lg focus:border-[#F68E2D] disabled:opacity-60"
							/>
						</div>

						<div>
							<label htmlFor="university-mobile" className="block font-semibold mb-1 text-gray-300">
								Phone / Mobile Number
							</label>
							<input
								id="university-mobile"
								type="text"
								value={mobile}
								onChange={handleMobileChange}
								placeholder="+44 20 7946 0912"
								disabled={isSubmitting}
								className="w-full bg-[#0A0724] border border-[#4E5277] text-white text-xs px-4 py-2.5 outline-none rounded-lg focus:border-[#F68E2D] disabled:opacity-60"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="university-location" className="block font-semibold mb-1 text-gray-300">
							Location / City, Country
						</label>
						<input
							id="university-location"
							type="text"
							value={location}
							onChange={(event) => setLocation(event.target.value)}
							placeholder="e.g. London, UK"
							disabled={isSubmitting}
							className="w-full bg-[#0A0724] border border-[#4E5277] text-white text-xs px-4 py-2.5 outline-none rounded-lg focus:border-[#F68E2D] disabled:opacity-60"
						/>
					</div>

					<div>
						<label htmlFor="message" className="block font-semibold mb-1 text-gray-300">
							Notes / Message
						</label>
						<textarea
							id="message"
							rows={3}
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							placeholder="Optional notes or university introduction"
							disabled={isSubmitting}
							className="w-full bg-[#0A0724] border border-[#4E5277] text-white text-xs p-3 outline-none rounded-lg focus:border-[#F68E2D] disabled:opacity-60"
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
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-2.5 bg-[#F68E2D] hover:bg-[#e28124] text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
					>
						{isSubmitting ? "Adding..." : "Save University"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddUniversity;
