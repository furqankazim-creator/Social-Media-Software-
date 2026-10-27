import React from 'react';
import { Calendar, Eye, Building2, RotateCcw } from 'lucide-react';
import { BRANDS } from '../../constants/dashboardConfig';

export default function FilterBar({
  periodDate,
  setPeriodDate,
  periodMode,
  setPeriodMode,
  brandFilter,
  setBrandFilter,
  onResetFilters
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-5 no-print">
      {/* Date Filter */}
      <div className="flex items-center gap-2 bg-white border border-[#e5eaf2] rounded-xl px-3 py-2 shadow-sm">
        <Calendar className="w-3.5 h-3.5 text-[#667085]" />
        <label htmlFor="periodDate" className="text-xs text-[#667085] font-medium">
          Date
        </label>
        <input
          id="periodDate"
          type="date"
          value={periodDate}
          onChange={(e) => setPeriodDate(e.target.value)}
          className="text-xs font-semibold text-[#172033] bg-transparent border-0 outline-none cursor-pointer"
        />
      </div>

      {/* Period View Mode */}
      <div className="flex items-center gap-2 bg-white border border-[#e5eaf2] rounded-xl px-3 py-2 shadow-sm">
        <Eye className="w-3.5 h-3.5 text-[#667085]" />
        <label htmlFor="periodMode" className="text-xs text-[#667085] font-medium">
          View
        </label>
        <select
          id="periodMode"
          value={periodMode}
          onChange={(e) => setPeriodMode(e.target.value)}
          className="text-xs font-semibold text-[#172033] bg-transparent border-0 outline-none cursor-pointer"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Brand Filter */}
      <div className="flex items-center gap-2 bg-white border border-[#e5eaf2] rounded-xl px-3 py-2 shadow-sm">
        <Building2 className="w-3.5 h-3.5 text-[#667085]" />
        <label htmlFor="brandFilter" className="text-xs text-[#667085] font-medium">
          Brand
        </label>
        <select
          id="brandFilter"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="text-xs font-semibold text-[#172033] bg-transparent border-0 outline-none cursor-pointer max-w-[190px]"
        >
          <option value="All">All brands</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onResetFilters}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#e5eaf2] text-[#26324a] text-xs font-bold rounded-xl shadow-sm transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        <span>Reset filters</span>
      </button>
    </div>
  );
}

