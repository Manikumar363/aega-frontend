import Image from "next/image";

const LEARNING_PATHS = [
    "Onboarding",
    "Mandatory Training",
    "CPD Tracking",
    "Compliance Scoring",
    "Insurance Support",
    "Certification",
    "Ongoing Monitoring",
];

export default function AgentLearning() {
    return (
        <section className="relative w-full min-h-[600px] bg-[#03091F] overflow-hidden py-12 md:py-24">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-white font-bold text-3xl md:text-5xl">AEGA LEARNING PATH</h2>
                    <p className="text-white/80 mt-3">Comprehensive support at every stage of your agent development journey</p>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full gap-10 md:gap-20">
                    {/* Left: Learning Path List */}
                    <div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
                        <div className="flex flex-col gap-8">
                            {LEARNING_PATHS.map((item, index) => (
                                <div key={item}>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[#F68E2D] font-bold text-lg md:text-xl">
                                            {String(index + 1).padStart(2, "0")}.
                                        </span>
                                        <span className="text-white text-base md:text-lg font-semibold">{item}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Photo with orange corners */}
                    <div className="relative w-full md:w-1/2 max-w-md flex-shrink-0 flex flex-col items-center md:items-start">
                        <div className="relative w-full aspect-[2/3] max-w-md shadow-2xl overflow-hidden">
                            <Image
                                src="/presentation.jpg"
                                alt="Agent Learning Path"
                                fill
                                className="object-cover object-center rounded-none"
                                priority
                            />
                            <div className="absolute -top-5 -left-5 w-20 h-20 bg-[#F68E2D] rotate-45" />
                            <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-[#F68E2D] rotate-45" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
