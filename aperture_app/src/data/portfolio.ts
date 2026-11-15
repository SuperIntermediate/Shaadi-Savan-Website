import {
  ClientTestimonial,
  CoveragePackage,
  StoryChapter,
  WeddingFrame,
} from '../types/portfolio';

import udaipurPalaceImg from '../assets/images/wedding_udaipur_palace_1794571321843.jpg';
import haldiCelebrationImg from '../assets/images/wedding_haldi_celebration_1794571322283.jpg';
import jaipurCoupleImg from '../assets/images/wedding_jaipur_couple_1794571322579.jpg';
import sangeetNightImg from '../assets/images/wedding_sangeet_night_1794571324278.jpg';
import bridalDetailImg from '../assets/images/wedding_bridal_detail_1794571323084.jpg';
import pherasMandapImg from '../assets/images/wedding_pheras_mandap_1794571324735.jpg';

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'Weddings',
    index: '01',
    title: 'Royal Heritage Ceremonies',
    locationAndDays: 'Udaipur · 3-Day Coverage',
    summary:
      'Palace courtyards, golden-hour baraats, and unscripted pheras documented on 35mm primes.',
    coverImage: udaipurPalaceImg,
  },
  {
    id: 'Haldi & Mehendi',
    index: '02',
    title: 'Sunlit Morning Rituals',
    locationAndDays: 'Jodhpur · Daylight Series',
    summary:
      'Marigold showers, hand-painted henna details, and warm family laughter in natural light.',
    coverImage: haldiCelebrationImg,
  },
  {
    id: 'Sangeet & Films',
    index: '03',
    title: 'After-Dark Celebrations',
    locationAndDays: 'Jaipur · Stills + 4K Film',
    summary:
      'Lantern-lit sangeet floors and quiet twilight vows captured with minimal, unobtrusive gear.',
    coverImage: sangeetNightImg,
  },
];

export const WEDDING_GALLERY: WeddingFrame[] = [
  {
    id: 'udaipur-archway-walk',
    couple: 'Meera & Aarav',
    title: 'Golden Hour at City Archway',
    category: 'Weddings',
    location: 'Udaipur, Rajasthan',
    season: 'November 2025',
    imageUrl: udaipurPalaceImg,
    caption:
      'A quiet fifteen-minute walk beneath sandstone colonnades right after the varmala, before evening guests gathered.',
    exif: {
      camera: 'Leica M11',
      lens: '35mm Summilux f/1.4',
      exposure: 'f/2.2 · 1/640s · ISO 160',
      filmProfile: 'Warm Sandstone Grain',
    },
  },
  {
    id: 'haldi-marigold-courtyard',
    couple: 'Ananya & Kabir',
    title: 'Marigold Courtyard Haldi',
    category: 'Haldi & Mehendi',
    location: 'Jodhpur, Rajasthan',
    season: 'February 2026',
    imageUrl: haldiCelebrationImg,
    caption:
      'Three generations gathered around the inner haveli courtyard as marigold petals filled the morning sunbeam.',
    exif: {
      camera: 'Sony A1',
      lens: '28mm f/2.0 Prime',
      exposure: 'f/2.8 · 1/1250s · ISO 200',
      filmProfile: 'Daylight Documentary',
    },
  },
  {
    id: 'jaipur-silk-portrait',
    couple: 'Rhea & Devansh',
    title: 'Quiet Courtyard Portrait',
    category: 'Portraits',
    location: 'Jaipur, Rajasthan',
    season: 'December 2025',
    imageUrl: jaipurCoupleImg,
    caption:
      'Unposed directional window light portrait framed just outside the ancestral verandah ahead of the evening pheras.',
    exif: {
      camera: 'Leica SL2-S',
      lens: '50mm APO-Summicron f/2',
      exposure: 'f/2.0 · 1/500s · ISO 100',
      filmProfile: 'Classic Portra Tone',
    },
  },
  {
    id: 'sangeet-fairy-lights',
    couple: 'Tara & Rohan',
    title: 'Under Warm String Lights',
    category: 'Sangeet & Films',
    location: 'Mumbai, Maharashtra',
    season: 'January 2026',
    imageUrl: sangeetNightImg,
    caption:
      'Captured mid-spin during the opening family medley, letting the ambient tungsten lights carry the warmth of the room.',
    exif: {
      camera: 'Sony A7S III',
      lens: '35mm GM f/1.4',
      exposure: 'f/1.8 · 1/250s · ISO 1600',
      filmProfile: 'Tungsten Cinema Lut',
    },
  },
  {
    id: 'bridal-henna-hands',
    couple: 'Kavya & Siddharth',
    title: 'Handloom Silk & Henna',
    category: 'Haldi & Mehendi',
    location: 'Alibaug, Maharashtra',
    season: 'November 2025',
    imageUrl: bridalDetailImg,
    caption:
      'Morning quiet before the bridal entry—heirloom gold bangles resting over handwoven ivory tissue silk.',
    exif: {
      camera: 'Fujifilm GFX 100 II',
      lens: '80mm f/1.7',
      exposure: 'f/2.5 · 1/320s · ISO 250',
      filmProfile: 'Medium Format Soft',
    },
  },
  {
    id: 'twilight-pheras-mandap',
    couple: 'Nandini & Vikram',
    title: 'Sacred Twilight Pheras',
    category: 'Weddings',
    location: 'Udaipur, Rajasthan',
    season: 'December 2025',
    imageUrl: pherasMandapImg,
    caption:
      'Dusk settled over the lakeside mandap as brass lanterns lit the seven circles around the ceremonial fire.',
    exif: {
      camera: 'Leica M11',
      lens: '28mm Elmarit f/2.8',
      exposure: 'f/2.8 · 1/160s · ISO 800',
      filmProfile: 'Twilight Firelight',
    },
  },
];

