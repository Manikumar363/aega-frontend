"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (formData.email.includes(" ")) {
      toast.error("Email must not contain spaces");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    const phoneRegex = /^[0-9+]+$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("Phone number should only contain numbers and '+' symbol");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiPost("/api/support/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      toast.success("Thank you for reaching out! Your inquiry has been submitted successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      value = value.replace(/[^0-9+]/g, "");
    }
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0A1628]">
      {/* Orange Diagonal Background - Top Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-[60%] bg-linear-to-bl from-[#F58A07] via-[#C86A2A] to-transparent opacity-70" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        {/* Top Section - Hero */}
        <div className="mb-20 text-left">
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/60">
              CONTACT US
            </p>
          </div>

          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            GET IN TOUCH. WE'LL RESPOND SHORTLY
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            We're here to support Students, Agents, Sponsors, and institutions
            with expert guidance, compliance support, and sector insights. Reach
            out to AEGA and our team will respond promptly.
          </p>
        </div>

        {/* Form Section */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-left">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl uppercase tracking-wide leading-tight">
              WE'RE HERE TO
              <br />
              SUPPORT YOU EVERY
              <br />
              STEP OF THE WAY
            </h2>
            <p className="text-sm text-white/70 md:text-base">
              If you have any questions or concerns about Agents & Educators,
              please don't hesitate to reach out using the contact details
              below.
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Name, Email, Phone Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold text-white/60">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full border border-white/20 bg-[#060D18] px-4 py-3 rounded-md text-sm text-white placeholder-white/20 outline-none focus:border-[#F58A07] transition focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-white/60">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full border border-white/20 bg-[#060D18] px-4 py-3 rounded-md text-sm text-white placeholder-white/20 outline-none focus:border-[#F58A07] transition focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-white/60">
                  Phone<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+447123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full border border-white/20 bg-[#060D18] px-4 py-3 rounded-md text-sm text-white placeholder-white/20 outline-none focus:border-[#F58A07] transition focus:outline-none"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-white/60">
                Subject<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                placeholder="what is this regarding ?"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="w-full border border-white/20 bg-[#060D18] px-4 py-3 rounded-md text-sm text-white placeholder-white/20 outline-none focus:border-[#F58A07] transition focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-white/60">
                Message<span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                rows={5}
                className="w-full resize-none border border-white/20 bg-[#060D18] px-4 py-3 rounded-md text-sm text-white placeholder-white/20 outline-none focus:border-[#F58A07] transition focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#F7941D] hover:bg-[#E08315] text-white px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer disabled:opacity-50 rounded-md"
              >
                {isSubmitting ? "Submitting..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
