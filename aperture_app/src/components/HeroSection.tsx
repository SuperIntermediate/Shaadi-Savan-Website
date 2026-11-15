import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { SectionId } from '../types/experience';
import { api } from '../services/api';
import { TextEffect } from './ui/text-effect';

interface HeroSectionProps {
  onNavigate: (section: SectionId) => void;
  heroData?: {
    headline?: string;
    supportingText?: string;
    locationText?: string;
    address?: string;
    videoUrl?: string;
    framesCount?: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, heroData: initialHeroData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [heroData, setHeroData] = useState(initialHeroData || null);

  useEffect(() => {
    if (!initialHeroData) {
      api.public.getHero().then((res) => {
        if (res) setHeroData(res);
      }).catch((e) => console.log('Hero fallback to default', e));
    }
  }, [initialHeroData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalFrames = heroData?.framesCount || 300;
  const currentFrame = Math.min(totalFrames, Math.max(1, Math.round(scrollProgress * (totalFrames - 1)) + 1));
  const secondsTotal = Math.floor(currentFrame / 24);
  const framesMod = currentFrame % 24;
  const timecode = `00:00:${String(secondsTotal).padStart(2, '0')}:${String(framesMod).padStart(2, '0')}`;

  const headline = heroData?.headline || "Some moments last a second.\nSome last forever.";
  const supportingText = heroData?.supportingText || "We capture the stories that stay with you.";
  const locationText = heroData?.locationText || heroData?.address || "Shaadi-Savan Atelier · Mumbai & Udaipur";

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[185vh] bg-transparent"
      aria-label="Cinematic Hero Reel"
    >
      {/* Full-Viewport Pinned Video Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-transparent">
        {/* Subtle Edge Gradients only for text contrast — centre couple is 100% crystal clear */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[60%] sm:w-[50%] lg:w-[42%] bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none z-0"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-0"
        />

        {/* Overlay Safe-Area Composition Layer */}
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pointer-events-none">
          {/* Main Headline: Left-Centre */}
          <div className="absolute left-6 sm:left-10 lg:left-14 top-1/2 -translate-y-1/2 max-w-[340px] sm:max-w-[440px] lg:max-w-[520px] pointer-events-auto">
            <TextEffect
              as="h1"
              per="word"
              speedReveal={0.8}
              speedSegment={0.8}
              className="font-serif-editorial text-[clamp(2.45rem,4.2vw,3.95rem)] font-medium tracking-[-0.01em] leading-[1.08] text-[#F3EBDD] whitespace-pre-line drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] [text-shadow:_0_2px_12px_rgba(0,0,0,0.9)]"
            >
              {headline}
            </TextEffect>
          </div>

          {/* Supporting Copy: Lower-Left */}
          <div className="absolute left-6 sm:left-10 lg:left-14 bottom-8 sm:bottom-10 max-w-[300px] sm:max-w-[380px] pointer-events-auto bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-xl">
            <p className="text-[12px] tracking-[0.14em] uppercase text-[#C6A875] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-mono font-semibold">
              {locationText}
            </p>
            <TextEffect
              as="p"
              per="word"
              delay={0.4}
              speedReveal={1.2}
              speedSegment={1.1}
              className="mt-1.5 text-[14px] sm:text-[15px] leading-[1.55] text-[#F3EBDD] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              {supportingText}
            </TextEffect>
          </div>

          {/* Scroll Indicator: Bottom-Centre */}
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-10 pointer-events-auto">
            <button
              type="button"
              onClick={() => onNavigate('philosophy')}
              className="inline-flex flex-col items-center gap-1.5 text-[12px] tracking-[0.12em] font-medium text-[#F3EBDD] hover:text-[#C6A875] transition-colors py-2 px-4 rounded-full bg-black/60 backdrop-blur-md border border-white/20 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] focus-visible:outline-2 focus-visible:outline-[#C6A875]"
            >
              <span className="uppercase text-[11px] font-mono tracking-widest text-[#F3EBDD]">Scroll</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#C6A875] animate-bounce" aria-hidden="true" />
            </button>
          </div>

          {/* Subtle Progress Indicator: Bottom-Right */}
          <div className="absolute right-6 sm:right-10 lg:right-14 bottom-8 sm:bottom-10 flex items-center gap-3 pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-xl">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? 'Pause ambient reel' : 'Play ambient reel'}
              className="w-8 h-8 rounded-full border border-white/20 bg-black/60 inline-flex items-center justify-center text-[#C6A875] hover:border-[#C6A875] transition-colors cursor-pointer shadow-md"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
              )}
            </button>

            <div className="flex flex-col items-end gap-1.5 font-mono">
              <span className="text-[11.5px] text-[#F3EBDD] font-medium tabular-nums drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {timecode} (Frame {currentFrame}/{totalFrames})
              </span>
              <div className="w-24 sm:w-32 h-[3px] bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C6A875] transition-[width] duration-75"
                  style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
