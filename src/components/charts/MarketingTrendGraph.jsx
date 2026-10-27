import React, { useState } from 'react';
import { TrendingUp, Users, MousePointerClick, Eye, Target } from 'lucide-react';
import { BRAND_COLORS } from '../../constants/dashboardConfig';
import { formatNum, formatMoney } from '../../utils/helpers';

export default function MarketingTrendGraph({ metrics }) {
  const [metricType, setMetricType] = useState('reach'); // 'reach' | 'engagement' | 'leads' | 'spend'
  const [hoverIndex, setHoverIndex] = useState(null);

  // Sort metrics chronologically
  const sortedMetrics = [...metrics].sort((a, b) =>
    (a.date || '').localeCompare(b.date || '')
  );

  if (sortedMetrics.length === 0) {
    return (
      <div className="bg-white border border-[#e5eaf2] rounded-2xl p-6 shadow-sm text-center text-xs text-[#667085]">
        No marketing metrics logged yet to draw trend graph.
      </div>
    );
  }

  const getValue1 = (m) => {
    switch (metricType) {
      case 'reach':
        return Number(m.reach || 0);
      case 'engagement':
        return Number(m.engagements || 0);
      case 'leads':
        return Number(m.leads || 0);
      case 'spend':
        return Number(m.spend || 0);
      default:
        return Number(m.reach || 0);
    }
  };

  const getValue2 = (m) => {
    switch (metricType) {
      case 'reach':
        return Number(m.impressions || 0);
      case 'engagement':
        return Number(m.clicks || 0);
      case 'leads':
        return Number(m.conversions || 0);
      case 'spend':
        return Number(m.reach || 0);
      default:
        return Number(m.impressions || 0);
    }
  };

  const getLabels = () => {
    switch (metricType) {
      case 'reach':
        return { l1: 'Reach', l2: 'Impressions', color1: '#3157d5', color2: '#0f9d8a' };
      case 'engagement':
        return { l1: 'Engagements', l2: 'Clicks', color1: '#7756c8', color2: '#e58b32' };
      case 'leads':
        return { l1: 'Leads Generated', l2: 'Conversions', color1: '#0f9d8a', color2: '#3157d5' };
      case 'spend':
        return { l1: 'Ad Spend (PKR)', l2: 'Reach Achieved', color1: '#e58b32', color2: '#3157d5' };
      default:
        return { l1: 'Reach', l2: 'Impressions', color1: '#3157d5', color2: '#0f9d8a' };
    }
  };

  const { l1, l2, color1, color2 } = getLabels();

  const values1 = sortedMetrics.map(getValue1);
  const values2 = sortedMetrics.map(getValue2);
  const maxVal = Math.max(...values1, ...values2, 10);

  // SVG dimensions
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const points1 = sortedMetrics.map((m, idx) => {
    const x =
      sortedMetrics.length === 1
        ? width / 2
        : paddingX + (idx / (sortedMetrics.length - 1)) * plotWidth;
    const y = height - paddingY - (getValue1(m) / maxVal) * plotHeight;
    return { x, y, val: getValue1(m), item: m };
  });

  const points2 = sortedMetrics.map((m, idx) => {
    const x =
      sortedMetrics.length === 1
        ? width / 2
        : paddingX + (idx / (sortedMetrics.length - 1)) * plotWidth;
    const y = height - paddingY - (getValue2(m) / maxVal) * plotHeight;
    return { x, y, val: getValue2(m), item: m };
  });

  // Bezier curve path generator
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const path1 = createSmoothPath(points1);
  const path2 = createSmoothPath(points2);
  const area1 =
    points1.length > 0
      ? `${path1} L ${points1[points1.length - 1].x} ${height - paddingY} L ${
          points1[0].x
        } ${height - paddingY} Z`
      : '';

  return (
    <div className="bg-white border border-[#e5eaf2] rounded-2xl p-5 shadow-sm space-y-4 fade-in-slide hover:shadow-md transition-shadow">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5eaf2]">
        <div>
          <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0f9d8a]" />
            <span>Marketing Performance &amp; Conversion Trajectory</span>
          </h3>
          <p className="text-xs text-[#667085]">
            Visualizing trends across campaigns, channels and reported dates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          {/* Metric Selector Pills */}
          <div className="inline-flex bg-[#f4f7fb] border border-[#e5eaf2] rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setMetricType('reach')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                metricType === 'reach'
                  ? 'bg-[#3157d5] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Reach &amp; Impr.
            </button>
            <button
              onClick={() => setMetricType('engagement')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                metricType === 'engagement'
                  ? 'bg-[#3157d5] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Engagements
            </button>
            <button
              onClick={() => setMetricType('leads')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                metricType === 'leads'
                  ? 'bg-[#3157d5] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Leads &amp; Wins
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-[#172033]">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }} />
          <span>{l1}</span>
        </span>
        <span className="flex items-center gap-1.5 font-bold text-[#667085]">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
          <span>{l2}</span>
        </span>
      </div>

      {/* SVG Graph Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 overflow-visible"
        >
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color1} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color1} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#e5eaf2"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY + plotHeight / 2}
            x2={width - paddingX}
            y2={paddingY + plotHeight / 2}
            stroke="#e5eaf2"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e5eaf2"
          />

          {/* Area fill */}
          {area1 && <path d={area1} fill="url(#gradient1)" />}

          {/* Curved Line 2 */}
          <path
            d={path2}
            fill="none"
            stroke={color2}
            strokeWidth="2.5"
            strokeDasharray="3 3"
          />

          {/* Curved Line 1 */}
          <path
            d={path1}
            fill="none"
            stroke={color1}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points on Line 1 */}
          {points1.map((p, idx) => (
            <circle
              key={`p1-${idx}`}
              cx={p.x}
              cy={p.y}
              r={hoverIndex === idx ? 6 : 4}
              fill={color1}
              stroke="#ffffff"
              strokeWidth="2"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              className="cursor-pointer transition-all duration-200"
            />
          ))}

          {/* Data Points on Line 2 */}
          {points2.map((p, idx) => (
            <circle
              key={`p2-${idx}`}
              cx={p.x}
              cy={p.y}
              r={hoverIndex === idx ? 5 : 3.5}
              fill={color2}
              stroke="#ffffff"
              strokeWidth="2"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              className="cursor-pointer transition-all duration-200"
            />
          ))}
        </svg>

        {/* Hover Crosshair / Tooltip */}
        {hoverIndex !== null && sortedMetrics[hoverIndex] && (
          <div
            className="absolute top-2 bg-[#0f172a] text-white p-3 rounded-xl shadow-2xl text-xs z-30 pointer-events-none transform -translate-x-1/2 animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${(points1[hoverIndex].x / width) * 100}%`
            }}
          >
            <div className="font-bold text-slate-300 text-[10px] uppercase font-mono">
              {sortedMetrics[hoverIndex].date} · {sortedMetrics[hoverIndex].brand}
            </div>
            <div className="font-extrabold text-sm mt-0.5" style={{ color: color1 }}>
              {l1}: {formatNum(getValue1(sortedMetrics[hoverIndex]))}
            </div>
            <div className="text-slate-300 font-semibold text-[11px]" style={{ color: color2 }}>
              {l2}: {formatNum(getValue2(sortedMetrics[hoverIndex]))}
            </div>
          </div>
        )}
      </div>

      {/* Date Labels on X Axis */}
      <div className="flex justify-between text-[11px] font-mono text-[#667085] px-2 pt-1 border-t border-[#e5eaf2]">
        {sortedMetrics.map((m) => (
          <span key={m.id} className="truncate max-w-[85px]">
            {m.date}
          </span>
        ))}
      </div>
    </div>
  );
}

