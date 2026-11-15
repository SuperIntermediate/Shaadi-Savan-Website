const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('shaadi_admin_token') || '';
}

export function setAuthToken(token: string) {
  if (token) {
    localStorage.setItem('shaadi_admin_token', token);
  } else {
    localStorage.removeItem('shaadi_admin_token');
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  if (Array.isArray(data.data)) {
    const arr: any = data.data;
    arr.success = data.success !== undefined ? data.success : true;
    arr.data = arr;
    if (data.url) arr.url = data.url;
    return arr;
  }

  if (data.data !== undefined && typeof data.data === 'object' && data.data !== null) {
    return {
      success: data.success !== undefined ? data.success : true,
      url: data.url,
      ...data.data,
      data: data.data,
    };
  }

  return data;
}

export const api = {
  // Public APIs
  public: {
    getSettings: () => request('/public/settings'),
    getHero: () => request('/public/hero'),
    getPhilosophy: () => request('/public/philosophy'),
    getStories: () => request('/public/stories'),
    getStoryBySlug: (slug: string) => request(`/public/stories/${slug}`),
    getServices: () => request('/public/services'),
    getChapters: () => request('/public/chapters'),
    getFilms: () => request('/public/films'),
    getTestimonials: () => request('/public/testimonials'),
    submitEnquiry: (payload: any) =>
      request('/public/enquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Auth APIs
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    getMe: () => request('/auth/me'),
    changePassword: (payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) =>
      request('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // Admin APIs
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    uploadMedia: (formData: FormData) =>
      request('/admin/upload', {
        method: 'POST',
        body: formData,
      }),
    // Media Library
    getMedia: () => request('/admin/media'),
    updateMedia: (id: string, payload: any) =>
      request(`/admin/media/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    deleteMedia: (id: string) =>
      request(`/admin/media/${id}`, {
        method: 'DELETE',
      }),

    // Hero Manager
    getHero: () => request('/admin/hero'),
    updateHero: (payload: any) =>
      request('/admin/hero', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),

    // Philosophy
    getPhilosophy: () => request('/admin/philosophy'),
    updatePhilosophy: (payload: any) =>
      request('/admin/philosophy', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),

    // Wedding Stories
    getStories: () => request('/admin/stories'),
    createStory: (payload: any) =>
      request('/admin/stories', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateStory: (id: string, payload: any) =>
      request(`/admin/stories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    deleteStory: (id: string) =>
      request(`/admin/stories/${id}`, {
        method: 'DELETE',
      }),

    // Services
    getServices: () => request('/admin/services'),
    createService: (payload: any) =>
      request('/admin/services', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateService: (id: string, payload: any) =>
      request(`/admin/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    deleteService: (id: string) =>
      request(`/admin/services/${id}`, {
        method: 'DELETE',
      }),

    // Chapters
    getChapters: () => request('/admin/chapters'),
    createChapter: (payload: any) =>
      request('/admin/chapters', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateChapter: (id: string, payload: any) =>
      request(`/admin/chapters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    deleteChapter: (id: string) =>
      request(`/admin/chapters/${id}`, {
        method: 'DELETE',
      }),

    // Films
    getFilms: () => request('/admin/films'),
    createFilm: (payload: any) =>
      request('/admin/films', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateFilm: (id: string, payload: any) =>
      request(`/admin/films/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    deleteFilm: (id: string) =>
      request(`/admin/films/${id}`, {
        method: 'DELETE',
      }),

    // Testimonials
    getTestimonials: () => request('/admin/testimonials'),
    createTestimonial: (payload: any) =>
      request('/admin/testimonials', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateTestimonial: (id: string, payload: any) =>
      request(`/admin/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    deleteTestimonial: (id: string) =>
      request(`/admin/testimonials/${id}`, {
        method: 'DELETE',
      }),

    // Enquiries
    getEnquiries: () => request('/admin/enquiries'),
    updateEnquiry: (id: string, payload: any) =>
      request(`/admin/enquiries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    deleteEnquiry: (id: string) =>
      request(`/admin/enquiries/${id}`, {
        method: 'DELETE',
      }),

    // Settings
    getSettings: () => request('/admin/settings'),
    updateSettings: (payload: any) =>
      request('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
  },
};
