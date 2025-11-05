'use client';

import { TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';

interface SummaryCardProps {
  readiness_score: number;
  roi_metrics: {
    time_saved_hours: number;
    cost_reduction_percent: number;
    productivity_gain_percent: number;
  };
}

export function SummaryCard({ readiness_score, roi_metrics }: SummaryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#8AFF00]';
    if (score >= 60) return 'text-[#00FFFF]';
    return 'text-[#FF0080]';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'GOOD';
    return 'NEEDS WORK';
  };

  return (
    <div className="bg-[#1B1B1B] border-2 border-[#8AFF00] rounded-lg p-6 neon-border-green">
      <div className="text-center mb-6">
        <h2 className="text-sm font-['Orbitron'] text-gray-400 uppercase mb-2">
          AI Readiness Score
        </h2>
        <div className={`text-6xl font-['Orbitron'] font-black ${getScoreColor(readiness_score)} neon-glow-green`}>
          {readiness_score}
        </div>
        <p className={`text-lg font-['Orbitron'] mt-2 ${getScoreColor(readiness_score)}`}>
          {getScoreLabel(readiness_score)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-[#00FFFF]/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#00FFFF]" />
            <h3 className="text-xs font-['Orbitron'] text-[#00FFFF] uppercase">Time Saved</h3>
          </div>
          <p className="text-2xl font-['Orbitron'] font-bold text-white">
            {roi_metrics.time_saved_hours}h
          </p>
          <p className="text-xs text-gray-400 mt-1">per week</p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#FF0080]/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#FF0080]" />
            <h3 className="text-xs font-['Orbitron'] text-[#FF0080] uppercase">Cost Reduction</h3>
          </div>
          <p className="text-2xl font-['Orbitron'] font-bold text-white">
            {roi_metrics.cost_reduction_percent}%
          </p>
          <p className="text-xs text-gray-400 mt-1">potential savings</p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#8AFF00]/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#8AFF00]" />
            <h3 className="text-xs font-['Orbitron'] text-[#8AFF00] uppercase">Productivity</h3>
          </div>
          <p className="text-2xl font-['Orbitron'] font-bold text-white">
            +{roi_metrics.productivity_gain_percent}%
          </p>
          <p className="text-xs text-gray-400 mt-1">gain potential</p>
        </div>
      </div>
    </div>
  );
}
