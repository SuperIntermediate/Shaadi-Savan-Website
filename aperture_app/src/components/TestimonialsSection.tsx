import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';
import { TransitionPanel } from './ui/transition-panel';
import { TextEffect } from './ui/text-effect';
import { COUPLE_TESTIMONIALS } from '../data/experience';

interface TestimonialItem {
  id: string;
  couple: string;
  venue: string;
  coverage: string;
  quote: string;
  photo?: string;
  rating?: number;
  location?: string;
}

interface TestimonialsSectionProps {
  testimonials?: any[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Normalize testimonials from backend or fallback data
  const displayTestimonials: TestimonialItem[] =
    testimonials && testimonials.length > 0
      ? testimonials.map((t, idx) => ({
        id: t.id || `test-${idx}`,
        couple: t.couple || 'Anonymous Couple',
        venue: t.venue || t.location || 'India',
        coverage: t.coverage || t.ceremonyType || 'Heritage Commission',
        quote: t.quote || '',
        photo: t.photo || t.image || '/assets/images/wedding_jaipur_couple_1794571322579.jpg',
        rating: typeof t.rating === 'number' ? t.rating : 5,
        location: t.location || t.venue || 'India',
      }))
      : COUPLE_TESTIMONIALS.map((t) => ({
        id: t.id,
        couple: t.couple,
        venue: t.venue || t.location || 'India',
        coverage: t.coverage || t.ceremonyType || 'Heritage Commission',
        quote: t.quote,
        photo: t.photo || t.image,
        rating: t.rating ?? 5,
        location: t.location || t.venue || 'India',
      }));

  const totalCount = displayTestimonials.length;

  const handleStep = useCallback(
    (delta: number) => {
      if (totalCount === 0) return;
      setActiveIndex((prev) => (prev + delta + totalCount) % totalCount);
    },
    [totalCount]
  );

  // Keyboard navigation for carousel/panel switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input/textarea
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handleStep(-1);
      } else if (e.key === 'ArrowRight') {
        handleStep(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStep]);

