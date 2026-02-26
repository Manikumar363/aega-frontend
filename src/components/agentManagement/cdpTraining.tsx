import React from "react";

const modules = [
  {
    title: "UKVI COMPLIANCE UPDATE 2025",
    module: "Module 3",
    hours: "3 hours",
    due: "2025-01-15",
    status: "On going",
    statusColor: "bg-blue-500",
    certificate: true,
  },
  // ...add all modules as in your screenshot...
];

const CDPTraining: React.FC = () => (
  <div>
    {/* Progress Bar */}
    <div className="bg-[#181537] rounded-lg p-6 mb-6">
      <div className="text-white font-semibold mb-2">CDP PROGRESS</div>
      <div className="text-gray-400 mb-2">Monthly Progress</div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div className="h-2 rounded-full bg-[#F68E2D]" style={{ width: "75%" }}></div>
      </div>
      <div className="text-white text-right">15/20</div>
    </div>
    {/* Modules Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {modules.map((mod, idx) => (
        <div key={idx} className="bg-[#181537] rounded-lg p-4 flex flex-col gap-2 border border-[#23204a]">
          <div className="flex justify-between items-center">
            <div className="text-white font-semibold">{mod.title}</div>
            <span className={`text-xs px-3 py-1 rounded-full ${
              mod.status === "Completed"
                ? "bg-green-200 text-green-800"
                : mod.status === "Due"
                ? "bg-red-200 text-red-800"
                : "bg-blue-200 text-blue-800"
            }`}>
              {mod.status}
            </span>
          </div>
          <div className="text-gray-300">{mod.module}</div>
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span>⏰ {mod.hours}</span>
            <span>📅 Due: {mod.due}</span>
          </div>
          <button className="ml-auto mt-2 bg-[#23204a] text-white px-4 py-1 rounded text-xs border border-[#333]">
            View Certificate
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default CDPTraining;