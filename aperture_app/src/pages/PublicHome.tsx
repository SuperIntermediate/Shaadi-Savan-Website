import React, { useEffect, useState } from 'react';
import { BookingFooterSection } from '../components/BookingFooterSection';
import { FilmPlayerModal } from '../components/FilmPlayerModal';
import { FilmsSection } from '../components/FilmsSection';
import { HeroSection } from '../components/HeroSection';
import { MomentsTimelineSection } from '../components/MomentsTimelineSection';
import { Navbar } from '../components/Navbar';
import { PhilosophySection } from '../components/PhilosophySection';
import { ScrollAnimation } from '../components/ScrollAnimation';
import { ServicesSection } from '../components/ServicesSection';
import { StoriesSection } from '../components/StoriesSection';
import { StoryLightboxModal } from '../components/StoryLightboxModal';
import { TestimonialsSection } from '../components/TestimonialsSection';
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
import { FeaturedStory, SectionId, WeddingFilm } from '../types/experience';
import { api } from '../services/api';

export const PublicHome: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [activeStory, setActiveStory] = useState<FeaturedStory | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<WeddingFilm>(CINEMATIC_FILMS[0] as any);
  const [playerFilm, setPlayerFilm] = useState<WeddingFilm | null>(null);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  // Instantaneous self-contained portfolio state
  const [heroData, setHeroData] = useState<any>(HERO_CONFIG);
  const [philosophyData, setPhilosophyData] = useState<any>(PHILOSOPHY_CONFIG);
  const [stories, setStories] = useState<any[]>(FEATURED_STORIES);
  const [services, setServices] = useState<any[]>(SERVICES_CONFIG);
  const [chapters, setChapters] = useState<any[]>(MOMENTS_CHAPTERS);
  const [films, setFilms] = useState<any[]>(CINEMATIC_FILMS);
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS_CONFIG);
  const [settingsData, setSettingsData] = useState<any>(STUDIO_SETTINGS);

  useEffect(() => {
    // Force starting from the top on page load/refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    // Fetch all published data from backend API
    const loadPublicContent = async () => {
      try {
        const [
          heroRes,
          philoRes,
          storiesRes,
          servicesRes,
          chaptersRes,
          filmsRes,
          testimonialsRes,
          settingsRes,
        ] = await Promise.allSettled([
          api.public.getHero(),
          api.public.getPhilosophy(),
          api.public.getStories(),
          api.public.getServices(),
          api.public.getChapters(),
          api.public.getFilms(),
          api.public.getTestimonials(),
          api.public.getSettings(),
        ]);

        if (heroRes.status === 'fulfilled' && heroRes.value) setHeroData(heroRes.value);
        if (philoRes.status === 'fulfilled' && philoRes.value) setPhilosophyData(philoRes.value);
        if (storiesRes.status === 'fulfilled' && Array.isArray(storiesRes.value)) setStories(storiesRes.value);
        if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value)) setServices(servicesRes.value);
        if (chaptersRes.status === 'fulfilled' && Array.isArray(chaptersRes.value)) setChapters(chaptersRes.value);
        if (filmsRes.status === 'fulfilled' && Array.isArray(filmsRes.value) && filmsRes.value.length > 0) {
          setFilms(filmsRes.value);
          const f0 = filmsRes.value[0];
          setSelectedFilm({
            id: f0.id,
            title: f0.title,
            couple: f0.couple,
            location: f0.location || 'India',
            duration: f0.duration || '08:00',
            year: f0.year || '2026',
            posterImage: f0.posterImage || '/assets/images/film_cinema_still_1794655082919.jpg',
            scenes: [
              {
                image: f0.posterImage || '/assets/images/film_cinema_still_1794655082919.jpg',
                caption: `${f0.couple} · Scene 01 in ${f0.location || 'Heritage Venue'}`,
              },
            ],
            storyBlurb: f0.storyBlurb || '',
          });
        }
        if (testimonialsRes.status === 'fulfilled' && Array.isArray(testimonialsRes.value)) setTestimonials(testimonialsRes.value);
        if (settingsRes.status === 'fulfilled' && settingsRes.value) {
          setSettingsData(settingsRes.value);
        }
      } catch (err) {
        console.log('Public content loading completed with fallbacks:', err);
      }
    };

    loadPublicContent();
  }, []);

  useEffect(() => {
    const sectionOrder: SectionId[] = [
      'booking',
      'testimonials',
      'films',
      'moments',
      'services',
      'stories',
      'philosophy',
      'hero',
    ];

    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroBottom = heroEl.offsetTop + heroEl.offsetHeight - 100;
        setIsScrolledPastHero(window.scrollY >= heroBottom);
      }

      const scrollY = window.scrollY + 180;
      for (const id of sectionOrder) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviewStoryFilm = (story: FeaturedStory) => {
    const matchingFilm =
      (films.length > 0
        ? films.find((f) => f.title === story.filmTitle || f.couple === story.couple)
        : null) ||
      WEDDING_FILMS.find(
        (film) => film.title === story.filmTitle || film.couple === story.couple
      ) || {
        id: story.id,
        title: story.filmTitle,
        couple: story.couple,
        location: story.location,
        duration: story.filmDuration,
        year: story.season.split(' ').pop() || '2026',
        posterImage: story.coverImage,
        scenes: story.galleryImages.map((img, i) => ({
          image: img,
          caption: `${story.couple} · Scene 0${i + 1} in ${story.location}`,
        })),
        storyBlurb: story.summary,
      };

    setActiveStory(null);
    setSelectedFilm(matchingFilm);
    setPlayerFilm(matchingFilm);
  };

  const handleInquireWithService = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    handleNavigate('booking');
  };

  return (
    <div className="relative min-h-screen bg-transparent text-[#F3EBDD] flex flex-col font-sans selection:bg-[#C6A875] selection:text-[#171512]">
      {/* 300-Frame Scroll-Based Video Animation Canvas Layer */}
      <ScrollAnimation />

      <Navbar
        activeSection={activeSection}
        isScrolledPastHero={isScrolledPastHero}
        onNavigate={handleNavigate}
      />

      <main className="relative z-10 flex-1 bg-transparent">
        {/* 01. Cinematic Hero with Live Scroll Scrubbing */}
        <HeroSection onNavigate={handleNavigate} heroData={heroData} />

        {/* 02. The Philosophy */}
        <PhilosophySection philosophyData={philosophyData} />

        {/* 03. Featured Stories */}
        <StoriesSection
          stories={stories}
          onOpenStory={setActiveStory}
          onPreviewFilm={handlePreviewStoryFilm}
        />

        {/* 04. What We Capture (Our Artistry) */}
        <ServicesSection
          services={services}
          onSelectService={handleInquireWithService}
        />

        {/* 05. Wedding Chapters (Interactive Journey) */}
        <MomentsTimelineSection chapters={chapters} />

        {/* 06. Cinematic Films (Video Gallery) */}
        <FilmsSection
          films={films}
          selectedFilm={selectedFilm}
          onSelectFilm={setSelectedFilm}
          onLaunchPlayer={setPlayerFilm}
        />

        {/* 07. Testimonials */}
        <TestimonialsSection testimonials={testimonials} />
      </main>

      {/* 08. Booking & Atelier Footer */}
      <BookingFooterSection
        preselectedService={preselectedService}
        onNavigate={handleNavigate}
        settingsData={settingsData}
      />

      {/* Interactive Story Lightbox & Full-Screen Film Player */}
      <StoryLightboxModal
        story={activeStory}
        onClose={() => setActiveStory(null)}
        onPlayFilm={handlePreviewStoryFilm}
        onInquireStory={() => {
          setActiveStory(null);
          handleInquireWithService('Wedding Photography');
        }}
      />

      <FilmPlayerModal
        film={playerFilm}
        onClose={() => setPlayerFilm(null)}
        onInquireFilm={() => {
          setPlayerFilm(null);
          handleInquireWithService('Cinematic Wedding Films');
        }}
      />
    </div>
  );
};
export default PublicHome;
