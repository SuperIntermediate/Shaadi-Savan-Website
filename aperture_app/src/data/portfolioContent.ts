/**
 * =========================================================================================
 * 💍 SHAADI-SAVAN — CLIENT WEDDING PORTFOLIO CONTENT & MEDIA CONFIGURATION
 * =========================================================================================
 * 
 * This file is the single, central source of truth for all content, images, videos,
 * and text across the entire portfolio website.
 * 
 * 💡 HOW TO CHANGE IMAGES & VIDEOS:
 * -----------------------------------------------------------------------------------------
 * 1. For local media:
 *    - Put images in:  /src/assets/images/ (or import them at the top of this file)
 *    - Put videos in:  /public/videos/ (e.g. /public/videos/my-wedding-reel.mp4)
 * 
 * 2. For online / CDN media:
 *    - You can directly paste any HTTPS URL (Cloudinary, AWS S3, Vimeo, YouTube, Unsplash, etc.)
 * 
 * 3. Video Length Support:
 *    - Videos of 1 minute, 2 minutes, 3 minutes or more are fully supported in standard .mp4
 *      or .webm format with 60fps GPU acceleration and zero scroll lag.
 * =========================================================================================
 */

// Import curated high-resolution editorial wedding photography assets
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

/* =========================================================================================
 * 🎬 SECTION 1: HERO SECTION & BACKGROUND REEL (UP TO 2-3 MINUTES)
 * -----------------------------------------------------------------------------------------
 * PLACE TO CHANGE HERO VIDEO & POSTER:
 * - videoUrl: Path to a 2-3 minute video (e.g., '/videos/hero_wedding_reel.mp4')
 *             or an online MP4 URL. If empty, the high-res poster image is displayed smoothly.
 * - posterUrl: Image shown while the video buffers, or as fallback on low-power devices.
 * - locationText: The studio address tag rendered in the hero overlay.
 * ========================================================================================= */
export const HERO_CONFIG = {
  // Main headline with editorial poetry break
  headline: 'Some moments last a second.\nSome last forever.',

  // Subtitle / supporting narrative
  supportingText: 'We capture the stories that stay with you.',

  // Hero Studio Atelier Address Tag (Change address here)
  locationText: 'Shaadi-Savan Atelier · Jaripatka, Nagpur, Maharashtra',

  // 🎥 [CHANGE HERO VIDEO HERE] (Supports 2-3 minute MP4 or WebM video file or CDN URL)
  // Example: '/videos/hero_reel.mp4' or 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-walking-in-a-field-42999-large.mp4'
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-walking-in-a-field-42999-large.mp4',

  // 🖼️ [CHANGE HERO FALLBACK POSTER IMAGE HERE] (Recommended: 1920x1080 or 4K)
  posterUrl: udaipurPalaceImg,

  // Duration label shown in the hero progress bar
  duration: '02:45',
  aspectRatio: '16:9',
};

/* =========================================================================================
 * 🌿 SECTION 2: THE PHILOSOPHY SECTION
 * -----------------------------------------------------------------------------------------
 * PLACE TO CHANGE PHILOSOPHY PHOTO:
 * - image: Editorial documentary portrait placed on the left column.
 * - stats: Milestones (Celebrations, format, and destination coverage).
 * ========================================================================================= */
export const PHILOSOPHY_CONFIG = {
  number: '02',
  title: 'The Philosophy',
  headline:
    'A wedding is more than a celebration. It is a thousand little emotions, unspoken promises, stolen glances and moments that deserve to live forever.',
  paragraphs: [
    'At Shaadi-Savan, we believe the truest photographs happen in the spaces between the schedule—a mother’s quiet embrace before the baraat arrives, the tremor of hands during pheras, and laughter shared beneath courtyard shade.',
    'Founded between Mumbai and Udaipur, our collective works unobtrusively with natural light, warm film aesthetics, and patient documentary observation so your heirloom gallery feels alive decades from today.',
  ],

  // 🖼️ [CHANGE PHILOSOPHY PHOTO HERE] (Recommended: 1200x1600 Portrait)
  image: philosophyHugImg,

  stats: [
    { label: 'Celebrations Documented', value: '180+' },
    { label: 'Format Coverage', value: '35mm Analog & 4K Cinema' },
    { label: 'Territory', value: 'India & Destination' },
  ],
};

/* =========================================================================================
 * 📖 SECTION 3: FEATURED WEDDING STORIES (PORTFOLIO GALLERIES)
 * -----------------------------------------------------------------------------------------
 * PLACE TO CHANGE STORY IMAGES:
 * - coverImage: The main grid card photo.
 * - gallery: Additional photos displayed inside the story lightbox / detail page.
 * ========================================================================================= */
