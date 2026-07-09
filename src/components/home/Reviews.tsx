import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  review: string;
  image?: string;
  userDetails: string;
}

interface ReviewsProps {
  data?: TestimonialItem[];
}

export default function Reviews({ data }: ReviewsProps) {
  const formatImage = (path?: string, fallback: string = "") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = (process.env.NEXT_PUBLIC_ANTRYK_BASE_URL || "").replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
  };
  const testimonials = Array.isArray(data) && data.length > 0 ? data : [
    {
      review: "The resources and global network provided by AEGA have been instrumental in our international expansion. A truly professional alliance.",
      userDetails: "Sarah Johnson, Director Edutech",
      image: "/avatar-1.jpg"
    },
    {
      review: "AEGA has completely transformed how we audit our sub-agents and track location-wise compliance scores.",
      userDetails: "Arun Kumar, B2B Owner",
      image: "/avatar-2.jpg"
    },
    {
      review: "We ensure high standards, safer student outcomes, and a trusted pathway for international education.",
      userDetails: "Jane Lorence, Counselor Manager",
      image: "/avatar-3.jpg"
    }
  ];

  return (
    <section className="w-full bg-[#03091F] py-20 border-t border-white/5 relative overflow-hidden">
      {/* Background decoration (faint glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F58A07] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-8 md:px-12 relative z-10">
        
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[#F58A07]"></div>
              <span className="text-[#F58A07] font-bold tracking-widest text-xs uppercase">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
              Trusted by Partners
            </h2>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => {
            const avatar = formatImage(item.image, "/avatar.jpg");
            
            const [name = "Partner", role = "Director"] = (item.userDetails || "").split(',').map(s => s.trim());

            return (
              <div key={idx} className="bg-[#050B26] p-8 border border-white/5 relative group hover:-translate-y-1 transition-transform duration-300 rounded-lg text-left">
                {/* Quote Icon */}
                <Quote className="absolute top-8 right-8 text-white/5 w-8 h-8 fill-current" />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-3.5 h-3.5 fill-[#F58A07] text-[#F58A07]" />)}
                </div>
                
                <p className="text-gray-300 text-sm leading-7 mb-8 font-light min-h-[80px]">
                  "{item.review}"
                </p>

                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden border border-white/10 relative">
                    <img src={avatar} alt={name} className="w-full h-full object-cover opacity-80" /> 
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide">{name}</h4>
                    <p className="text-[#F58A07] text-xs uppercase tracking-wider mt-0.5">{role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}