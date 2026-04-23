"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

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
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  designation: string;
  office: string;
  country: string;
  auth: Record<AuthorizationKey, boolean>;
};

export type EditableAgent = {
  id: string;
  firstName: string;
  lastName: string;
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
  firstName: "",
  lastName: "",
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
};

const toFormState = (agent: EditableAgent): FormState => ({
  firstName: agent.firstName ?? "",
  lastName: agent.lastName ?? "",
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
});

const AddAgent: React.FC<AddAgentProps> = ({ editAgent, onSuccess }) => {
  const router = useRouter();
  const isEditMode = Boolean(editAgent?.id);
  const [form, setForm] = useState<FormState>(() => (editAgent ? toFormState(editAgent) : initialState));
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onDiscard = () => setForm(editAgent ? toFormState(editAgent) : initialState);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!API_BASE_URL) {
      toast.error("API base URL is not configured.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      emailId: form.email.trim(),
      mobileNumber: form.mobile.trim(),
      designation: form.designation,
      office: form.office,
      country: form.country,
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

    const loadingToastId = toast.loading(isEditMode ? "Updating agent..." : "Creating agent...");

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
        const errorMessage = data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      toast.update(loadingToastId, {
        render: data?.message || (isEditMode ? "Agent updated successfully." : "Agent created successfully."),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (isEditMode) {
        onSuccess?.();
      } else {
        setForm(initialState);
        onSuccess?.();
        router.push("/agent/agent-management");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : isEditMode ? "Failed to update agent" : "Failed to create agent";
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
      <div className="mb-3 text-xs text-white/70">
        <span>Audits </span>
        <span className="text-[#F68E2D]">&gt; {isEditMode ? "Edit Agent" : "Add Agent"}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Agent" : "Add Agent"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="First Name"
          required
          value={form.firstName}
          onChange={(v) => setField("firstName", v)}
          placeholder="First Name"
        />
        <Field
          label="Last Name"
          required
          value={form.lastName}
          onChange={(v) => setField("lastName", v)}
          placeholder="Last Name"
        />

        <Field
          label="Email ID"
          required
          value={form.email}
          onChange={(v) => setField("email", v)}
          placeholder="Email ID"
          rightIcon={
            <svg className="w-5 h-5 text-[#00E091]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <Field
          label="Mobile Number"
          required
          value={form.mobile}
          onChange={(v) => setField("mobile", v)}
          placeholder="Mobile Number"
        />

        <SelectField
          label="Designation"
          required
          value={form.designation}
          onChange={(v) => setField("designation", v)}
          options={["", "Managing Director", "Chief Operating Officer", "Counselor"]}
          emptyLabel="Select Designation"
        />
        <SelectField
          label="Office"
          required
          value={form.office}
          onChange={(v) => setField("office", v)}
          options={["", "Hyderabad", "Bangalore", "Noida"]}
          emptyLabel="Select Office"
        />
      </div>

      <div className="mt-6">
        <SelectField
          label="Country"
          required
          value={form.country}
          onChange={(v) => setField("country", v)}
          options={["", "India", "UK", "USA", "UAE"]}
          emptyLabel="Select Country"
          fullWidth
        />
      </div>

      <div className="mt-8">
        <label className="block text-lg font-semibold mb-3">
          Authorization<span className="text-[#FF4D4F]">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
            label="Assign Uni"
            checked={form.auth.assignUni}
            onChange={() => toggleAuth("assignUni")}
          />

          <AuthItem
            label="Add Office"
            checked={form.auth.addOffice}
            onChange={() => toggleAuth("addOffice")}
          />
          <AuthItem
            label="Edit Office"
            checked={form.auth.editOffice}
            onChange={() => toggleAuth("editOffice")}
          />
          <AuthItem
            label="Remove Office"
            checked={form.auth.removeOffice}
            onChange={() => toggleAuth("removeOffice")}
          />

          <AuthItem
            label="Assign Region"
            checked={form.auth.assignRegion}
            onChange={() => toggleAuth("assignRegion")}
          />
          <AuthItem
            label="Assign Couse"
            checked={form.auth.assignCourse}
            onChange={() => toggleAuth("assignCourse")}
          />
          <AuthItem
            label="Remove Agent"
            checked={form.auth.removeAgent}
            onChange={() => toggleAuth("removeAgent")}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onDiscard}
          disabled={isSubmitting}
          className="w-60 h-12 bg-[#E8E8E8] text-[#9AA0A6] text-xl font-semibold rounded border border-[#2FD3C8]"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-60 h-12 bg-[#F68E2D] hover:bg-[#e57d1f] text-white text-xl font-semibold rounded transition-colors"
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Update Agent" : "Add Agent"}
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
  onChange: (v: string) => void;
  placeholder?: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-lg font-semibold mb-2">
        {label}
        {required ? <span className="text-[#FF4D4F]">*</span> : null}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 bg-[#14112E] border border-[#2C2A45] px-4 pr-10 text-base text-white placeholder:text-white/55 outline-none"
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
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  emptyLabel?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      <label className="block text-lg font-semibold mb-2">
        {label}
        {required ? <span className="text-[#FF4D4F]">*</span> : null}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 bg-[#14112E] border border-[#2C2A45] px-4 pr-10 text-base text-white outline-none appearance-none"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#14112E] text-white">
              {opt === "" ? (emptyLabel || "Select") : opt}
            </option>
          ))}
        </select>
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/90 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
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
    <label className="h-12 bg-[#14112E] border border-[#2C2A45] px-4 flex items-center justify-between cursor-pointer">
      <span className="text-base text-white/90">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-white bg-transparent border border-white/70 rounded"
      />
    </label>
  );
}

export default AddAgent;