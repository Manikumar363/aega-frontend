"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#03091F] text-white pt-20 pb-8 px-6 md:px-16 overflow-hidden">

      {/* Top CTA Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 border-b border-white/10 pb-12">
        <div className="max-w-3xl">
          <p className="text-white/60 text-[10px] tracking-[0.3em] mb-4 uppercase font-medium">
            READY TO UNLOCK YOUR INVESTMENT POTENTIAL?
          </p>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-none">
            LET'S GET STARTED
          </h2>
        </div>

        <a href={"/signup"}>
          <button className="mt-8 lg:mt-0 bg-[#F58A07] hover:bg-[#e07b06] text-white px-8 py-4 flex items-center gap-2 text-sm font-bold tracking-wide transition-all">
            REGISTER NOW
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </a>
      </div>

      {/* Links & Newsletter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

        {/* Links Columns */}
        <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm text-white mb-2">Company</h4>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="/about" className="hover:text-[#F58A07] transition-colors">About Us</a>
              <a href="/members" className="hover:text-[#F58A07] transition-colors">For Members</a>
              <a href="/compliance" className='hover:text-[#F58A07] transition-colors'>Compliance & Courses</a>
              <a href="/university-sponsors" className="hover:text-[#F58A07] transition-colors">For University & Sponsors</a>
            </div>
          </div>

          {/* <div className="flex flex-col gap-4"> 
            <h4 className="font-bold text-sm text-white mb-2">Events</h4>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="#" className="hover:text-[#F58A07] transition-colors">Investment Trends</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">Risk Management</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">Investing Forum</a>
            </div>
          </div>*/}

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm text-white mb-2">Social</h4>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="#" className="hover:text-[#F58A07] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">LinkedIn</a>
              <a href="https://www.youtube.com/@RemarkablelawConsultancy" className="hover:text-[#F58A07] transition-colors">Youtube</a>
            </div>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-5 lg:col-start-8">
          <h4 className="font-medium text-sm text-white mb-4">
            Subscribe to be in touch with news.
          </h4>
          <form onSubmit={handleSubscribe} className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
              placeholder="Email Address*"
              disabled={isSubmitting}
              required
              className="w-full bg-[#050B26] border border-white/20 p-4 pr-12 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F58A07] transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F58A07] transition-colors cursor-pointer disabled:opacity-50"
              title="Subscribe"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs pt-8 border-t border-white/5 gap-4">
        <p>© All Rights Reserved by AEGA</p>
        <div className="flex gap-4">
          <a href="/privacy-policy" className="hover:text-[#F58A07] transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="/terms-of-use" className="hover:text-[#F58A07] transition-colors">Terms of Use</a>
        </div>
        <p>Designed by <a href="https://quantumitinnovation.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F58A07] transition-colors">Quantum</a></p>
      </div>
    </footer>
  );
}
