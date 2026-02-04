import Image from "next/image";

const SYSTEM_ITEMS = [
    {
        title: "Whole Business Health Checks",
        desc: "A comprehensive 360-degree assessment to identify process breaks, operational gaps, and recommended enhancements for sustainable growth.",
    },
    {
        title: "Lean Working & Systems Integration",
        desc: "Guidance on integrating technology-driven features—including tailor-made CRMs and workflow automation—to reduce manual error and increase oversight.",
    },
    {
        title: "Organizational Restructuring",
        desc: "Workshop support for mapping the student journey with a new organizational shape that clarifies roles, responsibilities, and leadership dynamics.",
    },
];

export default function SystemIntegration() {
    return (
        <section className="relative w-full min-h-[600px] bg-[#03091F] overflow-hidden flex items-center justify-center py-12 md:py-24">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-10 gap-10 md:gap-20">
                {/* Left: Content */}
                <div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
                    <h2 className="text-white font-bold text-4xl md:text-3xl lg:text-4xl mb-10 leading-tight">
                        OPERATIONAL
                        <br />
                        FRAMEWORKS &
                        <br />
                        SYSTEMS INTEGRATION
                    </h2>
                    <div className="flex flex-col gap-10">
                        {SYSTEM_ITEMS.map((item) => (
                            <div key={item.title}>
                                <div className="text-white text-lg md:text-lg font-bold mb-2">{item.title}</div>
                                <div className="text-white/80 text-base md:text-md font-normal">{item.desc}</div>
                                <div className="w-full h-px bg-white/20 mt-11" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Photo with orange corners */}
                <div className="relative w-full md:w-1/2 max-w-md shrink-0 flex flex-col items-center md:items-start">
                    <div className="relative w-full aspect-2/3 max-w-md shadow-2xl overflow-hidden">
                        <Image
                            src="/benefits.png"
                            alt="Operational Systems Photo"
                            fill
                            className="object-cover object-center rounded-none"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
