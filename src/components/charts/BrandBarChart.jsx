import React, { useState } from 'react';
import { BarChart3, Clock, CheckCircle2, FileCheck2, TrendingUp } from 'lucide-react';
import { BRANDS, BRAND_COLORS } from '../../constants/dashboardConfig';
import { formatMoney, formatNum, pct } from '../../utils/helpers';

export default function BrandBarChart({ tasks }) {
  const [metricKey, setMetricKey] = useState('hours'); // 'hours' | 'tasks' | 'outputs' | 'spend'
  const [hoveredBrand, setHoveredBrand] = useState(null);

  // Compute metrics per brand
  const data = BRANDS.map((brand) => {
    const bTasks = tasks.filter((t) => t.brand === brand);
    const completedTasks = bTasks.filter((t) => t.status === 'Completed').length;
    const hours = bTasks.reduce((s, t) => s + Number(t.actual || 0), 0);
    const outputs = bTasks.reduce((s, t) => s + Number(t.output || 0), 0);
    const spend = bTasks.reduce((s, t) => s + Number(t.spend || 0), 0);
    return {
      brand,
      tasks: bTasks.length,
      completedTasks,
      hours: Math.round(hours * 10) / 10,
      outputs,
      spend,
      color: BRAND_COLORS[brand]?.hex || '#3157d5'
    };
  });

  const getMetricValue = (item) => {
    switch (metricKey) {
      case 'hours':
        return item.hours;
      case 'tasks':
        return item.completedTasks;
      case 'outputs':
        return item.outputs;
      case 'spend':
        return item.spend;
      default:
        return item.hours;
    }
  };

  const getMetricLabel = () => {
    switch (metricKey) {
      case 'hours':
        return 'Hours Logged';
      case 'tasks':
        return 'Tasks Completed';
      case 'outputs':
        return 'Deliverables Output';
      case 'spend':
        return 'Ad Spend';
      default:
        return '';
    }
  };

  const formatDisplay = (val) => {
    if (metricKey === 'spend') return formatMoney(val);
    if (metricKey === 'hours') return `${val}h`;
    return val.toString();
  };

  const values = data.map(getMetricValue);
  const maxValue = Math.max(...values, 1);
  const totalValue = values.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-4 fade-in-slide hover:shadow-md transition-shadow">
      {/* Header and Metric Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5eaf2]">
        <div>
          <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#3157d5]" />
            <span>Workload &amp; Performance Distribution by Client</span>
          </h3>
          <p className="text-xs text-[#667085]">
            Comparing {getMetricLabel().toLowerCase()} across all four organizations
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="inline-flex bg-[#f4f7fb] border border-[#e5eaf2] rounded-xl p-1 text-xs font-bold no-print">
          <button
            onClick={() => setMetricKey('hours')}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
              metricKey === 'hours'
                ? 'bg-[#3157d5] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hours</span>
          </button>
          <button
            onClick={() => setMetricKey('tasks')}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
              metricKey === 'tasks'
                ? 'bg-[#3157d5] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tasks</span>
          </button>
          <button
            onClick={() => setMetricKey('outputs')}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
              metricKey === 'outputs'
                ? 'bg-[#3157d5] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Outputs</span>
          </button>
          <button
            onClick={() => setMetricKey('spend')}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
              metricKey === 'spend'
                ? 'bg-[#3157d5] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Spend</span>
          </button>
        </div>
      </div>

      {/* Animated Vertical Bar Chart SVG / HTML */}
      <div className="pt-2">
        <div className="h-56 flex items-end justify-around gap-2 sm:gap-6 border-b border-[#e5eaf2] px-2 pb-2 relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-dashed border-slate-200 w-full" />
          </div>

          {data.map((item) => {
            const val = getMetricValue(item);
            const heightPct = maxValue > 0 ? (val / maxValue) * 100 : 0;
            const sharePct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(0) : 0;
            const isHovered = hoveredBrand === item.brand;

            return (
              <div
                key={item.brand}
                onMouseEnter={() => setHoveredBrand(item.brand)}
                onMouseLeave={() => setHoveredBrand(null)}
                className="flex-1 max-w-[90px] h-full flex flex-col items-center justify-end relative group cursor-pointer"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-[#0f172a] text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold shadow-xl whitespace-nowrap animate-bounce flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{formatDisplay(val)}</span>
                    <span className="text-slate-400 font-normal">({sharePct}%)</span>
                  </div>
                )}

                {/* Animated Vertical Bar */}
                <div className="w-full flex justify-center">
                  <div
                    className="w-10 sm:w-14 rounded-t-xl transition-all duration-700 ease-out relative overflow-hidden group-hover:brightness-110 shadow-sm"
                    style={{
                      height: `${Math.max(6, (heightPct / 100) * 190)}px`,
                      backgroundColor: item.color
                    }}
                  >
                    {/* Gloss shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/30" />
                  </div>
                </div>

                {/* Value on Top of Bar */}
                <span className="text-[11px] font-mono font-bold text-[#172033] mt-1.5">
                  {formatDisplay(val)}
                </span>
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-around gap-2 sm:gap-6 pt-3 text-center">
          {data.map((item) => (
            <div key={item.brand} className="flex-1 max-w-[90px]">
              <span
                className="text-[11px] font-bold block truncate text-[#172033]"
                title={item.brand}
              >
                {item.brand.replace('Technologies Inc.', '').replace('Pakistan', 'PK')}
              </span>
              <span className="text-[10px] text-[#667085] block mt-0.5">
                {item.completedTasks}/{item.tasks} tasks
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

