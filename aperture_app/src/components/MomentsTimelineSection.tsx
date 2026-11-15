import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WEDDING_MOMENTS } from '../data/experience';
import { TextEffect } from './ui/text-effect';

interface MomentsTimelineSectionProps {
  chapters?: any[];
}

export const MomentsTimelineSection: React.FC<MomentsTimelineSectionProps> = ({ chapters }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayChapters =
    chapters && chapters.length > 0
      ? chapters.map((ch, idx) => ({
        id: ch.id || `ch-${idx}`,
        title: ch.title || ch.name || 'Ceremonial Ritual',
        ritual: ch.ritual || ch.headline || 'Indian Heritage Milestone',
        timeOfDay: ch.timeOfDay || 'Golden Hour',
        location: ch.location || 'Heritage Setting',
        caption: ch.description || ch.caption || '',
        image: ch.image || '/assets/images/wedding_haldi_celebration_1794571322283.jpg',
      }))
      : WEDDING_MOMENTS.map((m) => ({
        id: m.id,
        title: m.title || m.name,
        ritual: m.ritual || m.headline,
        timeOfDay: m.timeOfDay,
        location: m.location || 'Heritage Palace',
        caption: m.caption || m.description,
        image: m.image,
      }));

  const safeIndex = Math.min(activeIndex, Math.max(0, displayChapters.length - 1));
  const currentMoment = displayChapters[safeIndex] || displayChapters[0];

  return (
    <section
      id="moments"
      className="relative bg-transparent border-t border-[#754C3D]/30 py-24 sm:py-28 z-10"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span aria-hidden="true" className="w-5 h-[1.5px] bg-[#C6A875]" />
              <p className="text-[12px] tracking-[0.08em] uppercase text-[#C6A875] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                05 · Wedding Moments
              </p>
            </div>
            <TextEffect
              as="h2"
              per="word"
              speedReveal={1}
              speedSegment={1}
              className="font-serif-editorial text-[clamp(1.85rem,3vw,2.65rem)] font-medium tracking-[-0.015em] text-[#F3EBDD] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-wrap:balance]"
            >
              From Morning Haldi to Midnight Toasts
            </TextEffect>
          </div>
          <p className="text-[15px] text-[#F3EBDD] font-medium max-w-[42ch] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Follow the natural rhythm of an Indian celebration—each ritual photographed for its distinct light and emotion.
          </p>
        </div>

        {/* Interactive Timeline + Animated Moment Showcase */}
        {displayChapters.length > 0 && currentMoment && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Timeline Stepper */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="relative pl-6 border-l border-[#754C3D]/50 space-y-2">
                {displayChapters.map((moment, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={moment.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`relative w-full text-left p-4 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C6A875] ${isActive
                        ? 'bg-[#30251F]/95 backdrop-blur-md border border-[#C6A875] shadow-xl'
                        : 'border border-[#754C3D]/50 bg-[#171512]/85 backdrop-blur-md hover:border-[#C6A875]/60 hover:bg-[#30251F]/50'
                        }`}
                    >
                      {/* Timeline Node Dot */}
                      <span
                        className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-colors ${isActive ? 'bg-[#C6A875] ring-4 ring-[#C6A875]/30' : 'bg-[#754C3D]'
                          }`}
                      />

                      <div className="flex items-center justify-between text-[12px] font-mono mb-1">
                        <span className="text-[#C6A875] font-semibold">{moment.timeOfDay}</span>
                        <span className="text-[#F3EBDD] font-medium">{moment.ritual}</span>
                      </div>
                      <TextEffect
                        as="h3"
                        per="word"
                        speedReveal={1}
                        speedSegment={0.9}
                        className="mt-1 font-serif-editorial text-[19px] font-medium text-[#F3EBDD]"
                      >
                        {moment.title}
                      </TextEffect>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Moment Display */}
            <div className="lg:col-span-7 relative bg-[#171512]/90 backdrop-blur-md border border-[#754C3D]/60 p-5 sm:p-6 rounded-2xl shadow-2xl flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMoment.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/60 border border-white/10 mb-4">
                    <img
                      src={currentMoment.image}
                      alt={currentMoment.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-serif-editorial text-[24px] font-medium text-[#F3EBDD]">
                      {currentMoment.title}
                    </h4>
                    <span className="text-[13px] font-mono font-semibold text-[#C6A875]">
                      {currentMoment.location}
                    </span>
                  </div>
                  <p className="mt-2 text-[14.5px] leading-[1.65] text-[#F3EBDD] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {currentMoment.caption}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
