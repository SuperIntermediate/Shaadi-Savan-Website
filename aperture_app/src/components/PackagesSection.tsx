import React from 'react';
import { Calendar } from 'lucide-react';
import { CLIENT_TESTIMONIALS, COVERAGE_PACKAGES } from '../data/portfolio';

interface PackagesSectionProps {
  onSelectPackage: (packageName: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  onSelectPackage,
}) => {
  return (
    <section
      id="packages"
      className="relative bg-transparent border-t border-white/10 py-20 sm:py-24 text-white z-10"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
        {/* Packages Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[12px] tracking-[0.08em] uppercase text-neutral-300 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              2026 – 2027 Season
            </p>
            <h2 className="text-[clamp(1.65rem,2.6vw,2.25rem)] font-bold tracking-[-0.02em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-wrap:balance]">
              Coverage &amp; Investment
            </h2>
          </div>
          <p className="text-[14.5px] text-neutral-200 max-w-[40ch] leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            We accept a limited number of weddings each season so every celebration receives unhurried editorial attention.
          </p>
        </div>

        {/* 3-Column Coverage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COVERAGE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="relative bg-black/35 border border-white/20 p-8 rounded-xl flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between text-[12px] text-neutral-300 tabular-nums mb-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  <span>{pkg.index}</span>
                  <span>{pkg.duration}</span>
                </div>

                <h3 className="text-[20px] font-semibold tracking-[-0.015em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {pkg.name}
                </h3>

                <p className="mt-2 text-[24px] font-bold tracking-[-0.02em] tabular-nums text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {pkg.investment}
                </p>

                <p className="mt-3 text-[14px] leading-[1.55] text-neutral-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {pkg.description}
                </p>

                <ul className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-[13.5px] text-neutral-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {pkg.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-white shrink-0 shadow-sm"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => onSelectPackage(pkg.name)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-5 py-3 text-[13.5px] font-semibold hover:bg-neutral-200 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Calendar className="w-4 h-4 stroke-[2]" aria-hidden="true" />
                  <span>Check Date Availability</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Attributable Couple Testimonials */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <p className="text-[12px] tracking-[0.08em] uppercase text-neutral-300 mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Couple Notes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {CLIENT_TESTIMONIALS.map((note) => (
              <blockquote key={note.id} className="flex flex-col justify-between bg-black/30 p-6 rounded-xl border border-white/15 shadow-lg">
                <p className="text-[14.5px] leading-[1.65] text-neutral-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  “{note.quote}”
                </p>
                <footer className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-[14px] font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {note.couple}
                  </p>
                  <p className="text-[12px] text-neutral-300 mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {note.venue}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
