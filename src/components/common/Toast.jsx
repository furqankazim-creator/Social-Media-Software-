import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed right-5 bottom-5 z-50 flex items-center gap-2.5 bg-[#172554] text-white px-4 py-3 rounded-xl shadow-xl border border-blue-900 text-xs font-semibold animate-bounce"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

