import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { FeaturedStory } from '../types/experience';

interface StoryLightboxModalProps {
  story: FeaturedStory | null;
  onClose: () => void;
  onPlayFilm: (story: FeaturedStory) => void;
  onInquireStory: (story: FeaturedStory) => void;
}

export const StoryLightboxModal: React.FC<StoryLightboxModalProps> = ({
  story,
  onClose,
  onPlayFilm,
  onInquireStory,
}) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [story]);

  useEffect(() => {
    if (!story) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setImageIndex(
          (prev) =>
            (prev - 1 + story.galleryImages.length) %
            story.galleryImages.length,
        );
      }
      if (e.key === 'ArrowRight') {
        setImageIndex((prev) => (prev + 1) % story.galleryImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [story, onClose]);

  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#171512]/85 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-lightbox-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[960px] bg-[#30251F] border border-[#754C3D]/60 p-5 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[#754C3D]/40">
          <div className="flex items-center gap-2 text-[12px] text-[#F3EBDD]/70">
            <span className="font-medium text-[#C6A875]">{story.couple}</span>
            <span aria-hidden="true" className="text-[#74745C]">·</span>
            <span>{story.location}</span>
            <span aria-hidden="true" className="text-[#74745C]">·</span>
            <span>{story.season}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close story gallery"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-[#F3EBDD]/80 hover:text-[#C6A875] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 relative">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#171512] border border-[#74745C]/40">
              <img
                src={story.galleryImages[imageIndex]}
                alt={`${story.couple} — Frame ${imageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[12px] text-[#F3EBDD]/65 tabular-nums">
                Frame {imageIndex + 1} of {story.galleryImages.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setImageIndex(
                      (prev) =>
                        (prev - 1 + story.galleryImages.length) %
                        story.galleryImages.length,
                    )
                  }
                  aria-label="Previous story frame"
                  className="w-9 h-9 rounded-full border border-[#74745C]/60 inline-flex items-center justify-center text-[#F3EBDD] hover:border-[#C6A875] hover:text-[#C6A875] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImageIndex((prev) => (prev + 1) % story.galleryImages.length)
                  }
                  aria-label="Next story frame"
                  className="w-9 h-9 rounded-full border border-[#74745C]/60 inline-flex items-center justify-center text-[#F3EBDD] hover:border-[#C6A875] hover:text-[#C6A875] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-[12px] text-[#C6A875]">{story.coverageDays}</p>
              <h3
                id="story-lightbox-title"
                className="mt-1 font-serif-editorial text-[26px] font-medium text-[#F3EBDD]"
              >
                {story.couple}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.65] text-[#F3EBDD]/80">
                {story.summary}
              </p>
              <p className="mt-4 pt-4 border-t border-[#754C3D]/35 text-[12.5px] text-[#F3EBDD]/65 tabular-nums">
                {story.exif}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => onPlayFilm(story)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C6A875] text-[#171512] rounded-full py-2.5 px-5 text-[13.5px] font-semibold hover:bg-[#D5B988] transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Watch &ldquo;{story.filmTitle}&rdquo;</span>
              </button>

              <button
                type="button"
                onClick={() => onInquireStory(story)}
                className="w-full inline-flex items-center justify-center border border-[#74745C] text-[#F3EBDD] rounded-full py-2.5 px-5 text-[13px] font-medium hover:border-[#C6A875] hover:text-[#C6A875] transition-colors cursor-pointer"
              >
                Inquire for Similar Coverage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
