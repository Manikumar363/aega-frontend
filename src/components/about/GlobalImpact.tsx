import Image from "next/image";

const IMPACT_STATS = [
    { value: "500+", label: "successful partnerships" },
    { value: "200+", label: "local or capital investment" },
    { value: "100+", label: "publications on investment" },
    { value: "3K+", label: "initiated clients" },
];

const REGIONS = [
    {
        name: "ASIA-PACIFIC",
        data: ["1248", "45,620", "78", "2024"],
        labels: ["Members", "Students", "Universities", "since"],
    },
    {
        name: "EUROPE",
        data: ["1248", "45,620", "78", "2024"],
        labels: ["Members", "Students", "Universities", "since"],
    },
    {
        name: "MIDDLE EAST & AFRICA",
        data: ["1248", "45,620", "78", "2024"],
        labels: ["Members", "Students", "Universities", "since"],
    },
    {
        name: "AMERICAS",
        data: ["1248", "45,620", "78", "2024"],
        labels: ["Members", "Students", "Universities", "since"],
    },
];

const IMPACT_ICONS = [
    { value: "21,428,759", label: "class of access to education", color: "bg-[#81EAA5]", icon: "/book.png" },
    { value: "11,951,293", label: "class of life skills", color: "bg-[#B5A7FD]", icon: "/hands.png" },
    { value: "15,785,861", label: "Area of career impact", color: "bg-[#F03760]", icon: "/plate.png" },
    { value: "950,578", label: "Enrol physical education usage", color: "bg-[#81EAA5]", icon: "/bowl.png" },
    { value: "5,870,890", label: "employ training people directly", color: "bg-[#B5A7FD]", icon: "/bowl2.png" },
    { value: "2,384,823", label: "class of shelter provided", color: "bg-[#F03760]", icon: "/home.png" },
    { value: "5,091,463", label: "days of medical support", color: "bg-[#81EAA5]", icon: "/medicaid.png" },
    { value: "11,951,293", label: "class of life enhancement support", color: "bg-[#B5A7FD]", icon: "/hands.png" },
    { value: "2,523,098", label: "units towards infrastructure improvement", color: "bg-[#F03760]", icon: "/bricks.png" },
    { value: "771,822", label: "green energy projects enabled", color: "bg-[#81EAA5]", icon: "/hands.png" },
    { value: "5,568,589", label: "direct employment creation", color: "bg-[#B5A7FD]", icon: "/sanitizer.png" },
    { value: "234,977", label: "days of vocational partnership tools", color: "bg-[#F03760]", icon: "/screw.png" },
];

export default function GlobalImpact() {
    return (
        <section className="relative w-full bg-[#03091F] overflow-hidden pb-20">
            {/* Top right orange diagonal */}
            <div className="hidden md:block absolute right-0 top-0 w-[120vw] h-80 -z-10">
                <Image src="/orange-design1.png" alt="orange diagonal" fill className="object-cover object-top-right" />
            </div>
            {/* Bottom left orange diagonal */}
            <div className="hidden md:block absolute right-250 bottom-4 w-[50vw] h-[300px] -z-10 rotate-180 ">
                <Image src="/orange-design1.png" alt="orange diagonal" fill className="object-cover object-bottom-right" />
            </div>

            {/* Heading */}
            <div className="pt-16 pb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">GLOBAL IMPACT</h2>
                <p className="text-white/80 max-w-lg items-start text-start ml-80 mx-auto mb-8 mt-20 text-sm md:text-xs">
                   AEGA's influence spans 45+ countries, supporting thousands of agents,<br /> partnering with leading universities, and protecting hundreds of thousands <br /> of students worldwide.
                </p>
            </div>

            {/* Impact Stats Row */}
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mb-16 px-4">
                {/* Orange diagonal overlay for stats */}
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[40vw] h-[120px] pointer-events-none -z-10">
                    <Image src="/ourVision-design.png" alt="orange diagonal" fill className="object-cover object-right" />
                </div>
                {IMPACT_STATS.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center min-w-[120px]">
                        <span className="text-4xl md:text-5xl font-bold text-white mb-1">{stat.value}</span>
                        <span className="text-white/80 text-base md:text-lg text-center font-medium">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Regional Presence */}
            <div className="mb-16 px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 tracking-wide">REGIONAL PRESENCE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {REGIONS.map((region, i) => (
                        <div key={region.name} className="border border-white/20 p-6 flex flex-col gap-2 bg-gray/60">
                            <span className="text-lg font-bold text-white mb-2">{region.name}</span>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {region.data.map((val, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <span className="text-white text-lg font-bold">{val}</span>
                                        <span className="text-white/60 text-xs">{region.labels[idx]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Every Impact Counts */}
            <div className="mb-16 px-15 max-w-2xl ml-40 mx-auto">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-2">Every Impact Counts</h4>
                <p className="text-white/80 mb-4 text-xs md:text-base">
                    When impact is embedded into your service mission, it doesn't depend on motivation or momentum. It grows steadily, alongside your business. And together, every working moment is an impact, creating a better future for all of us.
                </p>
                {/* Progress bar */}
                <div className="w-full bg-white/90 rounded-full h-3 mb-2 overflow-hidden">
                    <div className="bg-[#B5A7FD] h-3 rounded-full" style={{width: '40%'}} />
                </div>
                <div className="text-white/60 text-xs mt-1">Our Members have already created</div>
                <div className="text-white text-3xl md:text-4xl font-bold mt-2">392,003,345</div>
                <div className="text-white/60 text-xs mt-1">Global impacts</div>
            </div>

            {/* Impact Icons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-6xl mx-auto mb-16 px-4">
                {IMPACT_ICONS.map((icon, i) => (
                    <div key={i} className="flex flex-col items-center justify-start">
                        {/* Colored Icon Box */}
                        <div className={`w-28 h-28 flex items-center justify-center rounded-none mb-4 ${icon.color}`}>
                            <Image src={icon.icon} alt="icon" width={64} height={64} />
                        </div>
                        {/* Number */}
                        <span className="text-white text-xl font-light leading-tight mb-1 text-center">{icon.value}</span>
                        {/* Description, split into two lines if possible */}
                        <span className="text-white/90 text-xs font-light text-center leading-snug" style={{wordBreak: 'break-word'}}>
                            {icon.label.split(' ').length > 4
                              ? <>
                                  {icon.label.split(' ').slice(0, Math.ceil(icon.label.split(' ').length/2)).join(' ')}<br/>
                                  {icon.label.split(' ').slice(Math.ceil(icon.label.split(' ').length/2)).join(' ')}
                                </>
                              : icon.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA Card */}
            <div className="relative max-w-3xl mx-auto rounded-lg overflow-hidden shadow-2xl px-0">
                <Image src="/global-impact.jpeg" alt="CTA" fill className="object-cover object-center opacity-60" />
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/60">
                    <div>
                        <div className="text-white/80 text-sm mb-2">Need help getting started?</div>
                        <div className="text-white text-2xl md:text-xl font-light mb-2">See how this really works for <br/> your business</div>
                        <div className="text-white/80 text-sm font-light mb-4">Take a short questionnaire to get a free tailored plan <br/> for your business.</div>
                        <button className="bg-[#F68E2D] text-white/80 font-light px-4 py-1 rounded hover:bg-[#d97706] transition-colors">GET YOUR GIVING IMPACT PLAN</button>
                    </div>
                </div>
            </div>
        </section>
    );
}