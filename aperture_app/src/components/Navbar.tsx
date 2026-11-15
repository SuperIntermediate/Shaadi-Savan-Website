import React from 'react';
import { SectionId } from '../types/experience';

interface NavbarProps {
  activeSection: SectionId;
  isScrolledPastHero: boolean;
  onNavigate: (section: SectionId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  isScrolledPastHero,
  onNavigate,
}) => {
  const navLinks: { id: SectionId; label: string }[] = [
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'stories', label: 'Stories' },
    { id: 'services', label: 'Services' },
    { id: 'moments', label: 'Moments' },
    { id: 'films', label: 'Films' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolledPastHero
          ? 'bg-[#171512]/95 backdrop-blur-md border-b border-[#C6A875]/25 shadow-2xl'
          : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent backdrop-blur-[2px]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 h-20 sm:h-22 lg:h-24 flex items-center justify-between gap-8 transition-all duration-300">
        {/* Top-Left: Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          aria-label="Shaadi-Savan Home"
          className="inline-flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6A875] py-1"
        >
          <img
            src="/assets/aistudio/Elegant_Gold_Shaadi-Savan_Emblem_d563beae.png"
            alt="Shaadi-Savan"
            className="h-12 sm:h-14 lg:h-[4.25rem] w-auto max-w-[220px] sm:max-w-[280px] object-contain block brightness-125 contrast-110 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] transition-all duration-200 hover:brightness-140 hover:scale-[1.02]"
          />
        </a>

        {/* Top-Right: Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-7 text-[13.5px]"
          >
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  className={`relative py-2 whitespace-nowrap shrink-0 transition-colors duration-150 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6A875] ${
                    isActive
                      ? 'text-[#F3EBDD] font-semibold'
                      : 'text-[#F3EBDD] font-normal hover:text-[#C6A875]'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 bottom-1 h-[2px] bg-[#C6A875] transition-opacity duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => onNavigate('booking')}
            className="inline-flex items-center justify-center bg-[#C6A875] text-[#171512] rounded-full px-5 py-2 text-[13px] font-semibold hover:bg-[#D5B988] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6A875]"
          >
            Inquire
          </button>
        </div>
      </div>
    </header>
  );
};
