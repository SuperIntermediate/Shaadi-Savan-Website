import React from 'react';
import { Film as FilmIcon, Play } from 'lucide-react';
import { WEDDING_FILMS } from '../data/experience';
import { WeddingFilm } from '../types/experience';
import { TextEffect } from './ui/text-effect';

interface FilmsSectionProps {
  films?: any[];
  selectedFilm?: WeddingFilm;
  onSelectFilm: (film: WeddingFilm) => void;
  onLaunchPlayer: (film: WeddingFilm) => void;
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.includes('/uploads/');
}

export const FilmsSection: React.FC<FilmsSectionProps> = ({
  films,
  selectedFilm: initialSelectedFilm,
  onSelectFilm,
  onLaunchPlayer,
}) => {
  const displayFilms: WeddingFilm[] =
    films && films.length > 0
      ? films.map((f) => {
        // Normalize video and poster URLs
        const isPosterVideo = isVideoUrl(f.posterImage);
        const isUrlVideo = isVideoUrl(f.videoUrl);

        const actualVideoUrl = isUrlVideo
          ? f.videoUrl
          : isPosterVideo
            ? f.posterImage
            : f.videoUrl || '';

        const actualPoster =
          !isPosterVideo && f.posterImage
            ? f.posterImage
            : '/assets/images/film_cinema_still_1794655082919.jpg';

        return {
          id: f.id,
          title: f.title,
          couple: f.couple,
          location: f.location || 'India',
          duration: f.duration || '08:00',
          year: f.year || '2026',
          posterImage: actualPoster,
          videoUrl: actualVideoUrl,
          rawPoster: f.posterImage,
          scenes: f.scenes || [
            {
              image: actualPoster,
              caption: `${f.couple} · Scene 01 in ${f.location || 'Heritage Venue'}`,
            },
          ],
          storyBlurb: f.storyBlurb || '',
        } as WeddingFilm;
      })
      : WEDDING_FILMS;

  const currentSelectedFilm =
    initialSelectedFilm && displayFilms.some((f) => f.id === initialSelectedFilm.id)
      ? initialSelectedFilm
      : displayFilms[0];

  const activeVideoUrl =
    (currentSelectedFilm as any)?.videoUrl ||
    (isVideoUrl((currentSelectedFilm as any)?.rawPoster) ? (currentSelectedFilm as any)?.rawPoster : null);

  const activeIsVideo = Boolean(activeVideoUrl && isVideoUrl(activeVideoUrl));

  return (
    <section
      id="films"
      className="relative bg-transparent border-t border-[#754C3D]/30 py-24 sm:py-28 z-10"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span aria-hidden="true" className="w-5 h-[1.5px] bg-[#C6A875]" />
              <p className="text-[12px] tracking-[0.08em] uppercase text-[#C6A875] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                06 · The Wedding Film
              </p>
            </div>
            <TextEffect
              as="h2"
              per="word"
              speedReveal={1}
              speedSegment={1}
              className="font-serif-editorial text-[clamp(1.85rem,3vw,2.65rem)] font-medium tracking-[-0.015em] text-[#F3EBDD] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-wrap:balance]"
            >
              Cinema Built Around Real Sound
            </TextEffect>
          </div>
          <p className="text-[15px] text-[#F3EBDD] font-medium max-w-[42ch] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Every film begins with spoken vows, family laughter, and atmospheric music cut in widescreen 4K.
          </p>
        </div>

        {/* Active Full-Width Widescreen Film Preview */}
        {currentSelectedFilm && (
          <div className="relative bg-[#171512]/90 backdrop-blur-md border border-[#754C3D]/60 p-5 sm:p-7 rounded-2xl mb-8 shadow-2xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/60 border border-white/10 group">
              {activeIsVideo ? (
                <video
                  src={activeVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentSelectedFilm.posterImage}
                  alt={`${currentSelectedFilm.title} — ${currentSelectedFilm.couple}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/20 transition-colors">
                <button
                  type="button"
                  onClick={() => onLaunchPlayer(currentSelectedFilm)}
                  aria-label={`Play full widescreen film: ${currentSelectedFilm.title}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C6A875] text-[#171512] inline-flex items-center justify-center hover:scale-110 hover:bg-[#d8bc8a] transition-all cursor-pointer shadow-2xl"
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
                </button>
              </div>

              <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-[#F3EBDD] border border-white/20">
                {currentSelectedFilm.duration || '08:00'}
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[12.5px] font-mono font-semibold text-[#C6A875]">
                  {currentSelectedFilm.location} · {currentSelectedFilm.duration}
                </p>
                <TextEffect
                  as="h3"
                  per="word"
                  speedReveal={1}
                  speedSegment={1}
                  className="font-serif-editorial text-[25px] font-medium text-[#F3EBDD] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {`${currentSelectedFilm.title} (${currentSelectedFilm.couple})`}
                </TextEffect>
              </div>
              <button
                type="button"
                onClick={() => onLaunchPlayer(currentSelectedFilm)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-[13.5px] font-semibold hover:bg-[#C6A875] transition-colors cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Wedding Cinema</span>
              </button>
            </div>
          </div>
        )}

        {/* Film Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {displayFilms.map((film) => {
            const isSelected = film.id === currentSelectedFilm?.id;
            const filmVidUrl =
              (film as any).videoUrl ||
              (isVideoUrl((film as any).rawPoster) ? (film as any).rawPoster : null);
            const isCardVideo = isVideoUrl(filmVidUrl);

            return (
              <button
                key={film.id}
                type="button"
                onClick={() => onSelectFilm(film)}
                className={`p-4 rounded-xl text-left transition-all cursor-pointer ${isSelected
                  ? 'bg-[#30251F]/95 backdrop-blur-md border border-[#C6A875] ring-2 ring-[#C6A875]/40 shadow-xl'
                  : 'bg-[#171512]/85 backdrop-blur-md border border-[#754C3D]/50 hover:border-[#C6A875]/70 hover:bg-[#30251F]/50'
                  }`}
              >
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/60 mb-3 border border-white/10 relative">
                  {isCardVideo ? (
                    <video
                      src={filmVidUrl}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={film.posterImage}
                      alt={film.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white/90 fill-white/80" />
                  </div>
                </div>
                <h4 className="font-serif-editorial text-[18px] font-medium text-[#F3EBDD] truncate">
                  {film.title}
                </h4>
                <p className="text-[12px] font-mono text-[#C6A875] font-semibold mt-0.5">
                  {film.couple} · {film.duration}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
