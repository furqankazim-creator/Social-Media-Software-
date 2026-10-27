import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  CheckCircle2,
  ListPlus,
  Edit3,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send
} from 'lucide-react';
import { BRAND_COLORS } from '../../constants/dashboardConfig';

export default function PostPreviewModal({
  item,
  onClose,
  onEdit,
  onUpdateStatus,
  onConvertToTask
}) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const brandColor = BRAND_COLORS[item.brand]?.hex || '#3157d5';

  const handleCopyCaption = () => {
    const text = `${item.title}\n\n${item.copy || ''}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-[#e5eaf2] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#fafbfe] border-b border-[#e5eaf2]">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: brandColor }}
            />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#172033]">
              {item.platform} Post Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Social Media Card Mockup */}
        <div className="p-5 bg-[#f4f7fb]">
          <div className="bg-white border border-[#e5eaf2] rounded-xl p-4 shadow-sm space-y-3">
            {/* Author / Brand Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                  style={{ backgroundColor: brandColor }}
                >
                  {item.brand
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 3)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">
                    {item.brand}
                  </h4>
                  <p className="text-[11px] text-[#667085]">
                    Scheduled: {item.date} at {item.time || '14:30'} ·{' '}
                    {item.platform}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eef2ff] text-[#3949ab]">
                {item.status}
              </span>
            </div>

            {/* Post Body / Caption */}
            <div className="text-xs text-[#172033] space-y-2 pt-1">
              <p className="font-bold text-sm">{item.title}</p>
              {item.copy ? (
                <p className="whitespace-pre-line text-[#26324a] leading-relaxed">
                  {item.copy}
                </p>
              ) : (
                <p className="italic text-[#667085]">
                  No caption or brief entered yet. Click Edit to add copy, hooks
                  and CTAs.
                </p>
              )}
            </div>

            {/* Creative Format Placeholder Box */}
            <div
              className="rounded-xl p-6 text-center border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1"
              style={{ borderColor: `${brandColor}44` }}
            >
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white"
                style={{ backgroundColor: brandColor }}
              >
                {item.type || 'Creative Asset'}
              </span>
              <span className="text-[11px] text-[#667085] mt-1">
                {item.owner
                  ? `Assigned / Reviewed by ${item.owner}`
                  : 'Visual creative / asset slot'}
              </span>
            </div>

            {/* Simulated Social Engagement Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[11px] text-[#667085] font-semibold">
              <span className="inline-flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Comment
              </span>
              <span className="inline-flex items-center gap-1">
                <Repeat2 className="w-3.5 h-3.5" /> Repost
              </span>
              <span className="inline-flex items-center gap-1">
                <Send className="w-3.5 h-3.5" /> Send
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-3.5 bg-white border-t border-[#e5eaf2] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleCopyCaption}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#172033] font-bold rounded-xl transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copied!' : 'Copy caption'}</span>
            </button>

            <button
              onClick={() => {
                onConvertToTask(item);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#3157d5] font-bold rounded-xl transition-colors"
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span>Sync to Daily Tasks</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {item.status !== 'Published' && (
              <button
                onClick={() => {
                  onUpdateStatus(item.id, 'Published');
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Published</span>
              </button>
            )}
            <button
              onClick={() => {
                onEdit(item);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#3157d5] hover:bg-blue-700 text-white font-bold rounded-xl"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

