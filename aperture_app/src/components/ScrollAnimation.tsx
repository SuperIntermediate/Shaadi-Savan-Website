/**
 * =========================================================================================
 * 🎬 SCROLL ANIMATION — HIGH-PERFORMANCE CINEMATIC WEDDING CANVAS ENGINE
 * =========================================================================================
 * 
 * PERFORMANCE & ZERO-OOM ARCHITECTURE:
 * - Ultra-lightweight LRU sliding-window frame cache (capped at 8-10 frames on mobile,
 *   16-24 on desktop). Completely prevents mobile WebKit Out-Of-Memory (OOM) Jetsam kills.
 * - Explicit ImageBitmap.close() deallocation on eviction to instantly reclaim GPU VRAM.
 * - On-demand predictive preloader with AbortController to cancel stale out-of-view loads.
 * - Hardware composited canvas with adaptive DPR (1.0 on mobile, capped at 1.5 on desktop).
 * - Instant fallback to closest cached frame so the canvas is never blank or flickering.
 * - Frame-rate independent delta-time lerp smoothing.
 * =========================================================================================
 */

import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 300;
const FRAME_DIR = '/wedding_video_frames_30fps';

function getFrameUrl(i: number): string {
  const padded = String(i).padStart(6, '0');
  return `${FRAME_DIR}/frame_${padded}.jpg`;
}

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth < 768 ||
    (typeof navigator !== 'undefined' &&
      (navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0))
  );
}

interface ScrollAnimationProps {
  className?: string;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = isMobileDevice();
    const MAX_CACHE_SIZE = isMobile ? 8 : 16;
    const PRELOAD_RADIUS = isMobile ? 3 : 8;
    const MAX_CONCURRENT = isMobile ? 2 : 4;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    // LRU Frame Cache & In-Flight Tracking
    const frameCache = new Map<number, ImageBitmap | HTMLImageElement>();
    const pendingFetches = new Map<number, AbortController>();
    let activeFetchesCount = 0;
    const fetchQueue: number[] = [];

    let lastDrawnIndex = -1;
    let currentProgress = 0;
    let targetProgress = 0;
    let animationFrameId: number;
    let isCancelled = false;

    // Find closest frame present in cache (instant O(k) lookup, k <= 16)
    const findClosestLoaded = (target: number): number => {
      if (frameCache.has(target)) return target;
      let closestDist = Infinity;
      let closestIdx = -1;
      for (const idx of frameCache.keys()) {
        const dist = Math.abs(idx - target);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      }
      return closestIdx;
    };

    // Evict the frame furthest from current scroll position
    const evictFurthestFrame = (currentTarget: number) => {
      if (frameCache.size <= MAX_CACHE_SIZE) return;
      let furthestDist = -1;
      let furthestIdx = -1;

      for (const idx of frameCache.keys()) {
        const dist = Math.abs(idx - currentTarget);
        if (dist > furthestDist) {
          furthestDist = dist;
          furthestIdx = idx;
        }
      }

      if (furthestIdx !== -1) {
        const frame = frameCache.get(furthestIdx);
        if (frame && 'close' in frame && typeof (frame as ImageBitmap).close === 'function') {
          (frame as ImageBitmap).close();
        }
        frameCache.delete(furthestIdx);
      }
    };

