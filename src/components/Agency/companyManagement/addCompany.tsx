"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Upload, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { getAuthToken } from "@/lib/api";
import { uploadFile } from "@/lib/api/fileService";
import { useRouter } from "next/navigation";

type FormState = {
	companyName: string;
	founderName: string;
	emailId: string;
	mobileNumber: string;
	designation: string;
	office: string;
	country: string;
	companyDocument1: string;
	companyDocument2: string;
};

const initialState: FormState = {
	companyName: "",
	founderName: "",
	emailId: "",
	mobileNumber: "",
	designation: "",
	office: "",
	country: "",
	companyDocument1: "",
	companyDocument2: "",
};

const AddCompany: React.FC = () => {
	const router = useRouter();
	const [form, setForm] = useState<FormState>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [designationOptions, setDesignationOptions] = useState<string[]>([
		"Managing Director",
		"Chief Operating Officer",
		"Counselor",
	]);
	const [officeOptions, setOfficeOptions] = useState<string[]>([
		"Hyderabad",
		"Bangalore",
		"Noida",
	]);
	const [countryOptions, setCountryOptions] = useState<string[]>([
		"India",
		"UK",
		"USA",
		"UAE",
	]);

	const [uploadingDoc, setUploadingDoc] = useState<{ companyDocument1: boolean; companyDocument2: boolean }>({
		companyDocument1: false,
		companyDocument2: false,
	});
	const [selectedFileName, setSelectedFileName] = useState<{ companyDocument1: string; companyDocument2: string }>({
		companyDocument1: "",
		companyDocument2: "",
	});
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

	const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const onDiscard = () => {
		setForm(initialState);
		setSelectedFileName({ companyDocument1: "", companyDocument2: "" });
		router.push("/agent/company-management");
	};

	const handleAddCustomOption = (
		category: "designation" | "office" | "country",
		newVal: string
	) => {
		const trimmed = newVal.trim();
		if (!trimmed) return;

		if (category === "designation") {
			if (!designationOptions.includes(trimmed)) {
				setDesignationOptions((prev) => [...prev, trimmed]);
			}
			setField("designation", trimmed);
		} else if (category === "office") {
			if (!officeOptions.includes(trimmed)) {
				setOfficeOptions((prev) => [...prev, trimmed]);
			}
			setField("office", trimmed);
		} else if (category === "country") {
			if (!countryOptions.includes(trimmed)) {
				setCountryOptions((prev) => [...prev, trimmed]);
			}
			setField("country", trimmed);
		}
	};

	const handleDocumentUpload = async (field: "companyDocument1" | "companyDocument2", file: File) => {
		if (!file) {
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			toast.error("File size must be less than 10MB");
			return;
		}

		const validTypes = ["application/pdf", "image/jpeg", "image/png"];
		if (!validTypes.includes(file.type)) {
			toast.error("Only PDF, JPG, and PNG files are allowed");
			return;
		}

		setUploadingDoc((prev) => ({ ...prev, [field]: true }));
		const loadingToastId = toast.loading(`Uploading ${field === "companyDocument1" ? "document 1" : "document 2"}...`);

		try {
			const uploadedPath = await uploadFile(file);
			setField(field, uploadedPath);
			setSelectedFileName((prev) => ({ ...prev, [field]: file.name }));

			toast.update(loadingToastId, {
				render: `${field === "companyDocument1" ? "Document 1" : "Document 2"} uploaded successfully.`,
				type: "success",
				isLoading: false,
				autoClose: 2500,
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Upload failed";
			setField(field, "");
			setSelectedFileName((prev) => ({ ...prev, [field]: "" }));
			toast.update(loadingToastId, {
				render: message,
				type: "error",
				isLoading: false,
				autoClose: 4000,
			});
		} finally {
			setUploadingDoc((prev) => ({ ...prev, [field]: false }));
		}
	};

	const handleRemoveDocument = (field: "companyDocument1" | "companyDocument2") => {
		setField(field, "");
		setSelectedFileName((prev) => ({ ...prev, [field]: "" }));
		toast.info(`${field === "companyDocument1" ? "Document 1" : "Document 2"} removed`);
	};

	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!API_BASE_URL) {
			toast.error("API base URL is not configured.");
			return;
		}

		// 1. Mandatory Field Validations
		const companyName = form.companyName.trim();
		const founderName = form.founderName.trim();
		const emailId = form.emailId.trim();
		const mobileNumber = form.mobileNumber.trim();
		const designation = form.designation.trim();
		const office = form.office.trim();
		const country = form.country.trim();

		if (!companyName) {
			toast.error("Company Name is required.");
			return;
		}
		if (!founderName) {
			toast.error("Founder Name is required.");
			return;
		}
		if (!emailId) {
			toast.error("Email ID is required.");
			return;
		}

		// 2. Email Validation with format & spacing check
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(emailId)) {
			toast.error("Please enter a valid email address");
			return;
		}

		if (!mobileNumber) {
			toast.error("Mobile Number is required.");
			return;
		}

		// 3. Mobile Number Validation (only +, spaces, digits)
		const phoneRegex = /^[+\d\s]{5,20}$/;
		if (!phoneRegex.test(mobileNumber)) {
			toast.error("Mobile number should only accept digits, spaces, and '+'");
			return;
		}

		if (!designation) {
			toast.error("Designation is required.");
			return;
		}
		if (!office) {
			toast.error("Office is required.");
			return;
		}
		if (!country) {
			toast.error("Country is required.");
			return;
		}
		if (!form.companyDocument1 || !form.companyDocument2) {
			toast.error("Please upload both company documents.");
			return;
		}

		setIsSubmitting(true);
		const loadingToastId = toast.loading("Creating company...");

		const payload = {
			companyName,
			founderName,
			emailId,
			mobileNumber,
			designation,
			office,
			country,
			companyDocument1: form.companyDocument1.trim(),
			companyDocument2: form.companyDocument2.trim(),
		};

		try {
			const token = getAuthToken();
			const response = await fetch(`${API_BASE_URL}/api/companies`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json().catch(() => null);

			if (!response.ok) {
				const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
				throw new Error(errorMessage);
			}

			toast.update(loadingToastId, {
				render: "Company added successfully",
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});

			setForm(initialState);
			setSelectedFileName({ companyDocument1: "", companyDocument2: "" });
			router.push("/agent/company-management");
		} catch (error) {
			const rawMsg = error instanceof Error ? error.message : "Failed to create company";
			const isDuplicate = rawMsg.toLowerCase().includes("exist") || rawMsg.toLowerCase().includes("duplicate");
			const errorMessage = isDuplicate ? "Company already exist with this emailid" : rawMsg;

			toast.update(loadingToastId, {
				render: errorMessage,
				type: "error",
				isLoading: false,
				autoClose: 4000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={onSubmit} className="text-white">
			<div className="mb-4 text-xs font-semibold text-white">
				<span>Company Management </span>
				<span className="text-[#F68E2D]">&gt; Add Company</span>
			</div>

			<h1 className="text-2xl font-bold mb-6">Add Company</h1>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Field
					label="Company Name"
					required
					value={form.companyName}
					onChange={(value) => setField("companyName", value)}
					placeholder="Company Name"
				/>
				<Field
					label="Founder Name"
					required
					value={form.founderName}
					onChange={(value) => setField("founderName", value)}
					placeholder="Founder Name"
				/>

				<Field
					label="Email ID"
					required
					value={form.emailId}
					onChange={(value) => setField("emailId", value)}
					placeholder="Email ID"
					rightIcon={<Check className="h-5 w-5 text-[#00D084]" />}
				/>
				<Field
					label="Mobile Number"
					required
					value={form.mobileNumber}
					onChange={(value) => {
						// Only accept digits, +, and spaces
						const cleaned = value.replace(/[^+\d\s]/g, "");
						setField("mobileNumber", cleaned);
					}}
					placeholder="Mobile Number (+123456789)"
				/>

				<SelectField
					label="Designation"
					required
					value={form.designation}
					onChange={(value) => setField("designation", value)}
					options={designationOptions}
					emptyLabel="Select Designation"
					onAddOption={(newVal) => handleAddCustomOption("designation", newVal)}
				/>
				<SelectField
					label="Office"
					required
					value={form.office}
					onChange={(value) => setField("office", value)}
					options={officeOptions}
					emptyLabel="Select Office"
					onAddOption={(newVal) => handleAddCustomOption("office", newVal)}
				/>
			</div>

			<div className="mt-6">
				<SelectField
					label="Country"
					required
					value={form.country}
					onChange={(value) => setField("country", value)}
					options={countryOptions}
					emptyLabel="Select Country"
					fullWidth
					onAddOption={(newVal) => handleAddCustomOption("country", newVal)}
				/>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				<UploadCard
					label="Company Document 1"
					value={form.companyDocument1}
					fileName={selectedFileName.companyDocument1}
					uploading={uploadingDoc.companyDocument1}
					onSelectFile={(file) => handleDocumentUpload("companyDocument1", file)}
					onRemoveFile={() => handleRemoveDocument("companyDocument1")}
				/>
				<UploadCard
					label="Company Document 2"
					value={form.companyDocument2}
					fileName={selectedFileName.companyDocument2}
					uploading={uploadingDoc.companyDocument2}
					onSelectFile={(file) => handleDocumentUpload("companyDocument2", file)}
					onRemoveFile={() => handleRemoveDocument("companyDocument2")}
				/>
			</div>

			<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
				<button
					type="button"
					onClick={onDiscard}
					disabled={isSubmitting || uploadingDoc.companyDocument1 || uploadingDoc.companyDocument2}
					className="w-full border border-[#C8CDD9] bg-white px-8 py-3 text-base font-medium text-[#A7AEBB] transition-colors hover:bg-[#f4f4f4] sm:w-56"
				>
					Discard
				</button>
				<button
					type="submit"
					disabled={isSubmitting || uploadingDoc.companyDocument1 || uploadingDoc.companyDocument2}
					className="w-full bg-[#F68E2D] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#e57d1f] sm:w-56"
				>
					{isSubmitting ? "Saving..." : "Add Company"}
				</button>
			</div>
		</form>
	);
};

function Field({
	label,
	required,
	value,
	onChange,
	placeholder,
	rightIcon,
}: {
	label: string;
	required?: boolean;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	rightIcon?: React.ReactNode;
}) {
	return (
		<div>
			<label className="mb-2 block text-base font-semibold text-white">
				{label}
				{required ? <span className="text-[#E03137]">*</span> : null}
			</label>
			<div className="relative">
				<input
					value={value}
					onChange={(event) => onChange(event.target.value)}
					placeholder={placeholder}
					className="h-11 w-full border border-[#383B63] bg-[#1A163E] px-4 pr-12 text-sm text-white outline-none placeholder:text-white/55"
				/>
				{rightIcon ? <span className="absolute right-4 top-1/2 -translate-y-1/2">{rightIcon}</span> : null}
			</div>
		</div>
	);
}

function SelectField({
	label,
	required,
	value,
	onChange,
	options,
	emptyLabel,
	fullWidth,
	onAddOption,
}: {
	label: string;
	required?: boolean;
	value: string;
	onChange: (value: string) => void;
	options: string[];
	emptyLabel?: string;
	fullWidth?: boolean;
	onAddOption?: (newOption: string) => void;
}) {
	const [isAdding, setIsAdding] = useState(false);
	const [customInput, setCustomInput] = useState("");

	const handleSaveCustom = () => {
		if (customInput.trim() && onAddOption) {
			onAddOption(customInput.trim());
			setCustomInput("");
			setIsAdding(false);
		}
	};

	return (
		<div className={fullWidth ? "w-full" : ""}>
			<div className="mb-2 flex items-center justify-between">
				<label className="block text-base font-semibold text-white">
					{label}
					{required ? <span className="text-[#E03137]">*</span> : null}
				</label>
				{onAddOption ? (
					<button
						type="button"
						onClick={() => setIsAdding(!isAdding)}
						className="inline-flex items-center gap-1 text-xs font-semibold text-[#F68E2D] hover:underline"
					>
						<Plus className="h-3 w-3" />
						{isAdding ? "Cancel" : "Add New"}
					</button>
				) : null}
			</div>

			{isAdding ? (
				<div className="flex gap-2">
					<input
						type="text"
						value={customInput}
						onChange={(e) => setCustomInput(e.target.value)}
						placeholder={`Enter new ${label.toLowerCase()}`}
						className="h-11 flex-1 border border-[#383B63] bg-[#1A163E] px-4 text-sm text-white outline-none placeholder:text-white/55"
					/>
					<button
						type="button"
						onClick={handleSaveCustom}
						className="h-11 bg-[#F68E2D] px-4 text-xs font-semibold text-white hover:bg-[#e57d1f]"
					>
						Add
					</button>
				</div>
			) : (
				<div className="relative">
					<select
						value={value}
						onChange={(event) => onChange(event.target.value)}
						className="h-11 w-full appearance-none border border-[#383B63] bg-[#1A163E] px-4 pr-11 text-sm text-white outline-none"
					>
						<option value="" className="bg-[#1A163E] text-white">
							{emptyLabel || "Select"}
						</option>
						{options.map((option) => (
							<option key={option} value={option} className="bg-[#1A163E] text-white">
								{option}
							</option>
						))}
					</select>
					<ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/90" />
				</div>
			)}
		</div>
	);
}

function UploadCard({
	label,
	value,
	fileName,
	uploading,
	onSelectFile,
	onRemoveFile,
}: {
	label: string;
	value: string;
	fileName: string;
	uploading: boolean;
	onSelectFile: (file: File) => void;
	onRemoveFile?: () => void;
}) {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			onSelectFile(files[0]);
		}
	};

	const hasFile = Boolean(value || fileName);

	return (
		<div>
			<div className="mb-2 flex items-center justify-between">
				<label className="block text-base font-semibold text-white">
					{label}<span className="text-[#E03137]">*</span>
				</label>
				{hasFile && onRemoveFile ? (
					<button
						type="button"
						onClick={onRemoveFile}
						className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
						title="Remove uploaded document"
					>
						<X className="h-4 w-4" /> Remove
					</button>
				) : null}
			</div>

			<label
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`relative flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed transition-colors ${
					isDragging
						? "border-[#F68E2D] bg-[#221c4e]"
						: "border-[#8F93AE] bg-[#1A163E]"
				} text-white/70 hover:border-[#F68E2D]/70 hover:text-white`}
			>
				<Upload className="h-8 w-8 text-white" />
				<span className="max-w-[88%] truncate text-xs text-white/85 text-center">
					{uploading
						? "Uploading..."
						: fileName || (value ? value : "Drop file here or click to upload")}
				</span>
				<input
					type="file"
					className="hidden"
					accept=".pdf,.jpg,.jpeg,.png"
					onChange={(event) => {
						const file = event.target.files?.[0];
						if (file) {
							onSelectFile(file);
						}
						event.currentTarget.value = "";
					}}
				/>
			</label>
		</div>
	);
}

export default AddCompany;

