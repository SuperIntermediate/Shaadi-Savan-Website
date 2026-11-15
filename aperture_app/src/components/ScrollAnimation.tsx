/**
 * =========================================================================================
 * 🎬 SCROLL ANIMATION — 300-FRAME CINEMATIC WEDDING CANVAS ENGINE
 * =========================================================================================
 * 
 * PERFORMANCE ARCHITECTURE (Zero-Lag, 60fps/120fps Butter-Smooth Scroll):
 * - Scrubs through 300 high-definition wedding film frames as the user scrolls.
 * - Off-thread decoding with `createImageBitmap` to prevent main-thread UI hitching.
 * - O(1) nearest-frame fallback so the canvas is ALWAYS crystal-clear and never blank.
 * - Hardware compositing (`desynchronized: true`, `will-change: transform`).
 * - DPR capped at 1.5 for maximum sharpness without 4K overhead.
 * - Delta-time lerp smoothing for cinematic fluid response across all devices.
 * 
 * 💡 TO REPLACE / CUSTOMIZE FRAMES:
 * -----------------------------------------------------------------------------------------
 * Place your 300 frames in: `/public/wedding_video_frames_30fps/`
 * Named as: frame_000001.jpg, frame_000002.jpg ... frame_000300.jpg
 * 
 * To switch between 300-frame scroll animation vs direct video, see `HERO_CONFIG`
 * in `/src/data/portfolioContent.ts`.
 * =========================================================================================
 */

import React, { useEffect, useRef } from 'react';
import { HERO_CONFIG } from '../data/portfolioContent';

const TOTAL_FRAMES = 300;
const FRAME_DIR = '/wedding_video_frames_30fps';

function getFrameUrl(i: number) {
  const padded = String(i).padStart(6, '0');
  return `${FRAME_DIR}/frame_${padded}.jpg`;
}

interface ScrollAnimationProps {
  className?: string;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use desynchronized & alpha: false for highest possible 60/120fps throughput
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    // Store ImageBitmap or HTMLImageElement for instant drawing without decode hitch
    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(TOTAL_FRAMES + 1).fill(null);
    const isLoaded = new Uint8Array(TOTAL_FRAMES + 1);
    const isFetching = new Uint8Array(TOTAL_FRAMES + 1);

    let lastDrawnIndex = -1;
    let currentProgress = 0;
    let targetProgress = 0;
    let animationFrameId: number;
    let isCancelled = false;

