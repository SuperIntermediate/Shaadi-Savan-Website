import React from 'react';
import { PHILOSOPHY_IMAGE } from '../data/experience';
import { TextEffect } from './ui/text-effect';

interface PhilosophySectionProps {
  philosophyData?: {
    headline?: string;
    paragraphs?: string[];
    stats?: { label: string; value?: string }[];
    photoUrl?: string;
    caption?: string;
    exif?: string;
  };
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ philosophyData }) => {
  const headline =
    philosophyData?.headline || "We Don't Just Capture Weddings. We Preserve Feelings.";

  const paragraphs =
    philosophyData?.paragraphs && philosophyData.paragraphs.length > 0
      ? philosophyData.paragraphs
      : [
        'At Shaadi-Savan, we believe the truest photographs happen in the spaces between the schedule—a mother’s quiet embrace before the baraat arrives, the tremor of hands during pheras, and laughter shared beneath courtyard shade.',
        'Founded between Mumbai and Udaipur, our collective works unobtrusively with natural light, warm film aesthetics, and patient documentary observation so your heirloom gallery feels alive decades from today.',
      ];

  const photoUrl = philosophyData?.photoUrl || PHILOSOPHY_IMAGE;
  const caption = philosophyData?.caption || 'Unscripted Morning Embrace · Chennai';
  const exif = philosophyData?.exif || '35mm f/1.4 · Natural Light';

  return (
    <section
      id="philosophy"
      className="relative bg-transparent border-t border-[#754C3D]/30 py-24 sm:py-32 z-10"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Editorial Typography & Brand Story */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#171512]/90 backdrop-blur-md border border-[#754C3D]/50 p-7 sm:p-10 rounded-2xl shadow-2xl">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span aria-hidden="true" className="w-6 h-[1.5px] bg-[#C6A875]" />
                <p className="text-[12px] tracking-[0.14em] uppercase text-[#C6A875] font-mono font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  02 · The Philosophy
                </p>
              </div>

              <TextEffect
                as="h2"
                per="word"
                speedReveal={1}
                speedSegment={1}
                className="font-serif-editorial text-[clamp(2.35rem,4.3vw,3.85rem)] font-medium tracking-[-0.01em] leading-[1.08] text-[#F3EBDD] [text-wrap:balance] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
              >
                {headline}
              </TextEffect>

              <div className="mt-8 space-y-5 text-[15.5px] sm:text-[16px] leading-[1.75] text-[#F3EBDD] font-normal max-w-[54ch] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#754C3D]/40 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-[#F3EBDD] font-medium tabular-nums drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span>180+ Celebrations Documented</span>
              <span aria-hidden="true" className="text-[#C6A875] font-bold">·</span>
              <span>35mm Analog &amp; 4K Cinema</span>
              <span aria-hidden="true" className="text-[#C6A875] font-bold">·</span>
              <span>India &amp; Destination</span>
            </div>
          </div>

          {/* Right Emotional Documentary Photograph */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative bg-[#171512]/90 backdrop-blur-md border border-[#754C3D]/50 p-5 sm:p-6 h-full flex flex-col justify-between rounded-2xl shadow-2xl">
              <span
                aria-hidden="true"
                className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-[#C6A875]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-[#C6A875]"
              />

              <div className="aspect-[4/3] lg:aspect-auto lg:flex-1 w-full overflow-hidden bg-black/60 rounded-xl border border-white/10">
                <img
                  src={photoUrl}
                  alt={caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-[13px] text-[#F3EBDD] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                <span>{caption}</span>
                <span className="text-[#C6A875] tabular-nums font-mono font-semibold">{exif}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
