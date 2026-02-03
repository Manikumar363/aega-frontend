import Image from "next/image";

export default function PreCase() {
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
             <div className="relative ml-5 -mt-10 w-full max-w-xs aspect-3/4 shadow-2xl overflow-hidden">
               <Image
                 src="/presentation.jpg"
                 alt="Pre-CAS Session"
                 fill
                 className="object-cover object-center"
                 priority
               />
             </div>
           </div>
   
           {/* Right: Vision Text */}
           <div className="flex flex-col justify-center w-full md:w-7/12 text-left md:pl-8">
            <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
              THE PRE-CAS & STUDENT
              <br />
              READINESS PROTOCOL
            </h2>
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-white text-lg md:text-xl font-bold mb-2">Pre-cas Pre-CAS Interviews:</h3>
                <p className="text-white/80 text-base md:text-lg font-normal leading-relaxed">
                  Members must conduct detailed interviews that evaluate a student’s intent, linguistic readiness, and financial stability.
                </p>
                <div className="w-full h-px bg-white/30 mt-6" />
              </div>
              <div>
                <h3 className="text-white text-lg md:text-xl font-bold mb-2">Feedback & Clarifications:</h3>
                <p className="text-white/80 text-base md:text-lg font-normal leading-relaxed">
                  Every interview requires a standardized feedback loop to provide further guidance to the student or to help the Sponsor make informed CAS decisions.
                </p>
                <div className="w-full h-px bg-white/30 mt-6" />
              </div>
              <div>
                <h3 className="text-white text-lg md:text-xl font-bold mb-2">Student Due Diligence:</h3>
                <p className="text-white/80 text-base md:text-lg font-normal leading-relaxed">
                  A standardized due diligence overview to verify academic credentials and personal documentation, mirroring the rigour of legal frameworks.
                </p>
                <div className="w-full h-px bg-white/30 mt-6" />
              </div>
            </div>
           </div>
         </div>
       </section>
  );
}
