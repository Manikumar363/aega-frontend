import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="w-full bg-[#050B26] border-y border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* MISSION */}
        <div className="p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-white/5 hover:bg-[#081035] transition-colors group">
          <div className="w-14 h-14 bg-[#03091F] border border-white/10 flex items-center justify-center mb-8 group-hover:border-[#F58A07] transition-colors">
            <Target className="w-6 h-6 text-[#F58A07]" />
          </div>
          <h3 className="text-3xl font-bold text-white uppercase tracking-wide mb-6">Our Mission</h3>
          <p className="text-gray-400 leading-relaxed font-light">
            To standardise and elevate the international education recruitment industry by providing verification, resources, and a unified voice for agents and educators worldwide.
          </p>
        </div>

        {/* VISION */}
        <div className="p-16 lg:p-24 hover:bg-[#081035] transition-colors group">
          <div className="w-14 h-14 bg-[#03091F] border border-white/10 flex items-center justify-center mb-8 group-hover:border-[#F58A07] transition-colors">
            <Eye className="w-6 h-6 text-[#F58A07]" />
          </div>
          <h3 className="text-3xl font-bold text-white uppercase tracking-wide mb-6">Our Vision</h3>
          <p className="text-gray-400 leading-relaxed font-light">
            A world where every student has access to honest, transparent, and high-quality educational guidance, regardless of where they come from.
          </p>
        </div>

      </div>
    </section>
  );
}