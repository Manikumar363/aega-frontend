export default function RegionalPresence() {
  const REGIONS = [
    {
      name: "ASIA-PACIFIC",
      managers: "1248",
      students: "45,620",
      universities: "78",
      since: "2024",
    },
    {
      name: "EUROPE",
      managers: "1248",
      students: "45,620",
      universities: "78",
      since: "2023",
    },
    {
      name: "MIDDLE EAST & AFRICA",
      managers: "1248",
      students: "45,620",
      universities: "78",
      since: "2023",
    },
    {
      name: "AMERICAS",
      managers: "1248",
      students: "45,620",
      universities: "78",
      since: "2021",
    },
  ];

  return (
    <section className="w-full bg-[#0A1628] py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Heading */}
        <h2 className="mb-12 text-center text-4xl font-bold text-white md:text-5xl">
          REGIONAL PRESENCE
        </h2>

        {/* Region Cards - 2x2 Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {REGIONS.map((region, index) => (
            <div
              key={index}
              className="space-y-6 border border-white/10 bg-[#0A1628] p-8"
            >
              {/* Region Name */}
              <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                {region.name}
              </h3>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {region.managers}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Managers
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">
                    {region.students}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Students
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">
                    {region.universities}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Universities
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#F58A07]">
                    {region.since}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    since
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
