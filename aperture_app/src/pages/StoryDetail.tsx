import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Film,
  Heart,
  MapPin,
  Play,
  Share2,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { LightboxModal } from '../components/LightboxModal';

interface WeddingStory {
  id: string;
  slug: string;
  title: string;
  coupleNames: string;
  location: string;
  weddingDate: string;
  category: string;
  coverImage: string;
  gallery: string[];
  description: string;
  filmDuration?: string;
  isPublished?: boolean;
}

export const StoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<WeddingStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        if (slug) {
          const data = await api.public.getStoryBySlug(slug);
          setStory(data);
        }
      } catch (err) {
        console.error('Failed to fetch story:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171512] text-[#F3EBDD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif-editorial text-xl tracking-wide text-[#C6A875]">
            Opening Heirloom Story...
          </p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#171512] text-[#F3EBDD] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif-editorial text-3xl text-[#C6A875] mb-3">
          Celebration Not Found
        </h1>
        <p className="text-[#B9AD9A] max-w-md mb-6">
          The requested wedding story might have been moved or archived into private vaults.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#C6A875] text-[#171512] font-semibold text-sm rounded-lg hover:bg-[#d8bc8a] transition-colors"
        >
          Return to Studio Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171512] text-[#F3EBDD] selection:bg-[#C6A875] selection:text-[#171512]">
      {/* Top Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#171512]/80 border-b border-[#30251F] backdrop-blur-none px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-[#F3EBDD]/80 hover:text-[#C6A875] transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-wider">Back to Collections</span>
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/assets/aistudio/Elegant_Gold_Shaadi-Savan_Emblem_d563beae.png"
            alt="Shaadi-Savan"
            className="h-10 sm:h-12 w-auto object-contain brightness-125 contrast-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          />
        </Link>

        <a
          href="/#booking"
          className="px-4 py-1.5 rounded-full border border-[#C6A875] text-xs font-mono tracking-wider text-[#C6A875] hover:bg-[#C6A875] hover:text-[#171512] transition-colors"
        >
          Inquire Commission
        </a>
      </header>

      {/* Hero Banner */}
      <section className="relative pt-24 min-h-[70vh] flex flex-col justify-end p-6 sm:p-12 lg:p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={story.coverImage}
            alt={story.coupleNames}
            className="w-full h-full object-cover brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#C6A875] tracking-wider uppercase">
            <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              <MapPin className="w-3.5 h-3.5" />
              {story.location}
            </span>
            <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              <Calendar className="w-3.5 h-3.5" />
              {story.weddingDate}
            </span>
            {story.category && (
              <span className="bg-[#C6A875]/20 text-[#C6A875] px-3 py-1 rounded-full border border-[#C6A875]/40">
                {story.category}
              </span>
            )}
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F3EBDD] tracking-tight leading-none drop-shadow-xl">
            {story.coupleNames}
          </h1>

          <p className="font-serif-editorial italic text-2xl sm:text-3xl text-[#C6A875] drop-shadow-md">
            "{story.title}"
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-20 space-y-8">
        <div className="border-t border-[#754C3D]/40 pt-8">
          <span className="font-mono text-xs text-[#C6A875] uppercase tracking-[0.2em] block mb-3">
            The Story Behind the Days
          </span>
          <p className="text-lg sm:text-xl font-light text-[#F3EBDD]/90 leading-relaxed font-sans">
            {story.description}
          </p>
        </div>

        {story.filmDuration && (
          <div className="p-6 rounded-2xl bg-[#30251F]/40 border border-[#754C3D]/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C6A875] text-[#171512] flex items-center justify-center">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <p className="font-serif-editorial text-lg text-[#F3EBDD] font-medium">
                  Cinematic Wedding Film Teaser
                </p>
                <p className="font-mono text-xs text-[#B9AD9A]">
                  Runtime: {story.filmDuration} · 4K Widescreen Cinema
                </p>
              </div>
            </div>
            <a
              href="/#films"
              className="px-4 py-2 bg-[#171512] border border-[#C6A875]/50 text-[#C6A875] hover:bg-[#C6A875] hover:text-[#171512] text-xs font-mono uppercase tracking-wider rounded-lg transition-colors"
            >
              Watch in Cinema Hub
            </a>
          </div>
        )}
      </section>

      {/* Curated Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-28">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C6A875] block mb-2">
            Archival Heirloom Gallery
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#F3EBDD]">
            Curated Frames of Memory
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(story.gallery && story.gallery.length > 0 ? story.gallery : [story.coverImage]).map(
            (photo, index) => (
              <div
                key={index}
                onClick={() => setActivePhoto(photo)}
                className="group relative aspect-[4/5] bg-black/40 border border-[#30251F] hover:border-[#C6A875] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl"
              >
                <img
                  src={photo}
                  alt={`${story.coupleNames} frame ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-black/80 border border-white/20 rounded-full font-mono text-xs text-[#F3EBDD]">
                    Inspect Frame ↗
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Footer Booking Invitation */}
      <section className="bg-[#12100E] border-t border-[#30251F] py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C6A875]">
            Capture Your Story
          </p>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#F3EBDD]">
            Every wedding deserves to live forever.
          </h2>
          <p className="text-sm text-[#B9AD9A] leading-relaxed">
            Reserve your wedding dates with Shaadi-Savan. We take a strictly limited number of commissions each season to ensure uncompromising artistic dedication.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/#booking"
              className="px-6 py-3 bg-[#C6A875] text-[#171512] font-semibold text-sm rounded-lg hover:bg-[#d8bc8a] transition-colors"
            >
              Inquire Your Celebration
            </a>
            <Link
              to="/"
              className="px-6 py-3 bg-[#30251F]/40 border border-[#754C3D]/50 text-[#F3EBDD] text-sm rounded-lg hover:bg-[#30251F] transition-colors"
            >
              Explore Other Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={activePhoto}
            alt="Enlarged Frame"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg border border-white/20"
          />
        </div>
      )}
    </div>
  );
};
