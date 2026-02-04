import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function EventsMain() {
  const EVENTS = [
    {
      image: "/event-1.jpg",
      title: "Merging Vision with Strategic Action",
      description:
        "Maxwell Harper's \"Leadership in Investment\" explores improving investment strategies.",
      date: "2024-03-15",
      link: "#",
    },
    {
      image: "/event-2.jpg",
      title: "The Five Secrets to Investing Success",
      description:
        "Discover five key principles that top investors use to maximize returns and minimize risks.",
      date: "2024-04-20",
      link: "#",
    },
    {
      image: "/event-3.jpg",
      title: "Strategic Investing for 2025 and Beyond",
      description:
        "Explore forward-looking investment strategies designed to thrive in an evolving global market.",
      date: "2024-05-30",
      link: "#",
    },
    {
      image: "/event-4.jpg",
      title: "Effectively Managing Financial Risk",
      description:
        "Get practical guidance on spotting, evaluating, and managing risks for better decisions.",
      date: "2024-06-10",
      link: "#",
    },
    {
      image: "/event-5.jpg",
      title: "How Tech is Rapidly Changing Investing",
      description:
        "See how AI, blockchain, and innovations are rapidly changing investments today.",
      date: "2024-07-15",
      link: "#",
    },
    {
      image: "/event-6.jpg",
      title: "How Global Events Impact Investment",
      description:
        "See how global events shape markets and guide investment decisions effectively today.",
      date: "2024-08-20",
      link: "#",
    },
  ];
  const TESTIMONIALS = [
    {
      quote:
        "Maxwell Harper's insights reshaped my investing. His strategies boosted my portfolio by 30% in six months and built my confidence in any market.",
      name: "Sarah Thompson",
      role: "Senior Investment Advisor",
      avatar: "/sara.png",
    },
    {
      quote:
        "Thanks to Maxwell Harper, I've completely changed how I invest. His clear guidance helped me achieve growth and make smarter decisions.",
      name: "Michael Carter",
      role: "Entrepreneur & Investor",
      avatar: "/sara.png",
    },
    {
      quote:
        "Maxwell's expert strategies gave me a fresh perspective on investing. My returns improved, and I finally feel in control of my finances.",
      name: "Laura Stevens",
      role: "Senior Financial Analyst",
      avatar: "/sara.png",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#0A1628] py-16">
      {/* Orange Diagonal Background - Top Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-[50%] bg-linear-to-bl from-[#F58A07] via-[#C86A2A] to-transparent opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/60">
            NEWS & EVENTS › EVENTS
          </p>
        </div>

        {/* Heading */}
        <h1 className="mb-16 text-5xl font-bold text-white md:text-6xl">
          EVENTS
        </h1>

        {/* Events Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EVENTS.map((event, index) => (
            <article key={index} className="bg-black">
              <div className="relative h-56 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase text-white/60 mb-2">{event.date}</div>
                <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-white/70 text-sm mb-6">{event.description}</p>
                <a
                  href={event.link}
                  className="inline-flex items-center gap-2 bg-[#F68E2D] text-white px-5 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-[#c86a2a] transition-colors"
                >
                  REGISTER NOW <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-center text-3xl md:text-5xl font-bold text-white mb-12">
            WHAT OUR LOYAL CLIENTS SAY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((item, index) => (
              <div
                key={item.name}
                className={`text-white ${index > 0 ? "md:border-l md:border-white/30 md:pl-8" : ""}`}
              >
                <p className="text-base md:text-lg font-semibold leading-relaxed mb-6">
                  “{item.quote}”
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{item.name}</p>
                    <p className="text-white/70 text-sm">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
