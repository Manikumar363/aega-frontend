import Image from "next/image";

const GUIDELINES = [
    "UKVI Compliance Standards",
    "Ethical Practice Framework",
    "Student Protection Protocols",
    "Financial Conduct Guidelines",
    "Marketing & Advertising Standards",
    "Data Protection & Privacy",
];

export default function Compliance() {
    return (
        <section className="relative w-full min-h-[600px] bg-[#03091F] overflow-hidden flex items-center justify-center py-12 md:py-24">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-10 gap-10 md:gap-20">
                {/* Left: Photo with orange corners */}
                <div className="relative w-full md:w-1/2 max-w-md flex-shrink-0 flex flex-col items-center md:items-start">
                    <div className="relative w-full aspect-[2/3] max-w-md shadow-2xl overflow-hidden">
                        <Image
                            src="/benefits.png"
                            alt="Professional Guidelines Photo"
                            fill
                            className="object-cover object-center rounded-none"
                            priority
                        />
                    </div>
                </div>

                {/* Right: Guidelines */}
                <div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
                    <h2 className="text-white font-bold text-4xl md:text-5xl mb-6 leading-tight">PROFESSIONAL GUIDELINES</h2>
                    <p className="text-white/80 text-base md:text-lg font-normal leading-relaxed mb-8">
                        Our comprehensive guidelines ensure you operate to the highest standards, maintain regulatory compliance, and protect student welfare.
                    </p>
                    <div className="flex flex-col gap-6">
                        {GUIDELINES.map((item) => (
                            <div key={item}>
                                <div className="text-white text-base md:text-lg font-semibold">{item}</div>
                                <div className="w-full h-px bg-white/60 mt-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
