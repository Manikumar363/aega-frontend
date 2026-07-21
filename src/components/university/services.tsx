interface ServicesProps {
  data?: {
    title?: string;
    description?: string;
    points?: Array<{
      numbering: string;
      title: string;
    }>;
  };
}

export default function Services({ data }: ServicesProps) {
  const title = data?.title || "SERVICES FOR UNIVERSITY PARTNERS";
  const description = data?.description || "As a university partner, you gain access to comprehensive agent management tools, compliance reporting, and governance support.";
  
  const services = Array.isArray(data?.points) && data.points.length > 0 ? data.points : [
    { numbering: "01.", title: "Access to Verified Agent Database" },
    { numbering: "02.", title: "Real-Time Compliance Dashboards" },
    { numbering: "03.", title: "Agent Performance Reporting" },
    { numbering: "04.", title: "Risk Management Frameworks" },
    { numbering: "05.", title: "Training and Onboarding Support" },
    { numbering: "06.", title: "Incident and Complaint Management" },
    { numbering: "07.", title: "Regulatory Update Notifications" },
    { numbering: "08.", title: "Partnership Development Resources" },
  ];

  return (
    <section className="relative w-full bg-[#03091F] py-20 overflow-hidden">
      {/* Top Left Orange Diagonal */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-[#D97B3C] to-[#F68E2D] opacity-30 transform -rotate-45 -translate-x-48 -translate-y-48"></div>

      {/* Bottom Right Orange Diagonal */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-[#D97B3C] to-[#F68E2D] opacity-30 transform rotate-45 translate-x-48 translate-y-48"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase">
            {title}
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="border border-white/10 p-6 md:p-8 bg-[#0A1628]/40 text-left"
            >
              <h3 className="text-white font-semibold text-sm md:text-base uppercase mb-6">
                {service.title}
              </h3>
              <div className="text-[#F68E2D] text-2xl md:text-3xl font-bold">
                {service.numbering || `${String(index + 1).padStart(2, "0")}.`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
