import React, { useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { WeddingFrame } from '../types/portfolio';

interface LightboxModalProps {
  frame: WeddingFrame | null;
  isShortlisted: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShortlist: (frameId: string) => void;
  onInquireStyle: (frame: WeddingFrame) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  frame,
  isShortlisted,
  onClose,
  onPrev,
  onNext,
  onToggleShortlist,
  onInquireStyle,
}) => {
  useEffect(() => {
    if (!frame) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [frame, onClose, onPrev, onNext]);

  if (!frame) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[980px] bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-8 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Controls */}
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-[12px] text-neutral-400">
            <span className="font-medium text-white">{frame.couple}</span>
            <span aria-hidden="true">·</span>
            <span>{frame.location}</span>
            <span aria-hidden="true">·</span>
            <span>{frame.season}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous frame"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.6]" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next frame"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[1.6]" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.6]" />
            </button>
          </div>
        </div>

        {/* Image + EXIF Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 relative bg-neutral-950 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800">
            <img
              src={frame.imageUrl}
              alt={`${frame.title} — ${frame.couple}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-[12px] uppercase tracking-wider text-neutral-400">{frame.category}</p>
              <h3
                id="lightbox-title"
                className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-white"
              >
                {frame.title}
              </h3>

              <p className="mt-3 text-[14.5px] leading-[1.6] text-neutral-300">
                {frame.caption}
              </p>

              <dl className="mt-6 border-t border-neutral-800 divide-y divide-neutral-800/60 text-[13px]">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-neutral-400">Camera</dt>
                  <dd className="text-white font-medium text-right">
                    {frame.exif.camera}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-neutral-400">Lens</dt>
                  <dd className="text-white font-medium text-right">
                    {frame.exif.lens}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-neutral-400">Exposure</dt>
                  <dd className="text-white font-medium text-right tabular-nums">
                    {frame.exif.exposure}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-neutral-400">Color Profile</dt>
                  <dd className="text-white font-medium text-right">
                    {frame.exif.filmProfile}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onInquireStyle(frame)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-5 py-2.5 text-[13.5px] font-semibold hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
              >
                <Calendar className="w-3.5 h-3.5 stroke-[2]" aria-hidden="true" />
                <span>Inquire for Similar Story</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleShortlist(frame.id)}
                aria-label={isShortlisted ? 'Remove from shortlist' : 'Save frame'}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center border border-neutral-700 rounded-full text-white hover:border-white transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-[17px] h-[17px] stroke-[1.6] ${
                    isShortlisted ? 'fill-red-500 text-red-500' : 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