    const resizeCanvas = () => {
      // On mobile screens, 1.0 DPR is razor sharp and saves up to 75% canvas buffer VRAM
      const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
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

      if (!frameCache.has(frameIndex)) {
        const closest = findClosestLoaded(frameIndex);
        if (closest !== -1) {
          frameIndex = closest;
        } else if (!force) {
          return;
        }
      }

      if (frameIndex === lastDrawnIndex && !force) return;

      const img = frameCache.get(frameIndex);
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const imgWidth = 'width' in img ? img.width : (img as HTMLImageElement).naturalWidth;
      const imgHeight = 'height' in img ? img.height : (img as HTMLImageElement).naturalHeight;

      if (!imgWidth || !imgHeight) return;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = cw / ch;

      let dw: number, dh: number, dx: number, dy: number;

      // Cover aspect ratio
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

    // Load a single frame with memory-safe decoding
    const loadFrame = async (idx: number, currentTarget: number): Promise<void> => {
      if (idx < 1 || idx > TOTAL_FRAMES || frameCache.has(idx) || pendingFetches.has(idx)) {
        return;
      }

      const controller = new AbortController();
      pendingFetches.set(idx, controller);

      try {
        const url = getFrameUrl(idx);
        if ('createImageBitmap' in window) {
          const resp = await fetch(url, { signal: controller.signal });
          const blob = await resp.blob();
          if (isCancelled) return;

          let bitmap: ImageBitmap;
          try {
            if (isMobile) {
              // Decode at half resolution (960px width) on mobile: cuts pixel memory by 75%
              bitmap = await createImageBitmap(blob, { resizeWidth: 960, resizeQuality: 'medium' });
            } else {
              bitmap = await createImageBitmap(blob);
            }
          } catch {
            bitmap = await createImageBitmap(blob);
          }

          if (isCancelled) {
            bitmap.close?.();
            return;
          }

          evictFurthestFrame(currentTarget);
          frameCache.set(idx, bitmap);
        } else {
          const img = new Image();
          img.src = url;
          await img.decode();
          if (isCancelled) return;

          evictFurthestFrame(currentTarget);
          frameCache.set(idx, img);
        }

        // If closer to current target than what's drawn, redraw immediately
        const activeTarget = Math.round(1 + currentProgress * (TOTAL_FRAMES - 1));
        if (Math.abs(activeTarget - idx) < Math.abs(activeTarget - lastDrawnIndex)) {
          drawFrame(activeTarget);
        }
      } catch (err: any) {
        // AbortError is expected when scrubbing away from a frame
        if (err?.name !== 'AbortError') {
          // ignore network failure silently
        }
      } finally {
        pendingFetches.delete(idx);
      }
    };

    // Worker pump for throttled concurrency
    const pumpQueue = async (currentTarget: number) => {
      if (isCancelled) return;

      // Abort pending fetches that are too far from the user's current position
      for (const [idx, controller] of pendingFetches.entries()) {
        if (Math.abs(idx - currentTarget) > PRELOAD_RADIUS + 4) {
          controller.abort();
          pendingFetches.delete(idx);
        }
      }

      while (!isCancelled && activeFetchesCount < MAX_CONCURRENT && fetchQueue.length > 0) {
        const nextIdx = fetchQueue.shift();
        if (nextIdx === undefined) break;
        if (frameCache.has(nextIdx) || pendingFetches.has(nextIdx)) continue;

        activeFetchesCount++;
        loadFrame(nextIdx, currentTarget).finally(() => {
          activeFetchesCount--;
          pumpQueue(Math.round(1 + currentProgress * (TOTAL_FRAMES - 1)));
        });
      }
    };

    // Queue frames in prioritized radius around target
    const queueFramesAround = (target: number) => {
      const needed: number[] = [target];
      for (let r = 1; r <= PRELOAD_RADIUS; r++) {
        if (target + r <= TOTAL_FRAMES) needed.push(target + r);
        if (target - r >= 1) needed.push(target - r);
      }

      fetchQueue.length = 0;
      for (const idx of needed) {
        if (!frameCache.has(idx) && !pendingFetches.has(idx)) {
          fetchQueue.push(idx);
        }
      }

      pumpQueue(target);
    };

    // Initial sequence: Display frame 1 immediately
    const init = async () => {
      await loadFrame(1, 1);
      resizeCanvas();
      drawFrame(1, true);
      queueFramesAround(1);
    };

    init();

    // Scroll progress calculation
    const updateScrollProgress = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollY = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const maxScroll = Math.max(1, scrollHeight - window.innerHeight);

      targetProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
      const targetFrame = Math.round(1 + targetProgress * (TOTAL_FRAMES - 1));
      queueFramesAround(targetFrame);
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

      // Abort all in-flight requests
      for (const controller of pendingFetches.values()) {
        controller.abort();
      }
      pendingFetches.clear();

      // Free all ImageBitmap memory
      for (const frame of frameCache.values()) {
        if (frame && 'close' in frame && typeof (frame as ImageBitmap).close === 'function') {
          (frame as ImageBitmap).close();
        }
      }
      frameCache.clear();
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
