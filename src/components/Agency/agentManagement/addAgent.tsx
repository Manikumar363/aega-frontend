"use client";

import React, { useState } from "react";

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

const initialState: FormState = {
  firstName: "Jane",
  lastName: "Lorence",
  email: "jane@gmail.com",
  mobile: "+1 123 589 6740",
  designation: "Designation Name",
  office: "Location",
  country: "Region Name",
  auth: {
    addAgent: true,
    editAgent: true,
    assignUni: true,
    addOffice: true,
    editOffice: true,
    removeOffice: true,
    assignRegion: true,
    assignCourse: true,
    removeAgent: false,
  },
};

const AddAgent: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAuth = (key: AuthorizationKey) => {
    setForm((prev) => ({
      ...prev,
      auth: { ...prev.auth, [key]: !prev.auth[key] },
    }));
  };

  const onDiscard = () => setForm(initialState);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate API
    console.log("Add Agent payload:", form);
  };

  return (
    <form onSubmit={onSubmit} className="text-white">
      <div className="mb-3 text-xs text-white/70">
        <span>Audits </span>
        <span className="text-[#F68E2D]">&gt; Add Agent</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">Add Agent</h1>

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
          options={["Designation Name", "Managing Director", "Chief Operating Officer", "Counselor"]}
        />
        <SelectField
          label="Office"
          required
          value={form.office}
          onChange={(v) => setField("office", v)}
          options={["Location", "Hyderabad", "Bangalore", "Noida"]}
        />
      </div>

      <div className="mt-6">
        <SelectField
          label="Country"
          required
          value={form.country}
          onChange={(v) => setField("country", v)}
          options={["Region Name", "India", "UK", "USA", "UAE"]}
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
          className="w-60 h-12 bg-[#E8E8E8] text-[#9AA0A6] text-xl font-semibold rounded border border-[#2FD3C8]"
        >
          Discard
        </button>
        <button
          type="submit"
          className="w-60 h-12 bg-[#F68E2D] hover:bg-[#e57d1f] text-white text-xl font-semibold rounded transition-colors"
        >
          Add Agent
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
  fullWidth,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
              {opt}
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