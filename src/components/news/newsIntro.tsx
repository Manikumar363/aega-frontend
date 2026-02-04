import { Link as LucideLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/Button";

const BLOGS = [
  {
    title: "Merging Vision with Strategic Action",
    description:
      "Maxwell Harper’s “Leadership in Investment” explores improving investment strategies.",
    image: "/presentation-1.png",
  },
  {
    title: "The Five Secrets to Investing Success",
    description:
      "Discover five key principles that top investors use to maximize returns and minimize risks.",
    image: "/trading.png",
  },
  {
    title: "Strategic Investing for 2025 and Beyond",
    description:
      "Explore forward-looking investment strategies designed to thrive in an evolving global market.",
    image: "/why-aega.png",
  },
];

export default function NewsIntro() {
  return (
    <section className="w-full bg-[#03091F] py-6">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white">NEWS</h2>
          <Link href="/news/main">
            <Button className="bg-[#F68E2D] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
              View All
              <span aria-hidden className="text-lg">↘</span>
            </Button>
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {BLOGS.map((blog) => (
            <div
              key={blog.title}
              className="border border-white/10 bg-[#0A1628]/40"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white text-xl font-bold mb-3 leading-snug">
                  {blog.title}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {blog.description}
                </p>
                <button className="text-white text-xs font-semibold uppercase tracking-wide flex items-center gap-2 border-b border-white/40 pb-2">
                  Learn More
                  <span aria-hidden className="text-sm">↘</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
