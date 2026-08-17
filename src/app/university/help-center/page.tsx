"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Search, Mail, MessageSquare, BookOpen, AlertCircle, HelpCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import toast from "react-hot-toast";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function UniversityHelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Support ticket form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("General Support");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqData: FAQItem[] = [
    {
      category: "compliance",
      question: "How do I check my current UKVI compliance status?",
      answer: "Navigate to the 'Compliances' tab in the sidebar. You will see your overall compliance score, active alerts count, and detailed breakdown of each compliance indicator (Sponsor Licence, Attendance, CAS Allocation, etc.)."
    },
    {
      category: "compliance",
      question: "What should I do if my compliance score drops?",
      answer: "If your compliance score drops or issues are flagged, go to the 'Compliances' page to inspect the non-compliant indicators. Resolve the issues specified in the admin verification notes and request a re-audit if necessary."
    },
    {
      category: "audits",
      question: "How often are compliance audits conducted?",
      answer: "Audits are typically conducted quarterly by AEGA compliance officers or admin auditors. You will receive an immediate notification in the portal once a new audit is completed and published."
    },
    {
      category: "audits",
      question: "Can I download my historical audit reports?",
      answer: "Yes. In the 'Audits' section, locate the target audit card and click on the 'Report' button. It will instantly compile and download a detailed compliance report text file."
    },
    {
      category: "cdp",
      question: "What is CDP training and how do we complete the target hours?",
      answer: "CDP (Continuous Professional Development) courses are training modules provided by AEGA. Your target hours are calculated based on the sum of all mandatory and optional course durations. Enrolled users must view training materials and complete quizzes to mark courses as completed."
    },
    {
      category: "account",
      question: "How can I update my university logo and contact information?",
      answer: "Go to 'Profile' in the sidebar, click the 'Edit Profile' tab, upload your new logo, modify address details, and click 'Save Changes' to update your institution details."
    }
  ];

  const categories = [
    { id: "all", label: "All Topics", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "compliance", label: "UKVI Compliance", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "audits", label: "Audits & Scores", icon: <BookOpen className="w-4 h-4" /> },
    { id: "cdp", label: "CDP Training", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "account", label: "Profile & Account", icon: <Mail className="w-4 h-4" /> }
  ];

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill out all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    // Simulate sending a support ticket
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Support ticket submitted successfully! Our help desk will review it shortly.");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <DashboardLayout role="university">
      <div className="space-y-8 text-white pb-10">
        {/* Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-wide uppercase">Help Center &amp; Support</h1>
          <p className="text-sm text-gray-400">Search FAQs, read documentation, or submit a support request ticket.</p>
        </div>

        {/* Search FAQ */}
        <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 shadow-lg text-left">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search help topics, questions, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0724] border border-gray-800 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#F68E2D]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Navigation & List */}
          <div className="lg:col-span-2 space-y-6 text-left">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenFaqIndex(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer border ${
                    selectedCategory === cat.id
                      ? "bg-[#F68E2D] border-[#F68E2D] text-white"
                      : "bg-[#14112E] border-gray-800 hover:border-gray-700 text-gray-300"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="bg-[#14112E] border border-gray-800 rounded-xl p-8 text-center text-gray-400">
                  No FAQ topics match your search query.
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#14112E] border border-gray-800 rounded-lg overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-6 py-4 flex items-center justify-between font-semibold text-sm hover:text-[#F68E2D] transition-colors cursor-pointer"
                      >
                        <span className="text-left">{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#F68E2D]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 pt-1 text-xs text-gray-400 border-t border-gray-800/50 leading-relaxed bg-[#0a0820]/45">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Submit Support Ticket Form */}
          <div className="bg-[#14112E] border border-gray-800 rounded-xl p-6 shadow-lg space-y-4 h-fit text-left">
            <h3 className="text-md font-bold uppercase text-[#F68E2D] border-b border-gray-800 pb-2">Submit Support Ticket</h3>
            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Inquiry Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. CAS Allocation Delay"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D] cursor-pointer"
                >
                  <option value="General Support">General Support</option>
                  <option value="Compliance Issues">Compliance Issues</option>
                  <option value="Audits Help">Audits Help</option>
                  <option value="CDP Training">CDP Training Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Message Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your request, question, or compliance issue here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#0A0724] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-[#F68E2D] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#F68E2D] hover:bg-[#e28124] text-white py-2.5 rounded-lg font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Send Ticket"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
