import React from 'react';

export const ContactHero = () => {
  return (
    <section className="bg-black text-white min-h-[400px] flex">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2">
        
        {/* Left: Text Content */}
        <div className="px-4 py-16 md:py-24 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-serif text-orange-500 mb-6">Contact us</h1>
          <p className="text-gray-300 font-light leading-relaxed max-w-md">
            We're here to support Students, Agents, Sponsors, and institutions with expert guidance, compliance support, and sector insights. Reach out to AEGA and our team will respond promptly.
          </p>
        </div>

        {/* Right: Image */}
        <div className="relative h-full min-h-[300px] w-full bg-zinc-800">
           {/* Placeholder for Woman on Phone */}
           <img 
             src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2069&auto=format&fit=crop" 
             alt="Contact Support" 
             className="absolute inset-0 w-full h-full object-cover opacity-90"
           />
           {/* Gradient blend */}
           <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};