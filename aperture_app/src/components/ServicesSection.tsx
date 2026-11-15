import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AGENCY_SERVICES } from '../data/experience';
import { TextEffect } from './ui/text-effect';
import { Spotlight } from './ui/spotlight';

interface ServicesSectionProps {
  services?: any[];
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
}) => {
  const displayServices =
    services && services.length > 0
      ? services.map((s, idx) => ({
        id: s.id || `srv-${idx}`,
        title: s.title,
        tag: s.tag || s.subtitle || 'Heirloom Commission',
        description: s.description,
        deliverables: s.deliverables || 'Curated Gallery · Private Vault',
      }))
      : AGENCY_SERVICES;

  return (
    <section
      id="services"
      className="relative bg-transparent border-t border-[#754C3D]/30 py-24 sm:py-28 z-10"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span aria-hidden="true" className="w-5 h-[1.5px] bg-[#C6A875]" />
              <p className="text-[12px] tracking-[0.08em] uppercase text-[#C6A875] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                04 · What We Capture
              </p>
            </div>
            <TextEffect
              as="h2"
              per="word"
              speedReveal={1}
              speedSegment={1}
              className="font-serif-editorial text-[clamp(1.85rem,3vw,2.65rem)] font-medium tracking-[-0.015em] text-[#F3EBDD] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-wrap:balance]"
            >
              Crafted Across Every Format
            </TextEffect>
          </div>
          <p className="text-[15px] text-[#F3EBDD] font-medium max-w-[42ch] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Specialized offerings designed around unhurried visual storytelling, authentic sound, and archival printmaking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="relative rounded-2xl p-[1.5px] overflow-hidden group bg-[#754C3D]/30 border border-[#754C3D]/45 hover:border-[#C6A875]/40 transition-colors duration-300 shadow-2xl"
            >
              <Spotlight
                className="from-[#C6A875]/80 via-[#F3EBDD]/40 to-transparent blur-md"
                size={280}
                springOptions={{
                  stiffness: 260,
                  damping: 24,
                  mass: 0.2,
                }}
              />

              <div className="relative z-10 rounded-[calc(1rem-1.5px)] bg-[#171512]/95 backdrop-blur-md p-7 h-full flex flex-col justify-between">
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#C6A875]/60 group-hover:border-[#C6A875] transition-colors"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[#C6A875]/60 group-hover:border-[#C6A875] transition-colors"
                />

                <div>
                  <p className="text-[12.5px] text-[#C6A875] font-mono tracking-wider font-semibold drop-shadow-sm">
                    {service.tag}
                  </p>
                  <TextEffect
                    as="h3"
                    per="word"
                    speedReveal={1}
                    speedSegment={1}
                    className="mt-2 font-serif-editorial text-[23px] font-medium text-[#F3EBDD] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    {service.title}
                  </TextEffect>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-[#F3EBDD] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#754C3D]/40 flex items-center justify-between">
                  <span className="text-[13px] text-[#F3EBDD] font-medium tabular-nums">
                    {service.deliverables}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C6A875] hover:text-[#F3EBDD] transition-colors cursor-pointer"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
