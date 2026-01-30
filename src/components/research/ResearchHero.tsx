import React from 'react';

export const ResearchHero = () => {
  return (
    <section className="bg-black text-white min-h-[450px] flex relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2">
        
        {/* Left: Text Content */}
        <div className="px-4 py-16 md:py-24 flex flex-col justify-center z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-orange-500 mb-6 leading-tight">
            Research & Policy
          </h1>
          <p className="text-gray-300 font-light leading-relaxed max-w-lg mb-8">
            Empowering agents and sponsors through evidence-based research, compliance guidance, and industry standards that strengthen ethical and responsible global recruitment.
          </p>
        </div>

        {/* Right: Image */}
        <div className="relative h-full min-h-[350px] w-full bg-zinc-800">
           {/* Image: Hands working on papers/laptop */}
           <img 
             src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" 
             alt="Research and Policy" 
             className="absolute inset-0 w-full h-full object-cover opacity-90"
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};