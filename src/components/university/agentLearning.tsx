import Image from "next/image";

const LEARNING_PATHS = [
    {
        title: "Onboarding",
        description: "A structured introduction to AEGA's standards, systems, and expectations to get you started on the right foot.",
    },
    {
        title: "Mandatory Training",
        description: "Complete required modules covering ethics, compliance frameworks, and best practices in international student recruitment.",
    },
    {
        title: "CPD Tracking",
        description: "Log and monitor your Continuing Professional Development hours to maintain your accreditation and demonstrate growth.",
    },
    {
        title: "Compliance Scoring",
        description: "Receive a real-time compliance score reflecting your adherence to AEGA's regulatory and ethical standards.",
    },
    {
        title: "Insurance Support",
        description: "Access guidance and resources on professional indemnity insurance to protect your agency and clients.",
    },
    {
        title: "Certification",
        description: "Earn AEGA-recognised certifications that validate your expertise and build trust with universities and students.",
    },
    {
        title: "Ongoing Monitoring",
        description: "Continuous oversight and feedback to ensure sustained compliance, quality practice, and professional development.",
    },
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
                        <div className="flex flex-col">
                            {LEARNING_PATHS.map((item, index) => (
                                <div key={item.title}>
                                    <div className="flex items-baseline gap-4 py-4">
                                        <span className="text-[#F68E2D] font-bold text-5xl md:text-6xl leading-none shrink-0">
                                            {String(index + 1).padStart(2, "0")}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[#F68E2D] text-lg md:text-xl font-semibold">{item.title}</span>
                                            <span className="text-white/70 text-sm md:text-base font-light leading-relaxed">{item.description}</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-[#F68E2D]/30 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Photo with orange corners */}
                    <div className="relative w-full md:w-1/2 max-w-md shrink-0 flex flex-col items-center md:items-start">
                        <div className="relative w-full aspect-2/4 max-w-md shadow-2xl overflow-hidden">
                            <Image
                                src="/peter-founders.png"
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
