"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { X, Upload, Plus } from "lucide-react";

type AuthorizationKey =
  | "addAgent"
  | "editAgent"
  | "assignUni"
  | "addOffice"
  | "editOffice"
  | "removeOffice"
  | "assignRegion"
  | "assignCourse"
  | "removeAgent";

type FormState = {
  fullName: string;
  email: string;
  mobile: string;
  designation: string;
  office: string;
  country: string;
  auth: Record<AuthorizationKey, boolean>;
  documentName?: string;
  documentFile?: File | null;
};

export type EditableAgent = {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  emailId: string;
  mobileNumber: string;
  designation: string;
  office: string;
  country: string;
  authorization?: Partial<Record<AuthorizationKey, boolean>>;
};

type AddAgentProps = {
  editAgent?: EditableAgent | null;
  onSuccess?: () => void;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  mobile: "",
  designation: "",
  office: "",
  country: "",
  auth: {
    addAgent: false,
    editAgent: false,
    assignUni: false,
    addOffice: false,
    editOffice: false,
    removeOffice: false,
    assignRegion: false,
    assignCourse: false,
    removeAgent: false,
  },
  documentName: "",
  documentFile: null,
};

const toFormState = (agent: EditableAgent): FormState => {
  const nameStr = agent.name || agent.fullName || `${agent.firstName || ''} ${agent.lastName || ''}`.trim();
  return {
    fullName: nameStr,
    email: agent.emailId ?? "",
    mobile: agent.mobileNumber ?? "",
    designation: agent.designation ?? "",
    office: agent.office ?? "",
    country: agent.country ?? "",
    auth: {
      addAgent: agent.authorization?.addAgent ?? false,
      editAgent: agent.authorization?.editAgent ?? false,
      assignUni: agent.authorization?.assignUni ?? false,
      addOffice: agent.authorization?.addOffice ?? false,
      editOffice: agent.authorization?.editOffice ?? false,
      removeOffice: agent.authorization?.removeOffice ?? false,
      assignRegion: agent.authorization?.assignRegion ?? false,
      assignCourse: agent.authorization?.assignCourse ?? false,
      removeAgent: agent.authorization?.removeAgent ?? false,
    },
    documentName: "",
    documentFile: null,
  };
};

