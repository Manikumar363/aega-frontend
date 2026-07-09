import { ArrowUpRight } from 'lucide-react';

interface WhatWeDoItem {
  heading: string;
  description: string;
  numbering: number;
}

interface WhatWeDoProps {
  data?: WhatWeDoItem[];
}

export default function WhatWeDo({ data }: WhatWeDoProps) {
  const services = Array.isArray(data) && data.length > 0 ? data : [
    {
      heading: "Global Networking",
      description: "Connecting agents and educators worldwide to foster meaningful partnerships and alliances.",
      numbering: 1
    },
    {
      heading: "Compliance Support",
      description: "Providing resources, checklists and guidance to ensure ethical recruitment practices.",
      numbering: 2
    },
    {
      heading: "Market Intelligence",
      description: "Delivering data-driven insights to help members stay ahead of international trends.",
      numbering: 3
    },
    {
      heading: "Training & Certification",
      description: "Offering professional courses to elevate standards and staff capabilities.",
      numbering: 4
    }
  ];

  return (
    <section className="w-full bg-[#03091F] py-24">
      <div className="container mx-auto px-8 md:px-12">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-end">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#F58A07]"></div>
              <span className="text-[#F58A07] font-bold tracking-widest text-xs uppercase">Our Expertise</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
              WHAT WE DO
            </h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed lg:text-right max-w-md ml-auto text-left lg:text-left">
            We empower the international education community with the tools, connections, and intelligence needed to thrive in a competitive landscape.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="group p-8 border border-white/5 hover:border-[#F58A07]/50 bg-[#050B26] hover:bg-[#081035] transition-all duration-300 flex flex-col h-full relative overflow-hidden rounded-lg text-left">
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F58A07] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

              {/* Number/Icon */}
              <div className="w-12 h-12 mb-8 bg-white/5 rounded-none flex items-center justify-center group-hover:bg-[#F58A07] text-[#F58A07] group-hover:text-white font-bold transition-all duration-300">
                {String(service.numbering || index + 1).padStart(2, '0')}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-4 tracking-wide">{service.heading}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light flex-grow">
                {service.description}
              </p>

              <div className="flex items-center gap-2 text-[#F58A07] text-[10px] font-bold tracking-widest uppercase cursor-pointer mt-auto">
                Discover
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}