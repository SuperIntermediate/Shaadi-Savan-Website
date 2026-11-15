/**
 * =========================================================================================
 * 🌐 CLIENT PORTFOLIO DATA SERVICE & API
 * =========================================================================================
 * 
 * Standalone Client Mode:
 * - Directly serves the curated portfolio content from `src/data/portfolioContent.ts`.
 * - Requires ZERO external backend, database, or server dependencies.
 * - Ultra-fast 0ms instantaneous load without loading spinners.
 * - Stores customer enquiries in browser local storage.
 * =========================================================================================
 */

import {
  HERO_CONFIG,
  PHILOSOPHY_CONFIG,
  FEATURED_STORIES,
  CINEMATIC_FILMS,
  SERVICES_CONFIG,
  MOMENTS_CHAPTERS,
  TESTIMONIALS_CONFIG,
  STUDIO_SETTINGS,
} from '../data/portfolioContent';

export const api = {
  // Public Portfolio Content APIs
  public: {
    getSettings: async () => ({
      success: true,
      ...STUDIO_SETTINGS,
      data: STUDIO_SETTINGS,
    }),

    getHero: async () => ({
      success: true,
      ...HERO_CONFIG,
      data: HERO_CONFIG,
    }),

    getPhilosophy: async () => ({
      success: true,
      ...PHILOSOPHY_CONFIG,
      data: PHILOSOPHY_CONFIG,
    }),

    getStories: async () => {
      const arr: any = [...FEATURED_STORIES];
      arr.success = true;
      arr.data = arr;
      return arr;
    },

    getStoryBySlug: async (slug: string) => {
      const story =
        FEATURED_STORIES.find((s) => s.slug === slug || s.id === slug) ||
        FEATURED_STORIES[0];
      return story;
    },

    getServices: async () => {
      const arr: any = [...SERVICES_CONFIG];
      arr.success = true;
      arr.data = arr;
      return arr;
    },

    getChapters: async () => {
      const arr: any = [...MOMENTS_CHAPTERS];
      arr.success = true;
      arr.data = arr;
      return arr;
    },

    getFilms: async () => {
      const arr: any = [...CINEMATIC_FILMS];
      arr.success = true;
      arr.data = arr;
      return arr;
    },

    getTestimonials: async () => {
      const arr: any = [...TESTIMONIALS_CONFIG];
      arr.success = true;
      arr.data = arr;
      return arr;
    },

    // Save consultation inquiries locally without requiring a backend server
    submitEnquiry: async (payload: any) => {
      try {
        const stored = JSON.parse(
          localStorage.getItem('shaadi_client_enquiries') || '[]'
        );
        stored.unshift({
          ...payload,
          id: `SS-${Date.now()}`,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('shaadi_client_enquiries', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage save warning:', err);
      }
      return { success: true, message: 'Enquiry received successfully.' };
    },
  },
};
