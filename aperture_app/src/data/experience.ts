import {
  AgencyService,
  CoupleTestimonial,
  FeaturedStory,
  WeddingFilm,
  WeddingMoment,
} from '../types/experience';

import udaipurPalaceImg from '../assets/images/wedding_udaipur_palace_1794571321843.jpg';
import haldiCelebrationImg from '../assets/images/wedding_haldi_celebration_1794571322283.jpg';
import jaipurCoupleImg from '../assets/images/wedding_jaipur_couple_1794571322579.jpg';
import sangeetNightImg from '../assets/images/wedding_sangeet_night_1794571324278.jpg';
import bridalDetailImg from '../assets/images/wedding_bridal_detail_1794571323084.jpg';
import pherasMandapImg from '../assets/images/wedding_pheras_mandap_1794571324735.jpg';
import philosophyHugImg from '../assets/images/philosophy_emotional_hug_1794655081817.jpg';
import receptionToastImg from '../assets/images/moment_reception_toast_1794655081543.jpg';
import preweddingLakeImg from '../assets/images/story_prewedding_lake_1794655081253.jpg';
import cinemaStillImg from '../assets/images/film_cinema_still_1794655082919.jpg';

export const HERO_REEL_FRAMES = [
  {
    image: cinemaStillImg,
    label: 'Scene 01 · Lantern Corridor, Udaipur',
  },
  {
    image: preweddingLakeImg,
    label: 'Scene 02 · Dawn on Lake Pichola',
  },
  {
    image: udaipurPalaceImg,
    label: 'Scene 03 · Sandstone Archway Walk',
  },
  {
    image: pherasMandapImg,
    label: 'Scene 04 · Sacred Twilight Pheras',
  },
];

export const PHILOSOPHY_IMAGE = philosophyHugImg;

export const FEATURED_STORIES: FeaturedStory[] = [
  {
    id: 'meera-aarav-udaipur',
    couple: 'Meera & Aarav',
    location: 'Taj Lake Palace, Udaipur',
    season: 'November 2025',
    coverageDays: '3-Day Heritage Celebration',
    coverImage: udaipurPalaceImg,
    galleryImages: [udaipurPalaceImg, pherasMandapImg, cinemaStillImg],
    filmTitle: 'Echoes Across Lake Pichola',
    filmDuration: '08:42',
    summary:
      'Morning boat arrivals, carved sandstone colonnades at golden hour, and lakeside pheras illuminated entirely by brass lanterns.',
    exif: 'Leica M11 · 35mm f/1.4 · Natural Golden Hour',
  },
  {
    id: 'rhea-devansh-jaipur',
    couple: 'Rhea & Devansh',
    location: 'Rambagh Courtyard, Jaipur',
    season: 'December 2025',
    coverageDays: '2-Day Intimate Wedding',
    coverImage: jaipurCoupleImg,
    galleryImages: [jaipurCoupleImg, bridalDetailImg, receptionToastImg],
    filmTitle: 'Sandstone & Silk',
    filmDuration: '06:18',
    summary:
      'Quiet afternoon courtyard portraits in soft verandah light followed by a candlelit heirloom reception under the stars.',
    exif: 'Leica SL2-S · 50mm f/2.0 · Daylight Verandah',
  },
  {
    id: 'ananya-kabir-jodhpur',
    couple: 'Ananya & Kabir',
    location: 'RAAS Haveli, Jodhpur',
    season: 'February 2026',
    coverageDays: '3-Day Destination Wedding',
    coverImage: haldiCelebrationImg,
    galleryImages: [haldiCelebrationImg, sangeetNightImg, preweddingLakeImg],
    filmTitle: 'Marigold & Monsoon Wind',
    filmDuration: '07:54',
    summary:
      'Unscripted marigold showers in an ancestral haveli courtyard leading into an exuberant midnight sangeet floor.',
    exif: 'Sony A1 · 28mm f/2.0 · Courtyard Sunbeam',
  },
  {
    id: 'tara-rohan-goa',
    couple: 'Tara & Rohan',
    location: 'Alibaug & Udaipur',
    season: 'January 2026',
    coverageDays: 'Pre-Wedding & 2-Day Ceremony',
    coverImage: preweddingLakeImg,
    galleryImages: [preweddingLakeImg, sangeetNightImg, receptionToastImg],
    filmTitle: 'Before the First Vow',
    filmDuration: '05:30',
    summary:
      'Misty sunrise frames on quiet stone steps before an intimate family celebration filled with music and warm candlelight.',
    exif: 'Fujifilm GFX 100 II · 45mm f/2.8 · Dawn Mist',
  },
];

