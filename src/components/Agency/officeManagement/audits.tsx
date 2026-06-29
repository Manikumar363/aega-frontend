import React from "react";
import { Info } from "lucide-react";

const Audits: React.FC = () => {
  return (
    <div className="text-center py-12 text-white/50 border border-[#3A3760] bg-[#14123A] rounded flex flex-col items-center justify-center gap-3">
      <Info className="w-8 h-8 text-[#F68E2D]" />
      <span className="text-sm">Audit checks and compliance scores are managed at the Agent Company profile level, not for individual offices.</span>
    </div>
  );
};

export default Audits;
