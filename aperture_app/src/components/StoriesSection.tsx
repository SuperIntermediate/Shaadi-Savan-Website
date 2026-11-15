import React from 'react';
import { Link } from 'react-router-dom';
import { Expand, Play } from 'lucide-react';
import { FEATURED_STORIES } from '../data/experience';
import { FeaturedStory } from '../types/experience';
import { TextEffect } from './ui/text-effect';

interface StoriesSectionProps {
  stories?: any[];
  onOpenStory: (story: FeaturedStory) => void;
  onPreviewFilm: (story: FeaturedStory) => void;
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  onOpenStory,
  onPreviewFilm,
}) => {
  const displayStories = stories && stories.length > 0 ? stories : FEATURED_STORIES;

  return (
    <section
      id="stories"
      className="relative bg-transparent border-t border-[#754C3D]/30 py-24 sm:py-28 z-10"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span aria-hidden="true" className="w-5 h-[1.5px] bg-[#C6A875]" />
              <p className="text-[12px] tracking-[0.08em] uppercase text-[#C6A875] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                03 · Featured Stories
              </p>
            </div>
            <TextEffect
              as="h2"
              per="word"
              speedReveal={1}
              speedSegment={1}
              className="font-serif-editorial text-[clamp(1.85rem,3vw,2.65rem)] font-medium tracking-[-0.015em] text-[#F3EBDD] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-wrap:balance]"
            >
              Real Celebrations &amp; Films
            </TextEffect>
          </div>
          <p className="text-[15px] text-[#F3EBDD] font-medium max-w-[42ch] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Multi-day wedding commissions photographed and filmed across heritage palaces, havelis, and coastal retreats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayStories.map((story) => {
            const couple = story.couple || story.coupleNames || 'Beloved Couple';
            const cover = story.coverImage || '/assets/images/wedding_jaipur_couple_1794571322579.jpg';
            const location = story.location || 'Heritage Destination';
            const season = story.season || story.weddingDate || '2026 Celebration';
            const summary = story.summary || story.description || '';
            const coverage = story.coverageDays || story.category || 'Multi-Day Commission';
            const slug = story.slug || story.id;

            // Normalized object for modals
            const normalizedStory: FeaturedStory = {
              id: story.id,
              couple,
              location,
              season,
              coverageDays: coverage,
              coverImage: cover,
              galleryImages: story.gallery || story.galleryImages || [cover],
              filmTitle: story.filmTitle || story.title || `${couple}'s Wedding Film`,
              filmDuration: story.filmDuration || '08:00',
              summary,
              exif: story.exif || '35mm & 4K Cinema',
            };

            return (
              <article
                key={story.id}
                className="group relative bg-[#171512]/90 backdrop-blur-md border border-[#754C3D]/60 hover:border-[#C6A875] p-5 sm:p-6 rounded-2xl transition-all duration-200 flex flex-col shadow-2xl"
              >
                {/* Muted Viewfinder Corners */}
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 left-2.5 z-10 w-3 h-3 border-t border-l border-[#C6A875] transition-colors"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-2.5 right-2.5 z-10 w-3 h-3 border-b border-r border-[#C6A875] transition-colors"
                />

                {/* Cover Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/60 border border-white/10 mb-5">
                  <img
                    src={cover}
                    alt={`${couple} · ${location}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviewFilm(normalizedStory)}
                      aria-label={`Play film preview for ${couple}`}
                      className="h-8 px-3 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[12px] font-medium text-white inline-flex items-center gap-1.5 hover:border-[#C6A875] hover:text-[#C6A875] transition-colors cursor-pointer drop-shadow-md"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch Film</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenStory(normalizedStory)}
                      aria-label={`Inspect ${couple} gallery`}
                      className="w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white inline-flex items-center justify-center hover:border-[#C6A875] hover:text-[#C6A875] transition-colors cursor-pointer drop-shadow-md"
                    >
                      <Expand className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Story Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[12.5px] text-[#C6A875] font-semibold mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-mono">
                      <span>{location}</span>
                      <span>{season}</span>
                    </div>
                    <TextEffect
                      as="h3"
                      per="word"
                      speedReveal={1.1}
                      speedSegment={1}
                      className="font-serif-editorial text-[25px] font-medium text-[#F3EBDD] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                      {couple}
                    </TextEffect>
                    <p className="mt-2 text-[14.5px] leading-[1.65] text-[#F3EBDD] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-3">
                      {summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#754C3D]/40 flex items-center justify-between text-[13px] text-[#F3EBDD] font-medium">
                    <span className="tabular-nums">{coverage}</span>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/story/${slug}`}
                        className="text-[#C6A875] hover:underline cursor-pointer font-semibold"
                      >
                        Read Editorial Story →
                      </Link>
                    </div>
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
