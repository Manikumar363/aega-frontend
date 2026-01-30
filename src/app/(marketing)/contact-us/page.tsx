"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0A1628]">
      {/* Orange Diagonal Background - Top Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-[60%] bg-gradient-to-bl from-[#F58A07] via-[#C86A2A] to-transparent opacity-70" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        {/* Top Section - Hero */}
        <div className="mb-20">
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
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name, Email, Phone Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs text-white/60">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-white/60">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="js@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-white/60">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (142) 575-1008"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-b-2 border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-2 block text-xs text-white/60">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="what is this regarding ?"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border-b-2 border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-xs text-white/60">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full resize-none border-b-2 border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-[#F58A07] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-white px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#0A1628] transition-colors hover:bg-[#F58A07] hover:text-white"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
