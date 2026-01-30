"use client";

import React from 'react';
import { Phone, Mail, MapPin, Clock, User, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ContactFormSection = () => {
  return (
    <section className="relative py-20 bg-zinc-900 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          alt="Office Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Contact Details */}
        <div className="text-white space-y-8">
          <div>
             <h2 className="text-4xl font-serif font-bold mb-4">Get in Touch. We'll Respond Shortly</h2>
             <p className="text-gray-300">If you have any questions or concerns about Agents & Educators, please don't hesitate to reach out using the contact details below.</p>
          </div>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                 <Phone className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold">Phone Number</h4>
                 <p className="text-gray-300 text-sm">020 7123 4567</p>
               </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                 <Mail className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold">Email ID</h4>
                 <p className="text-gray-300 text-sm">info@aegaglobal.org.uk</p>
               </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                 <MapPin className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold">Address</h4>
                 <p className="text-gray-300 text-sm">164 High Street North, London</p>
               </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                 <Clock className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="font-bold">Business Hours</h4>
                 <p className="text-gray-300 text-sm">09:00 AM - 05:00 PM</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Orange Form Card */}
        <div className="bg-orange-400 p-8 md:p-10 rounded-lg shadow-2xl">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch With Us</h3>
          
          <form className="space-y-4">
            {/* Name */}
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Enter Name" 
                className="w-full pl-10 pr-4 py-3 rounded bg-orange-50 border-none focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                placeholder="Enter Email ID" 
                className="w-full pl-10 pr-4 py-3 rounded bg-orange-50 border-none focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
              />
            </div>

            {/* Message */}
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FileText className="w-5 h-5" />
              </div>
              <textarea 
                rows={4}
                placeholder="Write a brief description" 
                className="w-full pl-10 pr-4 py-3 rounded bg-orange-50 border-none focus:ring-2 focus:ring-black outline-none placeholder-gray-500 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button className="w-full bg-black text-white font-bold py-3 rounded hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                Submit <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};