    // Fast O(1) ~ O(k) outward nearest-frame finder (prevents any blank flash)
    const findClosestLoaded = (target: number): number => {
      if (isLoaded[target]) return target;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const left = target - offset;
        if (left >= 1 && isLoaded[left]) return left;
        const right = target + offset;
        if (right <= TOTAL_FRAMES && isLoaded[right]) return right;
      }
      return -1;
    };

    const resizeCanvas = () => {
      // Cap DPR at 1.5 for pristine sharpness without the 4x pixel overhead of DPR=2/3 on 4K screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
      }

      if (lastDrawnIndex > 0) {
        drawFrame(lastDrawnIndex, true);
      }
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Core Drawing function
    const drawFrame = (index: number, force = false) => {
      let frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));

      if (!isLoaded[frameIndex]) {
        const closest = findClosestLoaded(frameIndex);
        if (closest !== -1) {
          frameIndex = closest;
        } else if (!force) {
          return;
        }
      }

      if (frameIndex === lastDrawnIndex && !force) return;

      const img = frames[frameIndex];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const imgWidth = 'width' in img ? img.width : (img as HTMLImageElement).naturalWidth;
      const imgHeight = 'height' in img ? img.height : (img as HTMLImageElement).naturalHeight;

      if (!imgWidth || !imgHeight) return;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = cw / ch;

      let dw: number, dh: number, dx: number, dy: number;

      // Cover aspect ratio calculation (full viewport cover without distortion)
      if (canvasRatio > imgRatio) {
        dw = cw;
        dh = cw / imgRatio;
        dx = 0;
        dy = (ch - dh) * 0.5;
      } else {
        dh = ch;
        dw = ch * imgRatio;
        dx = (cw - dw) * 0.5;
        dy = 0;
      }

      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnIndex = frameIndex;
    };

    // Asynchronous loader with off-thread decode / ImageBitmap
    const loadFrame = async (idx: number): Promise<void> => {
      if (idx < 1 || idx > TOTAL_FRAMES || isLoaded[idx] || isFetching[idx]) return;
      isFetching[idx] = 1;

      try {
        const url = getFrameUrl(idx);

        if ('createImageBitmap' in window) {
          const resp = await fetch(url);
          const blob = await resp.blob();
          if (isCancelled) return;
          const bitmap = await createImageBitmap(blob);
          if (isCancelled) {
            bitmap.close?.();
            return;
          }
          frames[idx] = bitmap;
          isLoaded[idx] = 1;
        } else {
          const img = new Image();
          img.src = url;
          await img.decode();
          if (isCancelled) return;
          frames[idx] = img;
          isLoaded[idx] = 1;
        }

        // If this newly loaded frame is closer to current scroll target than lastDrawn, redraw immediately
        const currentTarget = Math.round(1 + currentProgress * (TOTAL_FRAMES - 1));
        if (Math.abs(currentTarget - idx) < Math.abs(currentTarget - lastDrawnIndex)) {
          drawFrame(currentTarget);
        }
      } catch {
        // Fallback: mark as attempted
      } finally {
        isFetching[idx] = 0;
      }
    };

    // Smart priority chunk preloader
    const preloadSequence = async () => {
      // Step 1: Preload & display frame 1 immediately
      await loadFrame(1);
      resizeCanvas();
      drawFrame(1, true);

      // Step 2: Preload initial hero scroll range (frames 2 to 30) sequentially with top priority
      for (let i = 2; i <= 30; i++) {
        if (isCancelled) return;
        await loadFrame(i);
      }

      // Step 3: Progressive background preloading with concurrency
      const remainingIndices: number[] = [];
      // Every 3rd frame first to guarantee a smooth scrub across the whole page immediately
      for (let i = 33; i <= TOTAL_FRAMES; i += 3) remainingIndices.push(i);
      // Then all intermediate frames to achieve full 30fps fluidity
      for (let i = 31; i <= TOTAL_FRAMES; i++) {
        if (i % 3 !== 0) remainingIndices.push(i);
      }

      const concurrent = 6;
      let qIndex = 0;

      const worker = async () => {
        while (!isCancelled && qIndex < remainingIndices.length) {
          const idx = remainingIndices[qIndex++];
          await loadFrame(idx);
        }
      };

      await Promise.all(Array.from({ length: concurrent }, () => worker()));
    };

    preloadSequence();

    // Scroll progress calculation
    const updateScrollProgress = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollY = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const maxScroll = Math.max(1, scrollHeight - window.innerHeight);

      targetProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('wheel', updateScrollProgress, { passive: true });

    // Buttery-smooth animation loop using delta-time based smoothing
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const delta = targetProgress - currentProgress;
      if (Math.abs(delta) > 0.00005) {
        // Frame-rate independent smooth lerp factor (~14 per sec)
        currentProgress += delta * (1 - Math.exp(-14 * dt));
      } else {
        currentProgress = targetProgress;
      }

      const frameNumber = 1 + currentProgress * (TOTAL_FRAMES - 1);
      drawFrame(frameNumber);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    resizeCanvas();
    updateScrollProgress();
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('wheel', updateScrollProgress);
      cancelAnimationFrame(animationFrameId);

      // Clean up ImageBitmap memory
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const f = frames[i];
        if (f && 'close' in f && typeof (f as ImageBitmap).close === 'function') {
          (f as ImageBitmap).close();
        }
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-black ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover will-change-transform"
      />
    </div>
  );
};

export default ScrollAnimation;