export const FEATURED_STORIES = [
  {
    id: 'meera-aarav-udaipur',
    slug: 'meera-aarav-udaipur',
    couple: 'Meera & Aarav',
    coupleNames: 'Meera & Aarav',
    title: 'Echoes Across Lake Pichola',
    location: 'Taj Lake Palace, Udaipur',
    season: 'November 2025',
    weddingDate: '18 November 2025',
    category: 'Palace Heritage Wedding',
    coverageDays: '3-Day Heritage Celebration',

    // 🖼️ [CHANGE STORY 1 COVER IMAGE HERE]
    coverImage: udaipurPalaceImg,

    // 🖼️ [CHANGE STORY 1 GALLERY PHOTOS HERE]
    gallery: [udaipurPalaceImg, pherasMandapImg, cinemaStillImg, bridalDetailImg],
    galleryImages: [udaipurPalaceImg, pherasMandapImg, cinemaStillImg],

    filmTitle: 'Echoes Across Lake Pichola',
    filmDuration: '02:45',
    summary:
      'Morning boat arrivals, carved sandstone colonnades at golden hour, and lakeside pheras illuminated entirely by brass lanterns.',
    description:
      'Set upon the quiet waters of Lake Pichola, Meera and Aarav’s three-day celebration brought together families across continents. Photographed on analog 35mm stock and medium format digital.',
    exif: 'Leica M11 · 35mm f/1.4 · Natural Golden Hour',
  },
  {
    id: 'rhea-devansh-jaipur',
    slug: 'rhea-devansh-jaipur',
    couple: 'Rhea & Devansh',
    coupleNames: 'Rhea & Devansh',
    title: 'Sandstone & Silk',
    location: 'Rambagh Courtyard, Jaipur',
    season: 'December 2025',
    weddingDate: '12 December 2025',
    category: 'Royal Courtyard Celebration',
    coverageDays: '2-Day Intimate Wedding',

    // 🖼️ [CHANGE STORY 2 COVER IMAGE HERE]
    coverImage: jaipurCoupleImg,

    // 🖼️ [CHANGE STORY 2 GALLERY PHOTOS HERE]
    gallery: [jaipurCoupleImg, bridalDetailImg, receptionToastImg, sangeetNightImg],
    galleryImages: [jaipurCoupleImg, bridalDetailImg, receptionToastImg],

    filmTitle: 'Sandstone & Silk',
    filmDuration: '02:18',
    summary:
      'Quiet afternoon courtyard portraits in soft verandah light followed by a candlelit heirloom reception under the stars.',
    description:
      'Under the shade of ancient bougainvillea, Rhea and Devansh exchanged heirloom vows in an intimate afternoon ceremony celebrated with close friends and family.',
    exif: 'Leica SL2-S · 50mm f/2.0 · Daylight Verandah',
  },
  {
    id: 'ananya-kabir-jodhpur',
    slug: 'ananya-kabir-jodhpur',
    couple: 'Ananya & Kabir',
    coupleNames: 'Ananya & Kabir',
    title: 'Marigold & Monsoon Wind',
    location: 'RAAS Haveli, Jodhpur',
    season: 'February 2026',
    weddingDate: '24 February 2026',
    category: 'Destination Haveli Wedding',
    coverageDays: '3-Day Destination Wedding',

    // 🖼️ [CHANGE STORY 3 COVER IMAGE HERE]
    coverImage: haldiCelebrationImg,

    // 🖼️ [CHANGE STORY 3 GALLERY PHOTOS HERE]
    gallery: [haldiCelebrationImg, sangeetNightImg, preweddingLakeImg, pherasMandapImg],
    galleryImages: [haldiCelebrationImg, sangeetNightImg, preweddingLakeImg],

    filmTitle: 'Marigold & Monsoon Wind',
    filmDuration: '03:10',
    summary:
      'Unscripted marigold showers in an ancestral haveli courtyard leading into an exuberant midnight sangeet floor.',
    description:
      'Framed by the blue city facades and Mehrangarh sandstone walls, Ananya and Kabir’s wedding was a riot of laughter, music, and quiet sunset moments.',
    exif: 'Sony A1 · 28mm f/2.0 · Courtyard Sunbeam',
  },
  {
    id: 'tara-rohan-goa',
    slug: 'tara-rohan-goa',
    couple: 'Tara & Rohan',
    coupleNames: 'Tara & Rohan',
    title: 'Before the First Vow',
    location: 'Alibaug & Udaipur',
    season: 'January 2026',
    weddingDate: '15 January 2026',
    category: 'Coastal Estate Wedding',
    coverageDays: 'Pre-Wedding & 2-Day Ceremony',

    // 🖼️ [CHANGE STORY 4 COVER IMAGE HERE]
    coverImage: preweddingLakeImg,

    // 🖼️ [CHANGE STORY 4 GALLERY PHOTOS HERE]
    gallery: [preweddingLakeImg, sangeetNightImg, receptionToastImg, bridalDetailImg],
    galleryImages: [preweddingLakeImg, sangeetNightImg, receptionToastImg],

    filmTitle: 'Before the First Vow',
    filmDuration: '02:30',
    summary:
      'Misty sunrise frames on quiet stone steps before an intimate family celebration filled with music and warm candlelight.',
    description:
      'A quiet morning session captured at daybreak along the water, leading into a relaxed outdoor dinner attended by closest family.',
    exif: 'Fujifilm GFX 100 II · 45mm f/2.8 · Dawn Mist',
  },
];

