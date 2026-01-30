import { ArrowUpRight } from 'lucide-react';

export default function JoinCTA() {
  return (
    <section className="w-full bg-[#F58A07] py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-[#03091F] uppercase mb-8 tracking-tight">
          Ready to Elevate <br /> Your Standards?
        </h2>
        <p className="text-[#03091F]/80 text-lg max-w-2xl mx-auto mb-10 font-medium">
          Join hundreds of verified agents and educators in the fastest growing global alliance.
        </p>
        
        <div className="flex justify-center gap-6">
          <button className="bg-[#03091F] text-white px-10 py-4 font-bold tracking-wide flex items-center gap-2 hover:bg-black transition-colors shadow-xl">
            BECOME A MEMBER
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}