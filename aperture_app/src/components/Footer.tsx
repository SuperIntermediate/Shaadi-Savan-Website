import React from 'react';
import { SectionId } from '../types/experience';

interface FooterProps {
  onNavigate: (section: SectionId) => void;
  onBookShoot: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onBookShoot }) => {
  return (
    <footer className="relative bg-black/45 border-t border-white/10 py-12 text-white z-10">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="text-[16px] font-semibold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            Shaadi-Savan
          </a>
          <p className="mt-1 text-[13px] text-neutral-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Documentary Wedding Photography &amp; Cinema · Jaripatka, Nagpur, Maharashtra
          </p>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center gap-7 text-[13.5px] text-neutral-200"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="hover:text-white transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            Home
          </a>
          <a
            href="#stories"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('stories');
            }}
            className="hover:text-white transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            Stories
          </a>
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('portfolio');
            }}
            className="hover:text-white transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            Portfolio
          </a>
          <a
            href="#packages"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('packages');
            }}
            className="hover:text-white transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            Packages
          </a>
          <button
            type="button"
            onClick={onBookShoot}
            className="text-white font-medium hover:underline underline-offset-4 cursor-pointer drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            Book a Shoot
          </button>
        </nav>

        <p className="text-[12.5px] text-neutral-400 tabular-nums drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          © 2026 Shaadi-Savan
        </p>
      </div>
    </footer>
  );
};
