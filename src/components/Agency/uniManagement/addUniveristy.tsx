"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

type AddUniversityProps = {
	onClose: () => void;
};

const AddUniversity: React.FC<AddUniversityProps> = ({ onClose }) => {
	const [universityName, setUniversityName] = useState("");
	const [email, setEmail] = useState("");
	const [location, setLocation] = useState("");
	const [mobile, setMobile] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!universityName.trim()) {
			toast.error("Please enter university name");
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
						email: email.trim() || undefined,
						location: location.trim() || undefined,
						mobile: mobile.trim() || undefined,
						message: message.trim() || undefined,
						sendCredentialsEmail: true,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to add university");
			}

			toast.success("University created successfully. Welcome credentials mail sent!");
			onClose();
		} catch (error) {
			console.error("Error adding university:", error);
			toast.error(error instanceof Error ? error.message : "Failed to add university");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl bg-[#14123A] border border-[#2E325D] p-6 sm:p-8 rounded-lg shadow-xl"
			>
				<h2 className="text-white text-2xl font-bold mb-6 border-b border-[#2C2A45] pb-3">Add New University</h2>

				<div className="space-y-4">
					<div>
						<label htmlFor="university-name" className="block text-white text-sm font-medium mb-1">
							University Name<span className="text-[#E03137]">*</span>
						</label>
						<input
							id="university-name"
							type="text"
							value={universityName}
							onChange={(event) => setUniversityName(event.target.value)}
							placeholder="Enter university name"
							required
							disabled={isSubmitting}
							className="w-full bg-[#181537] border border-[#4E5277] text-white text-sm px-4 py-2.5 outline-none rounded focus:border-[#F7941D] disabled:opacity-60"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor="university-email" className="block text-white text-sm font-medium mb-1">
								Email Address
							</label>
							<input
								id="university-email"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="contact@university.edu"
								disabled={isSubmitting}
								className="w-full bg-[#181537] border border-[#4E5277] text-white text-sm px-4 py-2.5 outline-none rounded focus:border-[#F7941D] disabled:opacity-60"
							/>
						</div>

						<div>
							<label htmlFor="university-mobile" className="block text-white text-sm font-medium mb-1">
								Phone / Mobile Number
							</label>
							<input
								id="university-mobile"
								type="text"
								value={mobile}
								onChange={(event) => setMobile(event.target.value)}
								placeholder="+1 234 567 890"
								disabled={isSubmitting}
								className="w-full bg-[#181537] border border-[#4E5277] text-white text-sm px-4 py-2.5 outline-none rounded focus:border-[#F7941D] disabled:opacity-60"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="university-location" className="block text-white text-sm font-medium mb-1">
							Location / City, Country
						</label>
						<input
							id="university-location"
							type="text"
							value={location}
							onChange={(event) => setLocation(event.target.value)}
							placeholder="e.g. London, UK"
							disabled={isSubmitting}
							className="w-full bg-[#181537] border border-[#4E5277] text-white text-sm px-4 py-2.5 outline-none rounded focus:border-[#F7941D] disabled:opacity-60"
						/>
					</div>

					<div>
						<label htmlFor="message" className="block text-white text-sm font-medium mb-1">
							Notes / Message
						</label>
						<textarea
							id="message"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							placeholder="Additional notes or invitation message..."
							rows={3}
							disabled={isSubmitting}
							className="w-full bg-[#181537] border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-2.5 outline-none resize-none rounded focus:border-[#F7941D] disabled:opacity-60"
						/>
					</div>
				</div>

				<div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="w-full sm:w-32 bg-transparent border border-white/30 hover:bg-white/10 text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-50"
					>
						Discard
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full sm:w-44 bg-[#F7941D] hover:bg-[#e28518] text-white text-sm font-semibold py-2.5 rounded transition-colors disabled:opacity-50"
					>
						{isSubmitting ? "Creating..." : "Add University"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddUniversity;