export const AGENCY_SERVICES: AgencyService[] = [
  {
    id: 'wedding-photography',
    index: '01',
    title: 'Wedding Photography',
    subtitle: 'Full Multi-Day Documentary',
    description:
      'Comprehensive editorial coverage from intimate morning rituals to late-night receptions with calibrated color and archival longevity.',
  },
  {
    id: 'cinematic-wedding-films',
    index: '02',
    title: 'Cinematic Wedding Films',
    subtitle: '4K Documentary & Sound',
    description:
      'Story-driven wedding cinema woven with ambient ceremony audio, spoken vows, and bespoke musical pacing.',
  },
  {
    id: 'pre-wedding-shoots',
    index: '03',
    title: 'Pre-Wedding Shoots',
    subtitle: 'Editorial Couple Sessions',
    description:
      'Unhurried sunrise or dusk sessions in heritage cities, coastal retreats, or meaningful spaces unique to your story.',
  },
  {
    id: 'candid-photography',
    index: '04',
    title: 'Candid Photography',
    subtitle: 'Unposed Human Emotion',
    description:
      'Quiet observation with fast prime lenses—preserving stolen glances, happy tears, and fleeting family laughter without intrusion.',
  },
  {
    id: 'destination-weddings',
    index: '05',
    title: 'Destination Weddings',
    subtitle: 'India & Worldwide Travel',
    description:
      'Self-contained visual crews experienced across Rajasthan palaces, Himalayan estates, Goa coastlines, and European villas.',
  },
  {
    id: 'wedding-albums',
    index: '06',
    title: 'Wedding Albums',
    subtitle: 'Hand-Bound Archival Heirlooms',
    description:
      'Museum-grade cotton rag spreads bound in natural raw linen and debossed in champagne foil to outlast generations.',
  },
];

export const WEDDING_MOMENTS: WeddingMoment[] = [
  {
    id: 'haldi',
    index: '01',
    name: 'Haldi',
    timeOfDay: 'Morning Sun',
    headline: 'Turmeric, Marigolds & Unfiltered Joy',
    description:
      'Laughter echoing across sunlit courtyards as family members shower blessings, yellow petals, and playful chaos under crisp morning light.',
    image: haldiCelebrationImg,
    lensNote: '28mm Wide · 1/1250s · Capturing petals mid-flight',
  },
  {
    id: 'mehendi',
    index: '02',
    name: 'Mehendi',
    timeOfDay: 'Afternoon Shade',
    headline: 'Intricate Henna & Quiet Anticipation',
    description:
      'Soft window shadows falling across heirloom bangles, freshly traced henna motifs, and unhurried conversations with sisters and mothers.',
    image: bridalDetailImg,
    lensNote: '80mm Medium Format · f/2.5 · Tactile detail study',
  },
  {
    id: 'sangeet',
    index: '03',
    name: 'Sangeet',
    timeOfDay: 'Warm Night',
    headline: 'Fairy Lights & Swirling Silk',
    description:
      'Ambient tungsten glow, cheering circles of friends, and kinetic motion frozen at the heart of the dance floor.',
    image: sangeetNightImg,
    lensNote: '35mm f/1.4 · 1/250s · Ambient tungsten floor',
  },
  {
    id: 'ceremony',
    index: '04',
    name: 'Wedding Ceremony',
    timeOfDay: 'Twilight Sacred Fire',
    headline: 'Seven Circles Beneath Brass Lanterns',
    description:
      'Reverent silence punctuated by Vedic chants, glowing firelight on sacred vows, and heartfelt blessings from elders.',
    image: pherasMandapImg,
    lensNote: '28mm Prime · f/2.8 · Warm mandap twilight',
  },
  {
    id: 'reception',
    index: '05',
    name: 'Reception',
    timeOfDay: 'Candlelit Evening',
    headline: 'Toasts, Chandeliers & New Beginnings',
    description:
      'Warm candlelight across crystal tables, heartfelt speeches, and relaxed celebrations long after the formalities conclude.',
    image: receptionToastImg,
    lensNote: '50mm f/1.4 · Warm candlelight grading',
  },
];

