'use client';

import { TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

interface SummaryCardProps {
  readiness_score: number;
  roi_estimate: {
    annual_hours_saved: number;
    estimated_dollars: number;
    team_efficiency_gain: string;
  };
}

export function SummaryCard({ readiness_score, roi_estimate }: SummaryCardProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block relative">
          <div className="text-8xl font-['Orbitron'] font-black text-[#8AFF00] neon-glow-green">
            {readiness_score}
          </div>
          <div className="text-xl text-[#00FFFF] font-['Orbitron'] uppercase tracking-wider mt-2">
            Readiness Score
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1B1B1B] border-2 border-[#00FFFF] rounded-lg p-4 neon-border-cyan">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#00FFFF]" />
            <span className="text-xs text-[#00FFFF] font-['Orbitron'] uppercase">Hours Saved</span>
          </div>
          <div className="text-3xl font-['Orbitron'] font-bold text-white">
            {roi_estimate.annual_hours_saved}
          </div>
          <div className="text-xs text-gray-400 mt-1">per year</div>
        </div>

        <div className="bg-[#1B1B1B] border-2 border-[#8AFF00] rounded-lg p-4 neon-border-green">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-[#8AFF00]" />
            <span className="text-xs text-[#8AFF00] font-['Orbitron'] uppercase">Value</span>
          </div>
          <div className="text-3xl font-['Orbitron'] font-bold text-white">
            ${roi_estimate.estimated_dollars.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">estimated</div>
        </div>

        <div className="bg-[#1B1B1B] border-2 border-[#FF0080] rounded-lg p-4 neon-border-pink">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#FF0080]" />
            <span className="text-xs text-[#FF0080] font-['Orbitron'] uppercase">Efficiency</span>
          </div>
          <div className="text-3xl font-['Orbitron'] font-bold text-white">
            {roi_estimate.team_efficiency_gain}
          </div>
          <div className="text-xs text-gray-400 mt-1">team gain</div>
        </div>
      </div>
    </div>
  );
}