export const COVERAGE_PACKAGES: CoveragePackage[] = [
  {
    id: 'intimate-ceremonies',
    index: '01',
    name: 'Intimate Ceremonies',
    duration: '1-Day Coverage · Up to 8 Hours',
    investment: '₹1,85,000',
    description:
      'Tailored for court weddings, temple ceremonies, or single-day gatherings centered on authentic family moments.',
    deliverables: [
      '2 Lead Documentary Photographers',
      '450+ Color-Graded High-Res Stills',
      'Private Online Proofing Gallery',
      '72-Hour Sneak Peek Dispatch',
    ],
  },
  {
    id: 'heritage-multi-day',
    index: '02',
    name: 'Heritage Multi-Day',
    duration: '3-Day Coverage · Full Events',
    investment: '₹3,40,000',
    description:
      'Complete storytelling across Haldi, Mehendi, Sangeet, Baraat, and Pheras without rushing a single frame.',
    deliverables: [
      '3 Photographers + 2 Cinema Directors',
      '1,200+ Curated Documentary Stills',
      '8-Minute Editorial Wedding Film (4K)',
      'Hand-Bound Linen Archival Album',
    ],
  },
  {
    id: 'destination-atelier',
    index: '03',
    name: 'Destination Editorial',
    duration: '4-Day Coverage · Global Travel',
    investment: '₹4,90,000',
    description:
      'Dedicated visual atelier traveling anywhere in India or abroad with hybrid digital and 35mm analog film rolls.',
    deliverables: [
      'Full 6-Member Visual & Sound Crew',
      '4 Rolls of 35mm Kodak Portra Film',
      '12-Minute Feature Documentary Film',
      '2 Custom Fine-Art Parent Albums',
    ],
  },
];

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 't1',
    couple: 'Meera & Aarav Kapoor',
    venue: 'Taj Lake Palace, Udaipur',
    quote:
      'We barely noticed a camera near us for three days, yet every glance from our grandparents was preserved with uncanny warmth.',
  },
  {
    id: 't2',
    couple: 'Ananya & Kabir Mehta',
    venue: 'RAAS Haveli, Jodhpur',
    quote:
      'Instead of staged poses, Shaadi-Savan gave us frames that feel exactly like the laughter and chaos we lived that morning.',
  },
  {
    id: 't3',
    couple: 'Rhea & Devansh Nair',
    venue: 'Rambagh Courtyard, Jaipur',
    quote:
      'Looking through our archival album feels like reading a quiet film monograph of our entire weekend.',
  },
];