export const WEDDING_FILMS: WeddingFilm[] = [
  {
    id: 'film-lantern-corridor',
    title: 'Echoes Across Lake Pichola',
    couple: 'Meera & Aarav',
    location: 'Udaipur, Rajasthan',
    duration: '08:42',
    year: '2025',
    posterImage: cinemaStillImg,
    scenes: [
      {
        image: cinemaStillImg,
        caption: 'Evening procession through diya-lit palace corridors.',
      },
      {
        image: udaipurPalaceImg,
        caption: 'Golden hour walk beneath sandstone arches after varmala.',
      },
      {
        image: pherasMandapImg,
        caption: 'Sacred twilight pheras beside the lakeside mandap.',
      },
    ],
    storyBlurb:
      'Filmed on anamorphic primes over three winter days in Udaipur, pairing live ceremony chants with handwritten letters.',
  },
  {
    id: 'film-dawn-pichola',
    title: 'Before the First Vow',
    couple: 'Tara & Rohan',
    location: 'Lake Pichola & Alibaug',
    duration: '05:30',
    year: '2026',
    posterImage: preweddingLakeImg,
    scenes: [
      {
        image: preweddingLakeImg,
        caption: 'First mist rising off Lake Pichola at 6:15 AM.',
      },
      {
        image: bridalDetailImg,
        caption: 'Quiet bridal preparations in handloom ivory silk.',
      },
      {
        image: receptionToastImg,
        caption: 'Candlelit reception dinner with closest friends.',
      },
    ],
    storyBlurb:
      'An intimate coastal and lakeside portrait film tracing calm morning stillness into an unforgettable evening.',
  },
  {
    id: 'film-sangeet-rhythm',
    title: 'Under Warm String Lights',
    couple: 'Ananya & Kabir',
    location: 'Jodhpur & Mumbai',
    duration: '07:15',
    year: '2026',
    posterImage: sangeetNightImg,
    scenes: [
      {
        image: haldiCelebrationImg,
        caption: 'Marigold petals raining across the morning haveli courtyard.',
      },
      {
        image: sangeetNightImg,
        caption: 'Opening dance under a canopy of warm fairy lights.',
      },
      {
        image: jaipurCoupleImg,
        caption: 'Stillness before the baraat procession began.',
      },
    ],
    storyBlurb:
      'Built around natural room sound—dhol beats, laughter, and unscripted family speeches woven into a rhythmic cut.',
  },
];

export const COUPLE_TESTIMONIALS: CoupleTestimonial[] = [
  {
    id: 'test-1',
    couple: 'Meera & Aarav Kapoor',
    location: 'Taj Lake Palace, Udaipur',
    ceremonyType: '3-Day Destination Wedding',
    quote:
      'We barely noticed a camera near us for three days, yet every tear from our mothers and every quiet laugh between us was preserved with uncanny warmth.',
    image: udaipurPalaceImg,
  },
  {
    id: 'test-2',
    couple: 'Rhea & Devansh Nair',
    location: 'Rambagh Courtyard, Jaipur',
    ceremonyType: 'Intimate Heritage Celebration',
    quote:
      'Opening our linen wedding album feels like reading a timeless cinema monograph. Nothing felt staged—just honest light and real feeling.',
    image: jaipurCoupleImg,
  },
  {
    id: 'test-3',
    couple: 'Ananya & Kabir Mehta',
    location: 'RAAS Haveli, Jodhpur',
    ceremonyType: 'Stills & 4K Wedding Film',
    quote:
      'Our Haldi and Sangeet films brought our grandparents right back into the courtyard. Shaadi-Savan captured the soul of our family.',
    image: receptionToastImg,
  },
];
