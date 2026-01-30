import React from 'react';

export const TechHero = () => {
  return (
    <section className="bg-black text-white min-h-[500px] flex relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2">
        
        {/* Left: Text Content */}
        <div className="px-4 py-16 md:py-24 flex flex-col justify-center z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-orange-500 mb-6 leading-tight">
            Agents & Educator Tech
          </h1>
          <p className="text-gray-300 font-light leading-relaxed max-w-lg mb-8">
            Driving digital innovation to support the global education and recruitment community. AEGA is committed to leveraging technology to enhance compliance, streamline operations, and strengthen the international student journey.
          </p>
        </div>

        {/* Right: Image */}
        <div className="relative h-full min-h-[400px] w-full bg-zinc-800">
           {/* Image: People using tablets/tech */}
           <img 
             src="https://images.unsplash.com/photo-1531297461136-82lw8z9a?q=80&w=2070&auto=format&fit=crop" 
             alt="Education Technology" 
             className="absolute inset-0 w-full h-full object-cover opacity-80"
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};