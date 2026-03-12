import React from "react";

type AddOfficeProps = {
	onClose: () => void;
};

const AddOffice: React.FC<AddOfficeProps> = ({ onClose }) => {
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
							placeholder="Location"
							className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none"
						/>
					</div>

					<div>
						<label className="block text-white text-base mb-2">
							Full Address <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							placeholder="Address"
							className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-white text-base mb-2">
								Email ID <span className="text-red-500">*</span>
							</label>
							<input
								type="email"
								placeholder="loc@gmail.com"
								className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none"
							/>
						</div>
						<div>
							<label className="block text-white text-base mb-2">
								Mobile Number <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								placeholder="+1123 589 6740"
								className="w-full bg-transparent border border-[#4E5277] text-white text-sm placeholder-white/50 px-4 py-3 outline-none"
							/>
						</div>
					</div>
					</div>

					<div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
						<button
							onClick={onClose}
							className="w-full sm:w-52 bg-[#E5E7EB] hover:bg-[#d9dbe0] text-[#8C95A0] text-sm font-semibold py-2.5 transition-colors"
						>
							Discard
						</button>
						<button className="w-full sm:w-52 bg-[#F7941D] hover:bg-[#e28518] text-white text-sm font-semibold py-2.5 transition-colors">
							Add Office
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddOffice;
