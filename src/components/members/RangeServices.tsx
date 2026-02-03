export default function RangeServices() {
  const services = [
    {
      number: "01.",
      title: "TRAINING OVERVIEW",
      description: "Comprehensive CPD programs designed for professional growth",
      features: [
        "Accredited courses",
        "Expert-led training",
        "Flexible learning",
        "Certification pathways"
      ]
    },
    {
      number: "02.",
      title: "REGULATION & COMPLIANCE",
      description: "Stay current with UKVI and global regulatory requirements",
      features: [
        "UKVI updates",
        "Compliance frameworks",
        "Audit preparation",
        "Risk management"
      ]
    },
    {
      number: "03.",
      title: "CAREER GROWTH",
      description: "Advance your career with professional development opportunities",
      features: [
        "Skill enhancement",
        "Industry recognition",
        "Networking events",
        "Leadership training"
      ]
    },
    {
      number: "04.",
      title: "EDUCATION TECH",
      description: "Access cutting-edge tools and platforms for modern agents",
      features: [
        "Digital resources",
        "CRM integration",
        "Analytics tools",
        "Student management"
      ]
    }
  ];

  return (
    <section className="relative w-full bg-[#03091F] py-20 overflow-hidden">
      {/* Top Left Orange Diagonal */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#D97B3C] to-[#F68E2D] opacity-30 transform -rotate-45 -translate-x-48 -translate-y-48"></div>
      
      {/* Bottom Right Orange Diagonal */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#D97B3C] to-[#F68E2D] opacity-30 transform rotate-45 translate-x-48 translate-y-48"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            RANGE OF SERVICES
          </h2>
          <p className="text-lg text-white/70">
            Everything you need to succeed as an education agent
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="border border-white/10 p-8 rounded-lg bg-[#0A1628]/50 backdrop-blur-sm hover:border-[#F68E2D]/50 transition-all duration-300"
            >
              {/* Title and Description */}
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-white/70 text-sm">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Number Badge */}
              <div className="text-5xl font-bold text-[#F68E2D]">
                {service.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
