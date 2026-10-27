import React, { useState, useEffect } from 'react';
import { X, Plus, Clock, Sparkles } from 'lucide-react';
import {
  BRANDS,
  PLATFORMS,
  WORK_CATEGORIES
} from '../../constants/dashboardConfig';
import { todayStr, timeMinutes } from '../../utils/helpers';

export default function TaskModal({
  isOpen,
  task,
  defaultDate,
  defaultBrand,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    id: null,
    title: '',
    brand: defaultBrand && defaultBrand !== 'All' ? defaultBrand : 'Time Global Tech',
    platform: 'LinkedIn — shared account',
    category: 'LinkedIn content creation',
    date: defaultDate || todayStr(),
    due: defaultDate || todayStr(),
    priority: 'Medium',
    status: 'In progress',
    start: '11:00',
    end: '12:00',
    estimate: 1,
    actual: 1,
    output: 1,
    spend: 0,
    notes: ''
  });

  useEffect(() => {
    if (task) {
      setForm({
        id: task.id || null,
        title: task.title || '',
        brand: task.brand || 'Time Global Tech',
        platform: task.platform || 'LinkedIn — shared account',
        category: task.category || 'Research & strategy',
        date: task.date || defaultDate || todayStr(),
        due: task.due || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Not started',
        start: task.start || '11:00',
        end: task.end || '12:00',
        estimate: task.estimate ?? 1,
        actual: task.actual ?? 0,
        output: task.output ?? 0,
        spend: task.spend ?? 0,
        notes: task.notes || ''
      });
    } else {
      setForm({
        id: null,
        title: '',
        brand:
          defaultBrand && defaultBrand !== 'All'
            ? defaultBrand
            : 'Time Global Tech',
        platform: 'LinkedIn — shared account',
        category: 'LinkedIn content creation',
        date: defaultDate || todayStr(),
        due: defaultDate || todayStr(),
        priority: 'Medium',
        status: 'In progress',
        start: '11:00',
        end: '12:00',
        estimate: 1,
        actual: 0,
        output: 1,
        spend: 0,
        notes: ''
      });
    }
  }, [task, defaultDate, defaultBrand, isOpen]);

  if (!isOpen) return null;

  const handleAutoCalcHours = () => {
    const mins = Math.max(0, timeMinutes(form.end) - timeMinutes(form.start));
    const hrs = Math.round((mins / 60) * 4) / 4;
    setForm((prev) => ({ ...prev, estimate: hrs, actual: hrs }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const ok = onSave({
      ...form,
      title: form.title.trim(),
      estimate: Number(form.estimate || 0),
      actual: Number(form.actual || 0),
      output: Number(form.output || 0),
      spend: Number(form.spend || 0),
      notes: form.notes.trim()
    });
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-[#e5eaf2] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5eaf2]">
          <div>
            <h3 className="text-base font-extrabold text-[#172033]">
              {form.id ? 'Edit Task / Deliverable' : 'Quick Add Task / Deliverable'}
            </h3>
            <p className="text-xs text-[#667085]">
              Record client work, channel output, hours and measurable outcome
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2 grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Task title *
              </label>
              <input
                required
                autoFocus
                placeholder="e.g., Create LinkedIn carousel on enterprise AI"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Brand / client *
              </label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Platform / channel
              </label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Work category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
              >
                {WORK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Work date *
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Due date
              </label>
              <input
                type="date"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              >
                <option>Not started</option>
                <option>In progress</option>
                <option>Completed</option>
                <option>Blocked</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Start time
              </label>
              <input
                type="time"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                End time
              </label>
              <input
                type="time"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              />
            </div>

            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAutoCalcHours}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#3157d5] font-bold rounded-xl border border-blue-200 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Auto-calculate hours from time range</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Estimated hours
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={form.estimate}
                onChange={(e) => setForm({ ...form, estimate: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Actual hours
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={form.actual}
                onChange={(e) => setForm({ ...form, actual: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] font-bold outline-none"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Outputs count
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={form.output}
                onChange={(e) => setForm({ ...form, output: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-[11px] font-bold text-[#667085]">
                Ad spend (PKR)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={form.spend}
                onChange={(e) => setForm({ ...form, spend: e.target.value })}
                className="w-full border border-[#e5eaf2] rounded-xl p-2 bg-white text-[#172033] outline-none"
              />
            </div>
          </div>

          <div className="grid gap-1">
            <label className="text-[11px] font-bold text-[#667085]">
              Outcome / notes
            </label>
            <textarea
              rows={2}
              placeholder="Result, link, KPI, blocker, next step…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-[#e5eaf2] rounded-xl p-2.5 bg-white text-[#172033] outline-none focus:border-[#3157d5]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5eaf2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#3157d5] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{form.id ? 'Save changes' : 'Save task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

