/**
 * =========================================================================================
 * 🎬 SCROLL ANIMATION & HERO CINEMATIC AMBIENT VIDEO LAYER
 * =========================================================================================
 * 
 * PERFORMANCE OPTIMIZATION (60fps Butter-Smooth Scroll):
 * - Replaces 300 heavy network-fetched JPG frames with a single GPU-accelerated HTML5 <video>.
 * - Easily supports 1-minute, 2-minute, or 3-minute video reels with zero memory drops.
 * - Uses hardware compositing (`transform: translate3d(0,0,0)`, `will-change: transform`).
 * - Automatically pauses when scrolled past Hero to free 100% CPU/GPU for fluid page scrolling.
 * 
 * 💡 TO CHANGE THIS VIDEO:
 * Edit `HERO_CONFIG.videoUrl` and `HERO_CONFIG.posterUrl` in `/src/data/portfolioContent.ts`.
 * =========================================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { HERO_CONFIG } from '../data/portfolioContent';

interface ScrollAnimationProps {
  className?: string;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // 1. Listen for play/pause toggle from Hero Section controls
  useEffect(() => {
    const handleToggle = (e: CustomEvent<{ playing: boolean }>) => {
      const video = videoRef.current;
      if (!video) return;
      if (e.detail.playing) {
        video.play().catch(() => {});
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('shaadi:toggle-ambient-reel' as any, handleToggle);
    return () => window.removeEventListener('shaadi:toggle-ambient-reel' as any, handleToggle);
  }, []);

  // 2. Pause video when scrolled out of view to ensure 100% buttery 60fps scrolling
  useEffect(() => {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;
          if (entry.isIntersecting) {
            if (isPlaying) video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [isPlaying]);

  const videoSrc = HERO_CONFIG.videoUrl;
  const posterSrc = HERO_CONFIG.posterUrl;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-black ${className}`}
      aria-hidden="true"
      style={{
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
      }}
    >
      {/* High-Resolution Luxury Poster Image (Always visible as instant fallback) */}
      <img
        src={posterSrc}
        alt="Shaadi-Savan Hero Visual"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* GPU Hardware-Accelerated 2-3 Minute Ambient Video */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: 'translate3d(0,0,0)',
            willChange: 'transform',
          }}
        />
      )}

      {/* Subtle luxury vignette & edge gradients for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-full max-w-[700px] bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none" />
    </div>
  );
};

export default ScrollAnimation;
