import React from 'react';
import { Calendar, Expand, Trash2, X } from 'lucide-react';
import { WeddingFrame } from '../types/portfolio';

interface ShortlistDrawerProps {
  isOpen: boolean;
  items: WeddingFrame[];
  onClose: () => void;
  onRemoveFrame: (frameId: string) => void;
  onInspectFrame: (frame: WeddingFrame) => void;
  onBookWithShortlist: () => void;
  onBrowsePortfolio: () => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onRemoveFrame,
  onInspectFrame,
  onBookWithShortlist,
  onBrowsePortfolio,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Wedding Frames"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-[420px] bg-neutral-900 h-full border-l border-neutral-800 flex flex-col justify-between text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-white tabular-nums">
              Saved Inspiration ({items.length})
            </h2>
            <p className="text-[12px] text-neutral-400 mt-0.5">
              Attach your favorite frames to your consultation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved frames"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.6]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[15px] font-medium text-white">
                Your shortlist is empty
              </p>
              <p className="mt-2 text-[14px] text-neutral-400 leading-relaxed">
                Tap the heart icon on any frame in our portfolio to build a visual moodboard for your wedding consultation.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowsePortfolio();
                }}
                className="mt-6 inline-flex items-center justify-center bg-white text-black rounded-full px-6 py-2.5 text-[13.5px] font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Explore Portfolio
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {items.map((frame) => (
                <li key={frame.id} className="py-5 first:pt-0 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onInspectFrame(frame);
                    }}
                    className="w-24 h-[72px] bg-neutral-800 rounded-md overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={frame.imageUrl}
                      alt={frame.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14.5px] font-semibold text-white truncate">
                      {frame.couple}
                    </h3>
                    <p className="text-[12.5px] text-neutral-300 truncate">
                      {frame.title}
                    </p>
                    <p className="text-[11.5px] text-neutral-500 mt-0.5">
                      {frame.location} · {frame.category}
                    </p>

                    <div className="mt-2.5 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onInspectFrame(frame);
                        }}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-white hover:underline underline-offset-4 cursor-pointer"
                      >
                        <Expand className="w-3 h-3" aria-hidden="true" />
                        <span>Inspect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveFrame(frame.id)}
                        aria-label={`Remove ${frame.title} from saved frames`}
                        className="inline-flex items-center gap-1 text-[12px] text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-neutral-800 bg-neutral-900">
            <button
              type="button"
              onClick={onBookWithShortlist}
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-black rounded-full py-3 text-[13.5px] font-semibold hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2]" aria-hidden="true" />
              <span>Share Shortlist &amp; Book Shoot</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