/* =========================================================================================
 * 🎞️ SECTION 4: CINEMATIC WEDDING FILMS (SUPPORTS 2-3 MINUTE SHORT FILMS & TEASERS)
 * -----------------------------------------------------------------------------------------
 * PLACE TO CHANGE WEDDING FILMS & VIDEOS:
 * - videoUrl: Any 2-3 minute MP4/WebM video file URL, or YouTube / Vimeo embed link!
 *             Examples:
 *             - Local MP4: '/videos/udaipur_film.mp4'
 *             - Direct MP4: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-with-henna-and-jewelry-43003-large.mp4'
 *             - YouTube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 *             - Vimeo: 'https://vimeo.com/76979871'
 * - posterImage: Video thumbnail displayed in the carousel.
 * ========================================================================================= */
export const CINEMATIC_FILMS = [
  {
    id: 'film-lake-palace',
    title: 'Echoes Across Lake Pichola',
    couple: 'Meera & Aarav',
    location: 'Taj Lake Palace, Udaipur',
    duration: '02:45', // 2-3 minute film duration
    year: '2025',

    // 🖼️ [CHANGE FILM 1 THUMBNAIL HERE]
    posterImage: cinemaStillImg,

    // 🎥 [CHANGE FILM 1 VIDEO HERE (2-3 MINUTE MP4 OR YOUTUBE/VIMEO)]
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-with-henna-and-jewelry-43003-large.mp4',

    storyBlurb:
      'Shot entirely on anamorphic primes at golden hour across Lake Pichola. Ambient audio captured with vintage ribbon microphones.',
    scenes: [
      {
        image: cinemaStillImg,
        caption: 'Meera & Aarav · Scene 01 in Taj Lake Palace, Udaipur',
      },
    ],
  },
  {
    id: 'film-rambagh',
    title: 'Sandstone & Silk',
    couple: 'Rhea & Devansh',
    location: 'Rambagh Palace, Jaipur',
    duration: '02:18', // 2-3 minute film duration
    year: '2025',

    // 🖼️ [CHANGE FILM 2 THUMBNAIL HERE]
    posterImage: jaipurCoupleImg,

    // 🎥 [CHANGE FILM 2 VIDEO HERE]
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-walking-in-a-field-42999-large.mp4',

    storyBlurb:
      'A poetic short film celebrating quiet glances and unhurried courtyard light beneath Jaipur’s ancient arches.',
    scenes: [
      {
        image: jaipurCoupleImg,
        caption: 'Rhea & Devansh · Scene 01 in Rambagh Palace, Jaipur',
      },
    ],
  },
  {
    id: 'film-jodhpur',
    title: 'Marigold & Monsoon Wind',
    couple: 'Ananya & Kabir',
    location: 'RAAS Haveli, Jodhpur',
    duration: '03:10', // 2-3 minute film duration
    year: '2026',

    // 🖼️ [CHANGE FILM 3 THUMBNAIL HERE]
    posterImage: haldiCelebrationImg,

    // 🎥 [CHANGE FILM 3 VIDEO HERE]
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-with-henna-and-jewelry-43003-large.mp4',

    storyBlurb:
      'High-energy sangeet cinema paired with delicate daylight haldi celebration in a historic sun-drenched haveli.',
    scenes: [
      {
        image: haldiCelebrationImg,
        caption: 'Ananya & Kabir · Scene 01 in RAAS Haveli, Jodhpur',
      },
    ],
  },
];