  if (totalCount === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative bg-transparent border-t border-[#754C3D]/30 py-24 sm:py-32 z-10"
      aria-label="Client Testimonials and Reviews"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-[#30251F]/30 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2.5 mb-3">
            <span aria-hidden="true" className="w-6 h-[1.5px] bg-[#C6A875]" />
            <p className="font-mono text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-[#C6A875] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              07 · Testimonials
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <TextEffect
              as="h2"
              per="word"
              speedReveal={0.9}
              speedSegment={1}
              className="font-serif-editorial text-[clamp(2rem,3.8vw,3.25rem)] font-normal tracking-[-0.015em] text-[#F3EBDD] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-wrap:balance]"
            >
              Words From Our Couples
            </TextEffect>
            <p className="font-sans text-[14px] sm:text-[15px] text-[#B9AD9A] max-w-[460px] leading-relaxed">
              Archival reflections and spoken memories from intimate palace ceremonies, lakeside pheras, and multi-day celebrations.
            </p>
          </div>
        </div>

        {/* Card with Transition Panel Container */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#C6A875]/25 bg-[#171512]/95 backdrop-blur-md p-6 sm:p-10 lg:p-14 shadow-2xl shadow-black/80">
          {/* Card Top Navigation Bar: Couple Tabs & Navigation Steppers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#754C3D]/35">
            {/* Couple Switcher Tabs */}
            <div
              role="tablist"
              aria-label="Select couple testimonial"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
            >
              {displayTestimonials.map((item, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={item.id || idx}
                    role="tab"
                    id={`testimonial-tab-${idx}`}
                    aria-selected={isSelected}
                    aria-controls={`testimonial-panel-${idx}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-sans transition-all duration-300 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A875] ${isSelected
                      ? 'bg-[#C6A875]/20 text-[#F3EBDD] border border-[#C6A875]/50 shadow-sm font-medium'
                      : 'text-[#B9AD9A] hover:text-[#F3EBDD] hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <span>{item.couple}</span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Controls & Counter */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <span className="font-mono text-[11px] sm:text-[12px] tracking-[0.16em] text-[#C6A875] mr-1">
                {String(activeIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => handleStep(-1)}
                aria-label="Previous testimonial"
                className="w-9 h-9 rounded-full border border-white/20 bg-black/40 inline-flex items-center justify-center text-[#F3EBDD] hover:border-[#C6A875] hover:text-[#C6A875] transition-colors cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A875]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleStep(1)}
                aria-label="Next testimonial"
                className="w-9 h-9 rounded-full border border-white/20 bg-black/40 inline-flex items-center justify-center text-[#F3EBDD] hover:border-[#C6A875] hover:text-[#C6A875] transition-colors cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A875]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Transition Panel for Testimonial Cards */}
          <TransitionPanel
            activeIndex={activeIndex}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            variants={{
              enter: { opacity: 0, y: 18, filter: 'blur(4px)' },
              center: { opacity: 1, y: 0, filter: 'blur(0px)' },
              exit: { opacity: 0, y: -18, filter: 'blur(4px)' },
            }}
            className="w-full pt-8 sm:pt-10"
          >
            {displayTestimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                role="tabpanel"
                id={`testimonial-panel-${idx}`}
                aria-labelledby={`testimonial-tab-${idx}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center"
              >
                {/* Left/Main Column: Quote & Commission Details */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  {/* Rating & Heritage Commission Badge */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                    {typeof item.rating === 'number' && item.rating > 0 && (
                      <div
                        className="flex items-center gap-1 bg-[#30251F]/80 border border-[#C6A875]/30 px-3 py-1 rounded-full shadow-inner"
                        aria-label={`${item.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${
                              starIdx < Math.min(5, Math.max(1, item.rating ?? 5))
                                ? 'fill-[#C6A875] text-[#C6A875]'
                                : 'text-[#C6A875]/25'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                        <span className="font-mono text-[11px] text-[#F3EBDD] font-medium ml-1">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#C6A875]/90">
                      <Sparkles className="w-3.5 h-3.5 text-[#C6A875]" />
                      <span>Verified Commission</span>
                    </div>
                  </div>

                  {/* Main Testimonial Quote */}
                  <blockquote className="font-serif-editorial text-[clamp(1.4rem,2.4vw,2.15rem)] font-light leading-[1.38] text-[#F3EBDD] tracking-[-0.01em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    “{item.quote}”
                  </blockquote>

                  {/* Couple and Location Metadata */}
                  <div className="mt-8 pt-6 border-t border-[#754C3D]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif-editorial text-[22px] sm:text-[26px] font-medium text-[#F3EBDD] tracking-[-0.01em]">
                        {item.couple}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[13px] text-[#B9AD9A] mt-1">
                        <span className="inline-flex items-center gap-1 text-[#C6A875]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{item.venue}</span>
                        </span>
                        <span className="text-[#74745C]">•</span>
                        <span className="font-mono text-[12px] text-[#B9AD9A]">
                          {item.coverage}
                        </span>
                      </div>
                    </div>

                    {/* Action link referencing stories / inquiries */}
                    <a
                      href="#stories"
                      className="inline-flex items-center gap-1 text-[13px] font-sans font-medium text-[#C6A875] hover:text-[#F3EBDD] transition-colors self-start sm:self-auto group"
                    >
                      <span>Explore Story</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>

                {/* Right Column: High Quality Couple Photography Frame */}
                {item.photo && (
                  <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden border border-[#C6A875]/30 shadow-2xl bg-[#30251F]/40 group">
                      <img
                        src={item.photo}
                        alt={`${item.couple} wedding portrait at ${item.venue}`}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Subtle warm overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      {/* Archival Badge */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[#F3EBDD] text-[11px] font-mono tracking-wider pointer-events-none">
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 uppercase">
                          {item.venue.split(',')[0]}
                        </span>
                        <span className="text-[#C6A875] text-[10px] tracking-widest uppercase">
                          Shaadi-Savan Archive
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TransitionPanel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
