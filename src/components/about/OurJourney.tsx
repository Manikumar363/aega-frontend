import Image from "next/image";

const MILESTONES = [
	{
		year: "2020",
		title: "AEGA Founded",
		desc: "Launched with 50 founding members",
	},
	{
		year: "2021",
		title: "600 Agents",
		desc: "Reached 600 certified agents across 15 countries",
	},
	{
		year: "2022",
		title: "Global Expansion",
		desc: "Expanded to 36 countries with university partnerships",
	},
	{
		year: "2023",
		title: "100+ Universities",
		desc: "Partnered with over 100 institutions worldwide",
	},
	{
		year: "2024",
		title: "2,500 Agents",
		desc: "Certified 2,500+ agents with 50,000+ CPD hours delivered",
	},
];

export default function OurJourney() {
	return (
		<section className="relative w-full min-h-[600px] bg-[#03091F] overflow-hidden flex items-center justify-center py-12 md:py-24">
			<div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-10 gap-10 md:gap-20">
				{/* Left: Photo with orange corners */}
				<div className="relative w-full md:w-1/2 max-w-md flex-shrink-0 flex flex-col items-center md:items-start">
					{/* Top Left Orange Overlay */}
					<div className="absolute left-0 top-0 w-32 h-16 z-10" style={{transform: 'translate(-30%, -40%)'}}>
						<Image src="/ourVision-design.png" alt="corner" fill className="object-contain" style={{objectPosition: 'left top'}} />
					</div>
					{/* Bottom Right Orange Overlay */}
					<div className="absolute right-0 bottom-0 w-32 h-16 z-10" style={{transform: 'translate(30%, 40%) rotate(180deg)'}}>
						<Image src="/ourVision-design.png" alt="corner" fill className="object-contain" style={{objectPosition: 'right bottom'}} />
					</div>
					<div className="relative w-full aspect-[4/3] max-w-md shadow-2xl overflow-hidden">
						<Image
							src="/OurJourney.png"
							alt="Our Journey Photo"
							fill
							className="object-cover object-center rounded-none"
							priority
						/>
					</div>
				</div>

				{/* Right: Timeline */}
				<div className="flex flex-col justify-center w-full md:w-1/2 max-w-xl text-left">
					<h2 className="text-white font-bold text-4xl md:text-5xl mb-10 leading-tight">OUR JOURNEY</h2>
					<div className="flex flex-col gap-8">
						{MILESTONES.map((item, idx) => (
							<div key={item.year} className="">
								<div className="flex flex-col md:flex-row md:items-center md:gap-4">
									<span className="text-white text-lg md:text-xl font-bold mr-2 whitespace-nowrap">{item.year}</span>
									<span className="text-white text-lg md:text-xl font-bold">{item.title}</span>
								</div>
								<div className="text-white/80 text-base md:text-lg font-normal mt-1 mb-2 md:mb-0">{item.desc}</div>
								<div className="w-full h-px bg-white/80 mt-3" />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
