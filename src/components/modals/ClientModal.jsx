import React, { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  Lock,
  Globe,
  Palette,
  ShieldCheck,
  Building,
  Mail,
  User,
  Sparkles
} from 'lucide-react';
import { PLATFORMS } from '../../constants/dashboardConfig';

const COLOR_PRESETS = [
  { name: 'Classic Blue', hex: '#3157d5' },
  { name: 'Teal Green', hex: '#0f9d8a' },
  { name: 'Amber Gold', hex: '#e58b32' },
  { name: 'Vibrant Purple', hex: '#7756c8' },
  { name: 'Ruby Crimson', hex: '#e11d48' },
  { name: 'Emerald Mint', hex: '#059669' },
  { name: 'Indigo Deep', hex: '#4f46e5' },
  { name: 'Sunset Orange', hex: '#ea580c' }
];

export default function ClientModal({
  isOpen,
  client = null,
  onClose,
  onSave
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Enterprise Tech & Staffing');
  const [color, setColor] = useState('#3157d5');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['LinkedIn — shared account']);
  const [caseStudyRestricted, setCaseStudyRestricted] = useState(false);
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [portalPassword, setPortalPassword] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setCategory(client.category || 'Enterprise Tech & Staffing');
      setColor(client.color || '#3157d5');
      setContactPerson(client.contactPerson || '');
      setContactEmail(client.contactEmail || '');
      setSelectedPlatforms(client.platforms || ['LinkedIn — shared account']);
      setCaseStudyRestricted(Boolean(client.caseStudyRestricted));
      setPortalEnabled(client.portalEnabled !== false);
      setPortalPassword(client.portalPassword || '');
      setNotes(client.notes || '');
    } else {
      setName('');
      setCategory('Enterprise Tech & Staffing');
      setColor('#3157d5');
      setContactPerson('');
      setContactEmail('');
      setSelectedPlatforms(['LinkedIn — shared account']);
      setCaseStudyRestricted(false);
      setPortalEnabled(true);
      setPortalPassword('');
      setNotes('');
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const togglePlatform = (p) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(client || {}),
      name: name.trim(),
      category: category.trim(),
      color,
      contactPerson: contactPerson.trim(),
      contactEmail: contactEmail.trim(),
      platforms: selectedPlatforms,
      caseStudyRestricted,
      portalEnabled,
      portalPassword: portalPassword.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#162033] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: color }}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {client ? 'Edit Client Details' : 'Add New Client & Brand'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure brand settings, contact info, and stakeholder portal access.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="clientName"
                className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
              >
                Client / Brand Name *
              </label>
              <input
                id="clientName"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Global Technologies"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="clientCategory"
                className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
              >
                Industry / Category
              </label>
              <input
                id="clientCategory"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. FinTech &amp; Wealth Management"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-500" />
                <span>Brand Accent Color</span>
              </span>
              <span className="font-mono text-slate-500">{color}</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    color === c.hex ? 'scale-125 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                title="Custom Hex"
              />
            </div>
          </div>

          {/* Contact Person & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="contactPerson"
                className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1"
              >
                <User className="w-3 h-3 text-slate-400" />
                <span>Primary Contact Person</span>
              </label>
              <input
                id="contactPerson"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. John Doe / Account Lead"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="contactEmail"
                className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1"
              >
                <Mail className="w-3 h-3 text-slate-400" />
                <span>Contact Email</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. stakeholder@client.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Active Marketing Channels
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => {
                const active = selectedPlatforms.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                      active
                        ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stakeholder Client Portal Settings */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-blue-900 dark:text-blue-200 text-xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Shareable Client Portal</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Allow client stakeholders to view their live deliverables and KPIs without editing permissions.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={portalEnabled}
                  onChange={(e) => setPortalEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {portalEnabled && (
              <div className="pt-2 border-t border-blue-100 dark:border-blue-900/40">
                <label
                  htmlFor="portalPassword"
                  className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Access Passcode (Leave empty for public link)</span>
                </label>
                <input
                  id="portalPassword"
                  type="text"
                  value={portalPassword}
                  onChange={(e) => setPortalPassword(e.target.value)}
                  placeholder="e.g. client2026! (optional)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                />
              </div>
            )}
          </div>

          {/* Strategic Notes */}
          <div>
            <label
              htmlFor="clientNotes"
              className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Internal Notes &amp; Account Protocols
            </label>
            <textarea
              id="clientNotes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Shared LinkedIn account rules, weekly check-in schedule, special deliverables..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white font-bold shadow-md transition"
              style={{ backgroundColor: color }}
            >
              {client ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