const AddAgent: React.FC<AddAgentProps> = ({ editAgent, onSuccess }) => {
  const router = useRouter();
  const isEditMode = Boolean(editAgent?.id);
  const [form, setForm] = useState<FormState>(() => (editAgent ? toFormState(editAgent) : initialState));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);

  // Dynamic Options state
  const [designations, setDesignations] = useState<string[]>([
    "Managing Director",
    "Chief Operating Officer",
    "Counselor"
  ]);
  const [offices, setOffices] = useState<string[]>([
    "Hyderabad",
    "Bangalore",
    "Noida"
  ]);
  const [countries, setCountries] = useState<string[]>([
    "India",
    "UK",
    "USA",
    "UAE"
  ]);

  useEffect(() => {
    setForm(editAgent ? toFormState(editAgent) : initialState);
  }, [editAgent]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAuth = (key: AuthorizationKey) => {
    setForm((prev) => ({
      ...prev,
      auth: { ...prev.auth, [key]: !prev.auth[key] },
    }));
  };

  const handleAddOption = (type: "designation" | "office" | "country") => {
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    const newValue = window.prompt(`Enter new ${label}:`);
    if (!newValue || !newValue.trim()) return;

    const trimmed = newValue.trim();
    if (type === "designation") {
      if (!designations.includes(trimmed)) setDesignations((prev) => [...prev, trimmed]);
      setField("designation", trimmed);
    } else if (type === "office") {
      if (!offices.includes(trimmed)) setOffices((prev) => [...prev, trimmed]);
      setField("office", trimmed);
    } else if (type === "country") {
      if (!countries.includes(trimmed)) setCountries((prev) => [...prev, trimmed]);
      setField("country", trimmed);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        documentFile: file,
        documentName: file.name
      }));
    }
  };

  const removeDocument = () => {
    setForm((prev) => ({
      ...prev,
      documentFile: null,
      documentName: ""
    }));
  };

  const onDiscard = () => setForm(editAgent ? toFormState(editAgent) : initialState);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!API_BASE_URL) {
      toast.error("API base URL is not configured.");
      return;
    }

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const mobile = form.mobile.trim();
    const designation = form.designation;
    const office = form.office;
    const country = form.country;

    // 1. Mandatory Field Validation
    if (!fullName || !email || !mobile || !designation || !office || !country) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    // 2. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid Email ID.");
      return;
    }

    // 3. Mobile Number Validation (Digits, +, -, spaces only)
    const mobileRegex = /^[+\d\s-]+$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Mobile number can only contain digits, '+', '-' and spaces.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName,
      firstName: fullName,
      lastName: "",
      emailId: email,
      mobileNumber: mobile,
      designation,
      office,
      country,
      authorization: {
        addAgent: form.auth.addAgent,
        editAgent: form.auth.editAgent,
        assignUni: form.auth.assignUni,
        addOffice: form.auth.addOffice,
        editOffice: form.auth.editOffice,
        removeOffice: form.auth.removeOffice,
        assignRegion: form.auth.assignRegion,
        assignCourse: form.auth.assignCourse,
        removeAgent: form.auth.removeAgent,
      },
    };

    try {
      const token = getAuthToken();
      const endpoint = isEditMode
        ? `${API_BASE_URL}/api/agent-management/${editAgent?.id}`
        : `${API_BASE_URL}/api/agent-management`;

      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 409 || data?.error?.toLowerCase().includes("exist")) {
          toast.error("Agent already exist with this emailid");
        } else {
          toast.error(data?.error || data?.message || `Request failed with status ${response.status}`);
        }
        return;
      }

      if (isEditMode) {
        toast.success("Agent updated successfully.");
        onSuccess?.();
      } else {
        const autoPassword = data?.credentials?.password || data?.password || data?.agent?.password;
        toast.success(`Agent added successfully! ${autoPassword ? `Password: ${autoPassword}` : ''}`, {
          autoClose: 15000,
        });

        if (autoPassword) {
          setCreatedCredentials({
            email,
            password: autoPassword,
          });
        } else {
          setForm(initialState);
          onSuccess?.();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : isEditMode ? "Failed to update agent" : "Failed to create agent";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="text-white space-y-6">
      <div className="mb-3 text-xs text-white/70">
        <span>Audits </span>
        <span className="text-[#F68E2D]">&gt; {isEditMode ? "Edit Agent" : "Add Agent"}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Agent" : "Add Agent"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Full Name"
          required
          value={form.fullName}
          onChange={(v) => setField("fullName", v)}
          placeholder="Full Name"
        />

        <Field
          label="Email ID"
          required
          value={form.email}
          onChange={(v) => setField("email", v)}
          placeholder="Email ID"
        />

        <Field
          label="Mobile Number"
          required
          value={form.mobile}
          onChange={(v) => {
            // Filter out alphabets immediately
            const filtered = v.replace(/[^\d+\s-]/g, "");
            setField("mobile", filtered);
          }}
          placeholder="Mobile Number"
        />

        <SelectField
          label="Designation"
          required
          value={form.designation}
          onChange={(v) => setField("designation", v)}
          options={["", ...designations]}
          emptyLabel="Select Designation"
          onAdd={() => handleAddOption("designation")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Office"
          required
          value={form.office}
          onChange={(v) => setField("office", v)}
          options={["", ...offices]}
          emptyLabel="Select Office"
          onAdd={() => handleAddOption("office")}
        />

        <SelectField
          label="Country"
          required
          value={form.country}
          onChange={(v) => setField("country", v)}
          options={["", ...countries]}
          emptyLabel="Select Country"
          onAdd={() => handleAddOption("country")}
        />
      </div>

      {/* DOCUMENT UPLOAD WITH REMOVE BUTTON */}
      <div>
        <label className="block text-[#8A91AC] text-sm font-semibold mb-2">Supporting Documents</label>
        {form.documentName ? (
          <div className="flex items-center justify-between bg-[#14112E] border border-white/20 p-3 rounded text-sm text-white">
            <span className="truncate max-w-xs">{form.documentName}</span>
            <button
              type="button"
              onClick={removeDocument}
              className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
              title="Remove document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 bg-[#14112E] border border-dashed border-white/30 p-4 rounded text-sm text-white/70 hover:border-[#F68E2D] cursor-pointer transition-colors">
            <Upload className="w-5 h-5 text-[#F68E2D]" />
            <span>Click to Upload Document</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {/* AUTHORIZATIONS */}
      <div>
        <label className="block text-lg font-semibold mb-3">
          Authorization<span className="text-[#FF4D4F]">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <AuthItem
            label="Add Agent"
            checked={form.auth.addAgent}
            onChange={() => toggleAuth("addAgent")}
          />
          <AuthItem
            label="Edit Agent"
            checked={form.auth.editAgent}
            onChange={() => toggleAuth("editAgent")}
          />
          <AuthItem
            label="Remove Agent"
            checked={form.auth.removeAgent}
            onChange={() => toggleAuth("removeAgent")}
          />
          <AuthItem
            label="Assign University"
            checked={form.auth.assignUni}
            onChange={() => toggleAuth("assignUni")}
          />
          <AuthItem
            label="Assign Course"
            checked={form.auth.assignCourse}
            onChange={() => toggleAuth("assignCourse")}
          />
          <AuthItem
            label="Add Office"
            checked={form.auth.addOffice}
            onChange={() => toggleAuth("addOffice")}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 pt-4">
        <button
          type="button"
          onClick={onDiscard}
          disabled={isSubmitting}
          className="w-48 h-12 bg-gray-600 hover:bg-gray-500 text-white text-lg font-semibold rounded transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-48 h-12 bg-[#F68E2D] hover:bg-[#e57d1f] text-white text-lg font-semibold rounded transition-colors"
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Update Agent" : "Add Agent"}
        </button>
      </div>

      {/* CREATED CREDENTIALS MODAL (DEVELOPMENT MODE) */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md bg-[#14112E] border border-[#F68E2D] rounded-lg p-6 text-white text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-white">Agent Added Successfully!</h2>
            <p className="text-xs text-white/70">Development Credentials (Auto-Generated):</p>

            <div className="bg-[#1A163E] border border-white/20 rounded p-4 text-left space-y-3">
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Email ID:</span>
                <span className="text-sm font-semibold text-white select-all">{createdCredentials.email}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Auto-Generated Password:</span>
                <div className="flex items-center justify-between gap-2 bg-[#07051A] p-2.5 rounded border border-white/10">
                  <span className="text-base font-mono font-bold text-[#F68E2D] select-all">{createdCredentials.password}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(createdCredentials.password);
                      toast.info("Password copied to clipboard!");
                    }}
                    className="text-xs bg-[#F68E2D] hover:bg-[#e57d1f] px-3 py-1.5 rounded text-white font-semibold transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCreatedCredentials(null);
                setForm(initialState);
                onSuccess?.();
                router.push("/agent/agent-management");
              }}
              className="w-full bg-[#F68E2D] hover:bg-[#e57d1f] text-white py-3 rounded font-semibold text-base transition-colors cursor-pointer"
            >
              Done & Return to Agents
            </button>
          </div>
        </div>
      )}
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
  onChange: (v: string) => void;
  placeholder?: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-white/90">
        {label}
        {required ? <span className="text-[#FF4D4F] ml-1">*</span> : null}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 bg-[#14112E] border border-[#2C2A45] px-4 pr-10 text-sm text-white placeholder:text-white/40 outline-none rounded"
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
  onAdd,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  emptyLabel?: string;
  onAdd?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-white/90">
          {label}
          {required ? <span className="text-[#FF4D4F] ml-1">*</span> : null}
        </label>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="text-xs text-[#F68E2D] hover:underline flex items-center gap-0.5 font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        ) : null}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 bg-[#14112E] border border-[#2C2A45] px-4 pr-10 text-sm text-white outline-none appearance-none rounded cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#14112E] text-white">
              {opt === "" ? (emptyLabel || "Select") : opt}
            </option>
          ))}
        </select>
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function AuthItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="h-12 bg-[#14112E] border border-[#2C2A45] px-4 flex items-center justify-between cursor-pointer rounded">
      <span className="text-sm text-white/90">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-[#F68E2D] cursor-pointer"
      />
    </label>
  );
}

export default AddAgent;