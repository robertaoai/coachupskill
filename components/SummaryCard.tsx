'use client';

import { Trophy, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface SummaryCardProps {
  readiness_score: number;
  roi_estimate: {
    estimated_dollars: number;
    annual_hours_saved: number;
    team_efficiency_gain: string;
  };
}

export function SummaryCard({ readiness_score, roi_estimate }: SummaryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#8AFF00]';
    if (score >= 60) return 'text-[#00FFFF]';
    return 'text-[#FF0080]';
  };

  const getScoreGlow = (score: number) => {
    if (score >= 80) return 'neon-glow-green';
    if (score >= 60) return 'neon-glow-cyan';
    return 'neon-glow-pink';
  };

  return (
    <div className="bg-gradient-to-br from-[#1B1B1B] to-[#0A0A0A] border-2 border-[#00FFFF] rounded-lg p-6 neon-border-cyan">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-[#8AFF00]" />
        <h2 className="text-2xl font-['Orbitron'] font-bold text-[#00FFFF]">
          Your AI Readiness Score
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Readiness Score */}
        <div className="bg-[#0A0A0A] border-2 border-[#00FFFF]/30 rounded-lg p-6 text-center">
          <div className={`text-6xl font-['Orbitron'] font-black ${getScoreColor(readiness_score)} ${getScoreGlow(readiness_score)} mb-2`}>
            {readiness_score}
          </div>
          <div className="text-sm text-gray-400 font-['Exo_2']">out of 100</div>
          <div className="mt-4 text-[#00FFFF] font-['Orbitron'] text-lg">
            {readiness_score >= 80 ? 'Excellent!' : readiness_score >= 60 ? 'Good Progress' : 'Room to Grow'}
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="space-y-4">
          <div className="bg-[#0A0A0A] border-2 border-[#8AFF00]/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-[#8AFF00]" />
              <span className="text-sm text-gray-400 font-['Exo_2']">Estimated Annual Value</span>
            </div>
            <div className="text-3xl font-['Orbitron'] font-bold text-[#8AFF00] neon-glow-green">
              ${roi_estimate.estimated_dollars.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#0A0A0A] border-2 border-[#00FFFF]/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#00FFFF]" />
              <span className="text-sm text-gray-400 font-['Exo_2']">Annual Hours Saved</span>
            </div>
            <div className="text-3xl font-['Orbitron'] font-bold text-[#00FFFF] neon-glow-cyan">
              {roi_estimate.annual_hours_saved}h
            </div>
          </div>

          <div className="bg-[#0A0A0A] border-2 border-[#FF0080]/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#FF0080]" />
              <span className="text-sm text-gray-400 font-['Exo_2']">Team Efficiency Gain</span>
            </div>
            <div className="text-3xl font-['Orbitron'] font-bold text-[#FF0080] neon-glow-pink">
              {roi_estimate.team_efficiency_gain}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
