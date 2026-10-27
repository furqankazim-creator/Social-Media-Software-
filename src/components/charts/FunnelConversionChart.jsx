import React from 'react';
import { Target, Users, MousePointer, Award } from 'lucide-react';
import { formatNum, pct } from '../../utils/helpers';

export default function FunnelConversionChart({ metrics }) {
  const impressions = metrics.reduce((s, m) => s + Number(m.impressions || 0), 0);
  const clicks = metrics.reduce((s, m) => s + Number(m.clicks || 0), 0);
  const leads = metrics.reduce((s, m) => s + Number(m.leads || 0), 0);
  const conversions = metrics.reduce((s, m) => s + Number(m.conversions || 0), 0);

  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const clickToLead = clicks > 0 ? ((leads / clicks) * 100).toFixed(1) : '0.0';
  const leadToConversion = leads > 0 ? ((conversions / leads) * 100).toFixed(1) : '0.0';

  const stages = [
    {
      label: '1. Brand Impressions',
      value: impressions,
      sub: 'Total audience exposures',
      pctWidth: 100,
      color: 'bg-blue-600',
      icon: Users
    },
    {
      label: '2. Engagement & Clicks',
      value: clicks,
      sub: `CTR Efficiency: ${ctr}%`,
      pctWidth: Math.max(18, Math.min(85, (clicks / (impressions || 1)) * 300)),
      color: 'bg-teal-500',
      icon: MousePointer
    },
    {
      label: '3. Qualified Leads',
      value: leads,
      sub: `Click-to-Lead: ${clickToLead}%`,
      pctWidth: Math.max(14, Math.min(65, (leads / (clicks || 1)) * 200)),
      color: 'bg-purple-600',
      icon: Target
    },
    {
      label: '4. Conversions & Client Wins',
      value: conversions,
      sub: `Lead Conversion Rate: ${leadToConversion}%`,
      pctWidth: Math.max(10, Math.min(45, (conversions / (leads || 1)) * 100)),
      color: 'bg-emerald-600',
      icon: Award
    }
  ];

  return (
    <div className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-4 fade-in-slide hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf2]">
        <div>
          <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Marketing Funnel &amp; Conversion Efficiency</span>
          </h3>
          <p className="text-xs text-[#667085]">
            Full journey from initial impressions to final client acquisition
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
          {leadToConversion}% Win Rate
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div key={stage.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#172033] flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{stage.label}</span>
                </span>
                <span className="font-mono font-extrabold text-[#172033]">
                  {formatNum(stage.value)}
                </span>
              </div>

              {/* Animated Funnel Bar */}
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                <div
                  className={`h-full ${stage.color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${stage.pctWidth}%` }}
                />
              </div>

              <div className="text-[10px] text-[#667085] text-right font-semibold">
                {stage.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

