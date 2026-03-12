import React, { useState } from "react";

type AddUniversityProps = {
	onClose: () => void;
};

const AddUniversity: React.FC<AddUniversityProps> = ({ onClose }) => {
	const [universityName, setUniversityName] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onClose();
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
							University Name<span className="text-[#E03137]">*</span>
						</label>
						<input
							id="university-name"
							type="text"
							value={universityName}
							onChange={(event) => setUniversityName(event.target.value)}
							placeholder="Uni Name"
							required
							className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none"
						/>
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
							className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none resize-none"
						/>
					</div>
				</div>

				<div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
					<button
						type="button"
						onClick={onClose}
						className="w-full sm:w-52 bg-[#E5E7EB] hover:bg-[#d9dbe0] text-[#8C95A0] text-sm font-semibold py-2.5 transition-colors"
					>
						Discard
					</button>
					<button
						type="submit"
						className="w-full sm:w-52 bg-[#F7941D] hover:bg-[#e28518] text-white text-sm font-semibold py-2.5 transition-colors"
					>
						Send Request
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddUniversity;
