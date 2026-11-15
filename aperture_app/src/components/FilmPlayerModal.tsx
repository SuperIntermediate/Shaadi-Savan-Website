import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { WeddingFilm } from '../types/experience';

interface FilmPlayerModalProps {
  film: WeddingFilm | null;
  onClose: () => void;
  onInquireFilm: (film: WeddingFilm) => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
    : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  return match && match[1] ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : null;
}

export const FilmPlayerModal: React.FC<FilmPlayerModalProps> = ({
  film,
  onClose,
  onInquireFilm,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!film) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && videoRef.current) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [film, onClose]);

  if (!film) return null;

  // Determine actual video URL (handling cases where user uploaded video in posterImage or videoUrl)
  const candidateUrl =
    film.videoUrl && !film.videoUrl.endsWith('.jpg') && !film.videoUrl.endsWith('.png')
      ? film.videoUrl
      : (film.posterImage?.endsWith('.mp4') || film.posterImage?.endsWith('.webm')
          ? film.posterImage
          : film.videoUrl || film.posterImage);

  const isVideoFile =
    candidateUrl &&
    (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(candidateUrl) || candidateUrl.includes('/uploads/'));

  const youtubeEmbed = candidateUrl ? getYouTubeEmbedUrl(candidateUrl) : null;
  const vimeoEmbed = candidateUrl ? getVimeoEmbedUrl(candidateUrl) : null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.play().catch(() => {
      // Autoplay with sound might be blocked, mute and retry
      if (videoRef.current) {
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play().catch(() => {});
      }
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-player-title"
    >
      {/* Top Cinema Bar */}
      <div className="max-w-[1240px] w-full mx-auto flex items-center justify-between gap-4">
        <div>
          <p className="text-[12px] font-mono tracking-wider text-[#C6A875]">
            {film.couple} · {film.location} {film.year ? `· ${film.year}` : ''}
          </p>
          <h3
            id="film-player-title"
            className="font-serif-editorial text-[20px] sm:text-[26px] text-[#F3EBDD] font-medium"
          >
            {film.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close full-screen film preview"
          className="w-11 h-11 rounded-full border border-white/20 bg-[#30251F]/80 inline-flex items-center justify-center text-[#F3EBDD] hover:border-[#C6A875] hover:text-[#C6A875] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Cinema Viewport */}
      <div className="max-w-[1160px] w-full mx-auto my-3 flex-1 flex items-center justify-center min-h-0">
        <div className="relative w-full aspect-[16/9] max-h-[72vh] bg-black border border-[#754C3D]/50 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
          {youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              title={film.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : vimeoEmbed ? (
            <iframe
              src={vimeoEmbed}
              title={film.title}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : isVideoFile ? (
            <video
              ref={videoRef}
              src={candidateUrl}
              poster={!film.posterImage?.endsWith('.mp4') ? film.posterImage : undefined}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              playsInline
              className="w-full h-full object-contain cursor-pointer"
            />
          ) : (
            // Fallback cinematic still presentation if no video uploaded yet
            <div className="relative w-full h-full">
              <img
                src={film.posterImage || '/assets/images/film_cinema_still_1794655082919.jpg'}
                alt={film.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                <Play className="w-16 h-16 text-[#C6A875] mb-3 opacity-90" />
                <h4 className="font-serif-editorial text-2xl text-[#F3EBDD]">{film.title}</h4>
                <p className="text-xs font-mono text-[#C6A875] mt-1">Runtime: {film.duration || '08:00'}</p>
                <p className="text-sm text-[#B9AD9A] max-w-md mt-2">
                  {film.storyBlurb || 'Heirloom film recorded across ceremonies in 4K widescreen.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="max-w-[1160px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {isVideoFile && (
          <div className="flex items-center gap-3 w-full sm:flex-1">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause film' : 'Play film'}
              className="w-10 h-10 rounded-full bg-[#C6A875] text-[#171512] inline-flex items-center justify-center shrink-0 hover:bg-[#D5B988] transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 text-[#B9AD9A] hover:text-[#F3EBDD] transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Film timeline scrubber"
              className="w-full accent-[#C6A875] cursor-pointer"
            />

            <span className="font-mono text-xs text-[#B9AD9A] tabular-nums whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button
              type="button"
              onClick={handleFullScreen}
              aria-label="Fullscreen"
              className="p-2 text-[#B9AD9A] hover:text-[#F3EBDD] transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 ml-auto">
          <button
            type="button"
            onClick={() => onInquireFilm(film)}
            className="inline-flex items-center justify-center border border-[#C6A875] text-[#C6A875] rounded-full px-5 py-2 text-[12.5px] font-medium hover:bg-[#C6A875] hover:text-[#171512] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Inquire About Wedding Films
          </button>
        </div>
      </div>
    </div>
  );
};
