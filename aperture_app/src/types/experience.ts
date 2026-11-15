export type SectionId =
  | 'hero'
  | 'philosophy'
  | 'stories'
  | 'services'
  | 'moments'
  | 'films'
  | 'testimonials'
  | 'booking'
  | 'portfolio'
  | 'packages'
  | 'home';

export interface FeaturedStory {
  id: string;
  couple: string;
  location: string;
  season: string;
  coverageDays: string;
  coverImage: string;
  galleryImages: string[];
  filmTitle: string;
  filmDuration: string;
  summary: string;
  exif: string;
}

export interface AgencyService {
  id: string;
  index?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  description: string;
  deliverables?: string;
  image?: string;
}

export interface WeddingMoment {
  id: string;
  index?: string;
  name?: string;
  title?: string;
  ritual?: string;
  timeOfDay?: string;
  location?: string;
  headline?: string;
  description?: string;
  image: string;
  caption?: string;
  lensNote?: string;
}

export interface WeddingFilm {
  id: string;
  title: string;
  couple: string;
  location: string;
  duration: string;
  year: string;
  posterImage: string;
  videoUrl?: string;
  rawPoster?: string;
  scenes: {
    image: string;
    caption: string;
  }[];
  storyBlurb: string;
}

export interface CoupleTestimonial {
  id: string;
  couple: string;
  location?: string;
  venue?: string;
  coverage?: string;
  ceremonyType?: string;
  quote: string;
  image?: string;
  photo?: string;
  rating?: number;
}
