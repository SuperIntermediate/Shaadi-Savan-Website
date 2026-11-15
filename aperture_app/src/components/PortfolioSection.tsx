import React, { useState } from 'react';
import { Camera, Expand, Heart } from 'lucide-react';
import { GalleryCategory, WeddingFrame } from '../types/portfolio';

interface PortfolioSectionProps {
  frames: WeddingFrame[];
  activeCategory: GalleryCategory;
  shortlistIds: string[];
  onCategoryChange: (category: GalleryCategory) => void;
  onToggleShortlist: (frameId: string) => void;
  onOpenLightbox: (frame: WeddingFrame) => void;
}

const CATEGORIES: GalleryCategory[] = [
  'All',
  'Weddings',
  'Haldi & Mehendi',
  'Portraits',
  'Sangeet & Films',
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  frames,
  activeCategory,
  shortlistIds,
  onCategoryChange,
  onToggleShortlist,
  onOpenLightbox,
}) => {
  const [brokenImageIds, setBrokenImageIds] = useState<string[]>([]);

  const filteredFrames =
    activeCategory === 'All'
      ? frames
      : frames.filter((f) => f.category === activeCategory);

  return (
    <section
      id="portfolio"
      className="relative bg-transparent border-t border-white/10 py-20 sm:py-24 text-white z-10"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        {/* Header & Interactive Gallery Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[12px] tracking-[0.08em] uppercase text-neutral-300 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Selected Works
            </p>
            <h2 className="text-[clamp(1.65rem,2.6vw,2.25rem)] font-bold tracking-[-0.02em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-wrap:balance]">
              Wedding Portfolio &amp; Frames
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter wedding portfolio by ceremony"
            className="flex flex-wrap items-center gap-1.5 border border-white/25 bg-black/40 p-1.5 rounded-full self-start md:self-auto shadow-lg"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? 'bg-white text-black shadow-md font-semibold'
                      : 'text-neutral-200 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Media-First Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFrames.map((frame) => {
            const isSaved = shortlistIds.includes(frame.id);
            const hasBrokenImg = brokenImageIds.includes(frame.id);

            return (
              <article
                key={frame.id}
                className="group bg-black/35 hover:bg-black/50 border border-white/20 hover:border-white/50 transition-all duration-200 flex flex-col rounded-xl overflow-hidden shadow-xl"
              >
                {/* Media Slot */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50 border-b border-white/10">
                  {hasBrokenImg ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black/60 text-neutral-400">
                      <Camera className="w-6 h-6 mb-2 stroke-[1.5]" aria-hidden="true" />
                      <span className="text-[13px] font-medium text-white">{frame.title}</span>
                      <span className="text-[11px] text-neutral-400 mt-1">{frame.location}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenLightbox(frame)}
                      aria-label={`Open ${frame.title} by ${frame.couple} in lightbox`}
                      className="w-full h-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                    >
                      <img
                        src={frame.imageUrl}
                        alt={`${frame.title} — ${frame.couple} in ${frame.location}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setBrokenImageIds((prev) => [...prev, frame.id])
                        }
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                  )}

                  {/* Save to Shortlist Heart Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleShortlist(frame.id)}
                    aria-label={
                      isSaved
                        ? `Remove ${frame.title} from saved frames`
                        : `Save ${frame.title} to shortlist`
                    }
                    className="absolute top-3 right-3 min-w-[40px] min-h-[40px] rounded-full bg-black/50 border border-white/30 inline-flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Heart
                      className={`w-[16px] h-[16px] stroke-[1.8] ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Unboxed Editorial Metadata & Story Caption */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-neutral-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      <span>{frame.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{frame.season}</span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenLightbox(frame)}
                        className="text-left text-[17px] font-semibold tracking-[-0.015em] text-white hover:underline underline-offset-4 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      >
                        {frame.couple}
                      </button>
                      <span className="text-[12px] text-neutral-300 shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {frame.category}
                      </span>
                    </div>

                    <p className="mt-1 text-[13.5px] font-medium text-neutral-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {frame.title}
                    </p>

                    <p className="mt-2 text-[13.5px] leading-[1.55] text-neutral-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {frame.caption}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <span className="text-[11.5px] text-neutral-300 tabular-nums truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {frame.exif.lens} · {frame.exif.exposure}
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenLightbox(frame)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                    >
                      <Expand className="w-3.5 h-3.5 stroke-[1.8]" aria-hidden="true" />
                      <span>View Frame</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
