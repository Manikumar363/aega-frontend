"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type AddUniversityProps = {
	onClose: () => void;
};

type UniversityOption = {
	id: string;
	name: string;
};

const AddUniversity: React.FC<AddUniversityProps> = ({ onClose }) => {
	const [selectedUniversityId, setSelectedUniversityId] = useState("");
	const [message, setMessage] = useState("");
	const [universities, setUniversities] = useState<UniversityOption[]>([]);
	const [loadingUniversities, setLoadingUniversities] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchUniversities = async () => {
			try {
				setLoadingUniversities(true);
				const token = localStorage.getItem("authToken");
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/universities`, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch universities");
				}

				const data = await response.json();
				const parsedUniversities = Array.isArray(data)
					? data
					: data.universities || data.data || [];

				setUniversities(
					parsedUniversities.map((university: { _id?: string; id?: string; name?: string }) => ({
						id: university._id || university.id || university.name || "",
						name: university.name || "Unnamed University",
					}))
				);
			} catch (error) {
				console.error("Error fetching universities:", error);
				toast.error("Failed to load universities");
			} finally {
				setLoadingUniversities(false);
			}
		};

		fetchUniversities();
	}, []);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!selectedUniversityId.trim()) {
			toast.error("Please select a university");
			return;
		}

		if (!message.trim()) {
			toast.error("Please enter a message");
			return;
		}

		const selectedUniversity = universities.find((item) => item.id === selectedUniversityId);

		if (!selectedUniversity) {
			toast.error("Selected university is not available");
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
						name: selectedUniversity.name,
						message: message.trim(),
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to add university");
			}

			toast.success("University request sent successfully");
			setSelectedUniversityId("");
			setMessage("");
			onClose();
		} catch (error) {
			console.error("Error submitting university request:", error);
			toast.error(error instanceof Error ? error.message : "Failed to add university");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-4xl bg-[#14123A] border border-[#2E325D] p-4 sm:p-6"
			>
				<h2 className="text-white text-3xl font-semibold mb-5">Add University</h2>

				<div className="space-y-4">
					<div>
						<label htmlFor="university-name" className="block text-white text-base mb-2">
							University<span className="text-[#E03137]">*</span>
						</label>
						<select
							id="university-name"
							value={selectedUniversityId}
							onChange={(event) => setSelectedUniversityId(event.target.value)}
							required
							disabled={loadingUniversities || isSubmitting}
							className="w-full bg-transparent border border-[#4E5277] text-white text-sm px-4 py-3 outline-none disabled:opacity-60"
						>
							<option value="" className="bg-[#14123A] text-white">
								{loadingUniversities ? "Loading universities..." : "Select university"}
							</option>
							{universities.map((university) => (
								<option key={university.id} value={university.id} className="bg-[#14123A] text-white">
									{university.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="message" className="block text-white text-base mb-2">
							Message<span className="text-[#E03137]">*</span>
						</label>
						<textarea
							id="message"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							placeholder="Message..."
							required
							rows={3}
							disabled={isSubmitting}
							className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none resize-none disabled:opacity-60"
						/>
					</div>
				</div>

				<div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="w-full sm:w-52 bg-[#E5E7EB] hover:bg-[#d9dbe0] text-[#8C95A0] text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Discard
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full sm:w-52 bg-[#F7941D] hover:bg-[#e28518] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Sending..." : "Send Request"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddUniversity;
