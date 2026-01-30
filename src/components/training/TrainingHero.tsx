import React from 'react';

export const TrainingHero = () => {
  return (
    <section className="bg-black text-white min-h-[500px] flex relative">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2">
        
        {/* Left: Text Content */}
        <div className="px-4 py-20 md:py-32 flex flex-col justify-center z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-orange-500 mb-6 leading-tight">
            Training & Professional Development
          </h1>
          <p className="text-gray-300 font-light leading-relaxed max-w-lg mb-8">
            Build your expertise with AEGA's industry-led training programmes designed for recruitment agents, advisors, and educational Sponsors. Strengthen your compliance knowledge, enhance operational skills, and gain practical insights to support safer, ethical, and more effective international student recruitment.
          </p>
        </div>

        {/* Right: Image */}
        <div className="relative h-full min-h-[400px] w-full bg-zinc-800">
           <img 
             src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop" 
             alt="Training Session" 
             className="absolute inset-0 w-full h-full object-cover opacity-90"
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};