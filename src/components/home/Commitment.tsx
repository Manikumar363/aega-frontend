
import Image from "next/image";

const STATS = [
	{ value: "500+", label: "successful consultations" },
	{ value: "200+", label: "hours of expert-led investment" },
	{ value: "100+", label: "publications on investment" },
	{ value: "3K+", label: "satisfied clients" },
];

const COMMITMENTS = [
	{
		title: "Integrity",
		desc: "Transparent, ethical practice in every decision.",
	},
	{
		title: "Collaboration",
		desc: "Building trusted partnerships across the globe.",
	},
	{
		title: "Innovation",
		desc: "Technology-led solutions for modern recruitment challenges.",
	},
	{
		title: "Excellence",
		desc: "High standards in every policy, process, and service.",
	},
	{
		title: "Responsibility",
		desc: "A duty of care to agents, institutions, and students.",
	},
];

export default function Commitment() {
	return (
		<section className="relative w-full bg-[#03091F] overflow-hidden py-16 px-2 md:px-0">
			{/* Diagonal Orange Background */}
			<div className="absolute right-0 -top-13 w-[70vw] h-[70vw] max-w-5xl max-h-[800px] z-0" style={{clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)'}}>
				<Image
					src="/commitment-design.png" // replace with your diagonal bg image
					alt="Diagonal Orange Background"
					fill
					className="object-cover object-top-right"
					priority
				/>
			</div>

			{/* Stats Row */}
			<div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-0 max-w-5xl mx-auto mb-16">
				{STATS.map((stat, i) => (
					<div
						key={stat.value}
						className={`flex-1 flex flex-col items-center justify-center py-8 px-2 md:px-0 ${i === 3 ? 'text-white font-bold' : 'text-white'} ${i === 3 ? 'relative' : ''}`}
						style={i === 3 ? {background: 'none'} : {}}
					>
						<span className="text-4xl md:text-5xl font-bold mb-1">{stat.value}</span>
						<span className="text-base md:text-lg text-center font-normal opacity-80">{stat.label}</span>
					</div>
				))}
			</div>

			{/* Commitment Section */}
			<div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
				{/* Left: Commitments List */}
				<div className="flex flex-col gap-0 w-full">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-8">OUR COMMITMENT</h2>
					<div className="flex flex-col divide-y divide-white/30">
						{COMMITMENTS.map((item, idx) => (
							<div key={item.title} className="py-4 flex flex-col">
								<span className="text-white font-bold text-lg mb-1">
									<span className="text-[#F58A07] mr-2">{String(idx + 1).padStart(2, '0')}.</span> {item.title}
								</span>
								<span className="text-white/80 text-base font-light">{item.desc}</span>
							</div>
						))}
					</div>
				</div>

				{/* Right: Image and Description over Diagonal */}
				<div className="relative flex flex-col items-center justify-center w-full h-full">
					<div className="relative w-full max-w-md aspect-4/3 shadow-2xl overflow-hidden mb-4">
						<Image
							src="/commitment.jpeg" // replace with your image
							alt="Commitment Visual"
							fill
							className="object-cover object-center"
							priority
						/>
					</div>
					<div className="bg-[#03091F] p-6 rounded-lg w-full max-w-md -mt-8">
						<div className="flex items-center gap-3 mb-2">
							<Image src="/logo.png" alt="AEGA Logo" width={160} height={130} className="object-contain" />
						</div>
						<p className="text-white/90 text-base font-light">
							AEGA is the premier global alliance for the student recruitment sector, bridging operational gaps, strengthening compliance, and ensuring safer, more sustainable international mobility.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
