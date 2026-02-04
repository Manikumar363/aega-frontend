import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function NewsMain() {
  const BLOGS = [
    {
      image: "/blog-1.jpg",
      title: "Merging Vision with Strategic Action",
      description:
        "Maxwell Harper's \"Leadership in Investment\" explores improving investment strategies.",
      link: "#",
    },
    {
      image: "/blog-2.jpg",
      title: "The Five Secrets to Investing Success",
      description:
        "Discover five key principles that top investors use to maximize returns and minimize risks.",
      link: "#",
    },
    {
      image: "/blog-3.jpg",
      title: "Strategic Investing for 2025 and Beyond",
      description:
        "Explore forward-looking investment strategies designed to thrive in an evolving global market.",
      link: "#",
    },
    {
      image: "/blog-4.jpg",
      title: "Effectively Managing Financial Risk",
      description:
        "Get practical guidance on spotting, evaluating, and managing risks for better decisions.",
      link: "#",
    },
    {
      image: "/blog-5.jpg",
      title: "How Tech is Rapidly Changing Investing",
      description:
        "See how AI, blockchain, and innovations are rapidly changing investments today.",
      link: "#",
    },
    {
      image: "/blog-6.jpg",
      title: "How Global Events Impact Investment",
      description:
        "See how global events shape markets and guide investment decisions effectively today.",
      link: "#",
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
            NEWS & EVENTS › LATEST INDUSTRY NEWS
          </p>
        </div>

        {/* Heading */}
        <h1 className="mb-16 text-5xl font-bold text-white md:text-6xl">
          LATEST INDUSTRY NEWS  
        </h1>

        {/* Blog Cards Grid - 3 columns, 2 rows */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BLOGS.map((blog, index) => (
            <article
              key={index}
              className="group overflow-hidden bg-[#0F1A3A] transition-all hover:bg-[#1A2547]"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white leading-tight">
                  {blog.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  {blog.description}
                </p>

                {/* Learn More Link */}
                <a
                  href={blog.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:text-[#F58A07]"
                >
                  LEARN MORE
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