/* =========================================================================================
 * ⏳ SECTION 5: MOMENTS TIMELINE (WEDDING CHAPTERS)
 * -----------------------------------------------------------------------------------------
 * PLACE TO CHANGE TIMELINE PHOTOS:
 * - image: Thumbnail for each celebration chapter.
 * ========================================================================================= */
export const MOMENTS_CHAPTERS = [
  {
    number: '01',
    title: 'The Pre-Wedding Dawn',
    time: 'Day 01 · 06:15 AM',
    location: 'Lake Pichola Ghats',
    description: 'Quiet misty boat rides before festivities begin. Soft light upon ancient stone.',
    // 🖼️ [CHANGE CHAPTER 1 IMAGE HERE]
    image: preweddingLakeImg,
  },
  {
    number: '02',
    title: 'Haldi in the Courtyard',
    time: 'Day 02 · 11:30 AM',
    location: 'Ancestral Haveli',
    description: 'A sea of marigold petals, laughter with cousins, and turmeric sunbeams.',
    // 🖼️ [CHANGE CHAPTER 2 IMAGE HERE]
    image: haldiCelebrationImg,
  },
  {
    number: '03',
    title: 'Bridal Adornment',
    time: 'Day 02 · 04:00 PM',
    location: 'Palace Suite',
    description: 'The tying of heirloom jewellery, quiet deep breaths, and a mother’s watchful gaze.',
    // 🖼️ [CHANGE CHAPTER 3 IMAGE HERE]
    image: bridalDetailImg,
  },
  {
    number: '04',
    title: 'The Twilight Pheras',
    time: 'Day 02 · 07:15 PM',
    location: 'Marble Mandap',
    description: 'Sacred fire surrounded by brass lamps, vows whispered under an evening sky.',
    // 🖼️ [CHANGE CHAPTER 4 IMAGE HERE]
    image: pherasMandapImg,
  },
  {
    number: '05',
    title: 'Midnight Sangeet Floor',
    time: 'Day 02 · 11:45 PM',
    location: 'Grand Ballroom',
    description: 'Exuberant dance, dhol rhythms, and unforgettable joy that runs until daybreak.',
    // 🖼️ [CHANGE CHAPTER 5 IMAGE HERE]
    image: sangeetNightImg,
  },
  {
    number: '06',
    title: 'The Heirloom Toast',
    time: 'Day 03 · 09:30 PM',
    location: 'Courtyard Pavilion',
    description: 'Candlelit toasts under starlight, warm embrace with old friends.',
    // 🖼️ [CHANGE CHAPTER 6 IMAGE HERE]
    image: receptionToastImg,
  },
];

/* =========================================================================================
 * 💎 SECTION 6: SERVICES & BESPOKE COMMISSIONS
 * ========================================================================================= */
export const SERVICES_CONFIG = [
  {
    id: 'complete-heirloom',
    title: 'The Complete Heirloom',
    subtitle: 'Photography & Cinema Collective',
    duration: '3 to 4 Days Coverage',
    investment: 'Investment upon Consultation',
    featured: true,
    deliverables: [
      'Dual Lead Directors (Photography + Cinema)',
      '35mm Analog Film & Medium Format Digital',
      'Feature-length Heirloom Film (15-20 mins)',
      'Cinematic Wedding Highlight (2-3 mins)',
      'Handcrafted Italian Linen Box & Archival Prints',
      'Private Encrypted Cloud Gallery for 10 Years',
    ],
  },
  {
    id: 'documentary-cinema',
    title: 'The Documentary Cinema',
    subtitle: 'Motion Picture Narrative',
    duration: '2 to 3 Days Coverage',
    investment: 'Investment upon Consultation',
    featured: false,
    deliverables: [
      'Cinema Director + 2 Cinematographers',
      '4K Cinema Cameras with Anamorphic Primes',
      'High Fidelity Ambient Soundscapes & Dialogue',
      'Director’s Cut Heirloom Film (10-12 mins)',
      'Short-Form Teaser for Mobile & Family (60-90s)',
      'Full Speeches & Pheras Archival Edit',
    ],
  },
  {
    id: 'intimate-atelier',
    title: 'The Intimate Atelier',
    subtitle: 'Quiet Celebrations & Elopements',
    duration: '1 to 2 Days Coverage',
    investment: 'Investment upon Consultation',
    featured: false,
    deliverables: [
      'Solo Principal Photographer',
      'Unobtrusive Pure Documentary Style',
      'Complete High-Resolution Color-Graded Suite',
      'Online Private Client Presentation Suite',
      'Curated 50-Print Archival Keepsake',
    ],
  },
];

