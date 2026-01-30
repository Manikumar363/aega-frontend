import Image from "next/image";

export default function OurStory() {
  return (
   <section className="relative w-full min-h-screen bg-[#03091F] overflow-hidden flex items-center justify-center py-12 md:py-24">
         {/* Background Geometric Design */}
         <div className="absolute left-5 right-5 top-0 w-1/2 h-full opacity-80">
           <Image
             src="/ourVision-design.png"
             alt="Background design"
             fill
             className="object-cover object-center"
             priority
           />
         </div>
   
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-10 gap-8 md:gap-16">
           {/* Left: Photo with label */}
           <div className="flex flex-col items-center md:items-start w-full md:w-5/12 pt-8">
             <span 
               className="text-white font-semibold ml-8 text-sm -mt-6 md:text-base mb-6 md:mb-13" 
               style={{letterSpacing: '0.08em'}}
             >
               STORY OF US
             </span>
             <div className="relative ml-5 -mt-10 w-full max-w-xs aspect-3/4 shadow-2xl overflow-hidden">
               <Image
                 src="/our-vision.png"
                 alt="Story of Us Photo"
                 fill
                 className="object-cover object-center"
                 priority
               />
             </div>
           </div>
   
           {/* Right: Vision Text */}
           <div className="flex flex-col justify-center w-full md:w-7/12 text-left md:pl-8">
             <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">OUR STORY</h2>
             <p className="text-white text-base md:text-lg font-normal leading-relaxed">
               AEGA was born from a "little red book of ideas" in a Rome cafe, fueled by 22 years of searching for a way to transform global student recruitment. Having served in uniform and practiced law, our founder Pete Yetton saw the urgent need to move beyond surface-level marketing to deeper "Layer 3" business compliance. We listened to agents struggling with shifting regulations and universities balancing growth with ethical responsibility. Today, we bridge that gap from our hubs in Dubai and the UK, turning those initial ideas into a global alliance that treats integrity as the foundation of every student’s future.
             </p>
           </div>
         </div>
       </section>
  );
}
