import { ArrowRight } from 'lucide-react';

export default function Topics() {
  return (
    <section className="w-full bg-[#03091F] py-24">
      <div className="container mx-auto px-8 md:px-12">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#F58A07] font-bold tracking-widest text-xs uppercase block mb-3">Latest Insights</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
              News & Articles
            </h2>
          </div>
          <a href="/news" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest transition-colors">
            VIEW ALL
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group cursor-pointer flex flex-col h-full">
              {/* Image Container */}
              <div className="w-full aspect-[16/10] bg-gray-800 relative overflow-hidden mb-5 border border-white/5">
                 {/* Replace with <img src="..." /> */}
                 <div className="absolute inset-0 bg-gray-800 group-hover:scale-105 transition-transform duration-700 ease-out"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
                    [Article Image {item}]
                 </div>
                 
                 {/* Date Tag */}
                 <div className="absolute top-0 left-0 bg-[#050B26] px-4 py-2 border-r border-b border-white/10">
                    <span className="text-[#F58A07] font-bold text-xs tracking-widest">24 OCT</span>
                 </div>
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-grow">
                 <div className="flex items-center gap-3 mb-3 text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                    <span>Analysis</span>
                    <span className="w-1 h-1 rounded-full bg-[#F58A07]"></span>
                    <span>5 Min Read</span>
                 </div>
                 
                 <h3 className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-[#F58A07] transition-colors">
                   The Future of International Student Recruitment in a Digital Age
                 </h3>
                 
                 <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow font-light">
                   Exploring how digital transformation is reshaping the landscape for agents and educators alike, creating new opportunities for growth.
                 </p>
                 
                 <div className="flex items-center gap-2 text-white text-[10px] font-bold tracking-widest uppercase mt-auto group-hover:gap-3 transition-all">
                   Read Full Story
                   <ArrowRight className="w-3 h-3 text-[#F58A07]" />
                 </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}