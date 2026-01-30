import React from 'react';

export const RulesHero = () => {
  return (
    <section className="bg-black text-white min-h-[400px] flex relative">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2">
        
        {/* Left: Text Content */}
        <div className="px-4 py-16 md:py-24 flex flex-col justify-center z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-orange-500 mb-6 leading-tight">
            Rules & Guidance
          </h1>
          <p className="text-gray-300 font-light leading-relaxed max-w-lg">
            Access essential standards, compliance requirements, and best-practice guidance designed to support responsible, ethical, and compliant international student recruitment.
          </p>
        </div>

        {/* Right: Image */}
        <div className="relative h-full min-h-[300px] w-full bg-zinc-800">
           {/* Image of person writing/signing */}
           <img 
             src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop" 
             alt="Rules and Compliance" 
             className="absolute inset-0 w-full h-full object-cover opacity-80"
           />
           {/* Gradient Overlay for seamless blend */}
           <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};