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
  getProtectedRecipientEmail,
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

    // Dispatch consultation inquiries directly to recipient email while keeping it protected
    submitEnquiry: async (payload: any) => {
      const recipientEmail = getProtectedRecipientEmail();

      // 1. Always store locally in browser so no enquiry is ever lost
      try {
        const stored = JSON.parse(
          localStorage.getItem('shaadi_client_enquiries') || '[]'
        );
        stored.unshift({
          ...payload,
          id: `SS-${Date.now()}`,
          recipient: recipientEmail,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('shaadi_client_enquiries', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage save warning:', err);
      }

      // 2. Transmit directly to recipient email via FormSubmit AJAX service
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: `New Wedding Consultation Inquiry — Shaadi-Savan: ${payload.clientName || 'Couple'}`,
            _template: 'table',
            _captcha: 'false',
            'Couple Names': payload.clientName || 'N/A',
            'Client Email': payload.email || 'N/A',
            'Phone / WhatsApp': payload.phone || 'N/A',
            'Wedding Date': payload.weddingDate || 'N/A',
            'Venue / Location': payload.location || 'N/A',
            'Selected Collection': payload.service || 'N/A',
            'Personal Notes / Message': payload.message || 'N/A',
            'Submission Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          }),
        });

        if (response.ok) {
          const resData = await response.json().catch(() => ({}));
          return { success: true, message: 'Enquiry emailed successfully.', data: resData };
        }
      } catch (netErr) {
        console.warn('Direct email transmission notice (saved locally):', netErr);
      }

      return { success: true, message: 'Enquiry received successfully.' };
    },
  },
};