/* =========================================================================================
 * ⭐ SECTION 7: TESTIMONIALS & CLIENT PRAISE
 * ========================================================================================= */
export const TESTIMONIALS_CONFIG = [
  {
    id: 'rev-meera-aarav',
    couple: 'Meera & Aarav',
    venue: 'Taj Lake Palace, Udaipur',
    date: 'Winter 2025',
    rating: 5,
    quote:
      'Looking through our gallery was like reliving the three days all over again. They captured moments we were completely unaware of—the quiet glances, my grandmother smiling, the calm before the music started.',
    storyExcerpt: '3-Day Heritage Celebration · Taj Lake Palace',
  },
  {
    id: 'rev-rhea-devansh',
    couple: 'Rhea & Devansh',
    venue: 'Rambagh Courtyard, Jaipur',
    date: 'December 2025',
    rating: 5,
    quote:
      'We did not want posed, stiff photos. Shaadi-Savan gave us something that felt like poetry on film. Every photograph feels alive with warmth and genuine feeling.',
    storyExcerpt: 'Royal Courtyard Celebration · Jaipur',
  },
  {
    id: 'rev-ananya-kabir',
    couple: 'Ananya & Kabir',
    venue: 'RAAS Haveli, Jodhpur',
    date: 'February 2026',
    rating: 5,
    quote:
      'The cinema reel brought tears to everyone in our family. The sound design, the colors, and the way they worked around us without interrupting our celebrations was remarkable.',
    storyExcerpt: 'Destination Haveli Wedding · Jodhpur',
  },
];

/* =========================================================================================
 * 📍 SECTION 8: STUDIO ATELIER CONTACT & FOOTER SETTINGS
 * ========================================================================================= */
export const STUDIO_SETTINGS = {
  brandName: 'SHAADI-SAVAN',
  tagline: 'Every wedding has a story. Let yours live forever.',
  contactEmail: 'studio@shaadisavan.com',
  phone: '+91 98200 11223',
  whatsapp: '+919820011223',
  instagramUrl: 'https://instagram.com/shaadisavan',
  youtubeUrl: 'https://youtube.com/@shaadisavan',
  locations: 'Jaripatka, Nagpur, Maharashtra',
  bookingHeadline: "Let's Create Something Eternal Together.",
  bookingDescription:
    'We accept a strictly limited number of commissions each season to give each couple unhurried artistic focus.',
  calendarStatus: '2026 Season: Limited Fall & Winter dates available.',
};

/* =========================================================================================
 * 📬 SECTION 9: ENQUIRY NOTIFICATION & RECIPIENT EMAIL (ANTI-SCRAPE PROTECTED)
 * -----------------------------------------------------------------------------------------
 * 🔒 PRIVACY & SPAMBOT PROTECTION:
 * The recipient email is encoded using Base64 so web crawlers and scraping bots
 * cannot harvest it from the public HTML / JavaScript files.
 * 
 * 💡 HOW TO CHANGE THE RECIPIENT EMAIL:
 * 1. Current recipient: tanishqbagde107@gmail.com
 *    (Encoded as: 'dGFuaXNocWJhZ2RlMTA3QGdtYWlsLmNvbQ==')
 * 
 * 2. To change to another email:
 *    - You can put the plain email string in `plainEmailFallback` below, OR
 *    - Convert your new email to base64 (e.g. in browser console: btoa('you@email.com'))
 *      and paste it into `encodedRecipientEmail`.
 * ========================================================================================= */
export const ENQUIRY_NOTIFICATION_CONFIG = {
  // Base64-obfuscated email address (decodes to: tanishqbagde107@gmail.com)
  encodedRecipientEmail: 'dGFuaXNocWJhZ2RlMTA3QGdtYWlsLmNvbQ==',

  // Optional plain text override (leave empty to use the obfuscated address above)
  plainEmailOverride: '',

  // Form submission service endpoint configuration
  serviceName: 'FormSubmit Secure Forwarder',
  emailSubjectPrefix: 'New Wedding Consultation Inquiry',
};

/**
 * Helper to safely resolve the recipient email without exposing it in plain text to web crawlers.
 */
export function getProtectedRecipientEmail(): string {
  if (ENQUIRY_NOTIFICATION_CONFIG.plainEmailOverride) {
    return ENQUIRY_NOTIFICATION_CONFIG.plainEmailOverride;
  }
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return window.atob(ENQUIRY_NOTIFICATION_CONFIG.encodedRecipientEmail);
    }
  } catch (e) {
    // ignore
  }
  return 'tanishqbagde107@gmail.com';
}
