export type GalleryCategory =
  | 'All'
  | 'Weddings'
  | 'Haldi & Mehendi'
  | 'Portraits'
  | 'Sangeet & Films';

export interface WeddingFrame {
  id: string;
  couple: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  location: string;
  season: string;
  imageUrl: string;
  caption: string;
  exif: {
    camera: string;
    lens: string;
    exposure: string;
    filmProfile: string;
  };
}

export interface StoryChapter {
  id: Exclude<GalleryCategory, 'All'>;
  index: string;
  title: string;
  locationAndDays: string;
  summary: string;
  coverImage: string;
}

export interface CoveragePackage {
  id: string;
  index: string;
  name: string;
  duration: string;
  investment: string;
  description: string;
  deliverables: string[];
}

export interface ClientTestimonial {
  id: string;
  couple: string;
  venue: string;
  quote: string;
}
