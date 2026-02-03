import Image from "next/image";

const BENEFITS = [
    {
        title: "Professional Certification Founded",
        desc: "Recognized credentials that build trust",
    },
    {
        title: "Compliance Tracking",
        desc: "Real-time monitoring and support",
    },
    {
        title: "Business Tools",
        desc: "Resources to streamline operations",
    },
    {
        title: "CPD Library",
        desc: "Unlimited access to training courses",
    },
    {
        title: "Insurance Support",
        desc: "Guidance on professional indemnity",
    },
    {
        title: "Best Practices",
        desc: "Learn from industry leaders",
    },
];

export default function Membership() {
    return (
        <section className="relative w-full min-h-[600px] bg-[#03091F] overflow-hidden py-12 md:py-24">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-white font-bold text-3xl md:text-5xl">MEMBERSHIP BENEFITS</h2>
                    <p className="text-white/80 mt-3">Build your reputation and grow your business</p>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full gap-10 md:gap-20">
                    {/* Left: Benefits List */}
                    <div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
                        <div className="flex flex-col gap-8">
                            {BENEFITS.map((item) => (
                                <div key={item.title}>
                                    <div className="text-white text-lg md:text-xl font-bold">{item.title}</div>
                                    <div className="text-white/80 text-base md:text-lg font-normal mt-1">{item.desc}</div>
                                    <div className="w-full h-px bg-white/60 mt-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Photo with orange corners */}
                    <div className="relative w-full md:w-1/2 max-w-md flex-shrink-0 flex flex-col items-center md:items-start">
                        <div className="relative w-full aspect-[2/3] max-w-md shadow-2xl overflow-hidden">
                            <Image
                                src="/benefits.png"
                                alt="Membership Benefits Photo"
                                fill
                                className="object-cover object-center rounded-none"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
