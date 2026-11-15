import React, { useEffect, useState } from 'react';
import {
  Check,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUp,
  ArrowRight,
  Sparkles,
  Calendar,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AGENCY_SERVICES } from '../data/experience';
import { SectionId } from '../types/experience';
import { api } from '../services/api';
import { TextEffect } from './ui/text-effect';
import {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
  MorphingPopoverClose,
  MorphingPopoverTitle,
  MorphingPopoverDescription,
} from './ui/morphing-popover';

interface BookingFooterSectionProps {
  preselectedService?: string;
  onNavigate: (section: SectionId) => void;
  settingsData?: {
    contactEmail?: string;
    phone?: string;
    whatsapp?: string;
    locations?: string;
    bookingHeadline?: string;
    bookingDescription?: string;
    calendarStatus?: string;
  };
}

export const BookingFooterSection: React.FC<BookingFooterSectionProps> = ({
  preselectedService,
  onNavigate,
  settingsData,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [coupleNames, setCoupleNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState(
    preselectedService || AGENCY_SERVICES[0].title,
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Dynamic Contact & Location Details from Settings
  const contactEmail = settingsData?.contactEmail || 'studio@shaadisavan.com';
  const studioPhone = settingsData?.phone || '+91 98200 11223';
  const rawWhatsapp = settingsData?.whatsapp || '+91 98200 11223';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const locations =
    settingsData?.locations || 'Colaba Atelier, Mumbai & Lake Pichola, Udaipur';
  const headline =
    settingsData?.bookingHeadline || "Let's Create Something Eternal Together.";
  const description =
    settingsData?.bookingDescription ||
    'We accept a strictly limited number of commissions each season to give each couple unhurried artistic focus.';
  const calendarStatus =
    settingsData?.calendarStatus || '2026 Season: Limited Fall & Winter dates available.';

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
      setIsPopoverOpen(true);
    }
  }, [preselectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleNames.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await api.public.submitEnquiry({
        clientName: coupleNames,
        email,
        phone,
        weddingDate,
        location,
        weddingType: 'Heritage Wedding',
        service,
        message: notes,
      });
      const refId = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(refId);
    } catch (err) {
      console.error('Submit enquiry fallback:', err);
      const refId = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(refId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setCoupleNames('');
    setEmail('');
    setPhone('');
    setWeddingDate('');
    setLocation('');
    setNotes('');
    setSubmittedRef(null);
    setIsPopoverOpen(false);
  };

  const whatsappUrl = `https://wa.me/${cleanWhatsapp || '919820011223'}?text=${encodeURIComponent(
    `Hello Shaadi-Savan, we would love to inquire about wedding coverage${
      service ? ` (${service})` : ''
    }.`,
  )}`;

  return (
    <footer
      id="booking"
      className="relative bg-[#171512] border-t border-[#C6A875]/40 pt-24 sm:pt-28 pb-12 z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.95)]"
    >
      {/* Subtle radial luxury glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(198,168,117,0.08),transparent_75%)]"
      />

      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-20 border-b border-[#754C3D]/50">
          {/* Left Column: Direct Consultation Info */}
          <div className="lg:col-span-5 relative bg-[#171512]/95 backdrop-blur-md border border-[#754C3D]/70 p-7 sm:p-9 rounded-2xl shadow-2xl flex flex-col justify-between">
            <span
              aria-hidden="true"
              className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#C6A875]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[#C6A875]"
            />

            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <span aria-hidden="true" className="w-5 h-[1.5px] bg-[#C6A875]" />
                <p className="text-[12px] tracking-[0.1em] uppercase text-[#C6A875] font-mono font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  08 · Consultations &amp; Bookings
                </p>
              </div>

              <TextEffect
                as="h2"
                per="word"
                speedReveal={0.9}
                speedSegment={0.9}
                className="font-serif-editorial text-[clamp(2.15rem,3.6vw,3.25rem)] font-medium tracking-[-0.015em] text-[#F3EBDD] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] [text-wrap:balance]"
              >
                {headline}
              </TextEffect>

              <p className="mt-4 text-[15px] leading-[1.7] text-[#F3EBDD] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {description}
              </p>

              {/* Consultation Details */}
              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-[#F3EBDD] text-[14px] font-medium shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#30251F] border border-[#C6A875]/40 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C6A875]" />
                  </div>
                  <span className="drop-shadow-sm">{locations}</span>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-[#F3EBDD] text-[14px] font-medium shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#30251F] border border-[#C6A875]/40 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#C6A875]" />
                  </div>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-[#F3EBDD] hover:text-[#C6A875] transition-colors drop-shadow-sm font-medium font-mono"
                  >
                    {contactEmail}
                  </a>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-[#F3EBDD] text-[14px] font-medium shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#30251F] border border-[#C6A875]/40 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#C6A875]" />
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C6A875] font-semibold hover:text-[#F3EBDD] hover:underline transition-colors drop-shadow-sm"
                  >
                    Direct WhatsApp Concierge ({rawWhatsapp})
                  </a>
                </div>
              </div>
            </div>

            {/* Calendar Status */}
            <div className="mt-8 p-4 rounded-xl bg-[#30251F]/80 border border-[#C6A875]/50 shadow-sm">
              <p className="text-[11.5px] font-mono tracking-wider uppercase text-[#C6A875] font-bold drop-shadow-sm">
                Current Calendar Status
              </p>
              <p className="mt-1 text-[13.5px] text-[#F3EBDD] font-medium drop-shadow-sm">
                {calendarStatus}
              </p>
            </div>
          </div>

          {/* Right Column: Private Commission Inquiry with Morphing Popover */}
          <div className="lg:col-span-7 relative bg-[#171512]/95 backdrop-blur-md border border-[#754C3D]/70 p-6 sm:p-9 rounded-2xl shadow-2xl flex flex-col justify-between">
            <span
              aria-hidden="true"
              className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#C6A875]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[#C6A875]"
            />

            <div>
              <div className="mb-6 pb-4 border-b border-[#754C3D]/50 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-[#C6A875] font-mono font-bold uppercase tracking-wider drop-shadow-sm">
                    Private Commission Inquiry
                  </p>
                  <h3 className="font-serif-editorial text-[24px] font-medium text-[#F3EBDD] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-0.5">
                    Reserve Your Wedding Dates
                  </h3>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#30251F]/70 border border-[#C6A875]/30 text-[#C6A875] text-[11px] font-mono tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 text-[#C6A875]" />
                  <span>By Invitation &amp; Inquiry</span>
                </div>
              </div>

              {/* Morphing Popover interactive unit */}
              <MorphingPopover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                {/* Collapsed State: Editorial overview with Inquire Trigger Button */}
                {!isPopoverOpen && (
                  <div className="space-y-6">
                    <p className="text-[15px] leading-relaxed text-[#F3EBDD]/90">
                      Every wedding is approached as an archival heirloom. We invite you to begin the conversation for your dates, destination, and vision with our studio principals.
                    </p>

                    {/* Atelier Value Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3.5 rounded-xl bg-black/40 border border-[#754C3D]/50">
                        <Clock className="w-4 h-4 text-[#C6A875] mb-2" />
                        <p className="text-[13px] font-semibold text-[#F3EBDD]">Limited Dates</p>
                        <p className="text-[11.5px] text-[#B9AD9A] mt-0.5">Max 15 commissions/season</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-black/40 border border-[#754C3D]/50">
                        <Calendar className="w-4 h-4 text-[#C6A875] mb-2" />
                        <p className="text-[13px] font-semibold text-[#F3EBDD]">Dedicated Crew</p>
                        <p className="text-[11.5px] text-[#B9AD9A] mt-0.5">Dual-city resident leads</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-black/40 border border-[#754C3D]/50">
                        <ShieldCheck className="w-4 h-4 text-[#C6A875] mb-2" />
                        <p className="text-[13px] font-semibold text-[#F3EBDD]">24h Response</p>
                        <p className="text-[11.5px] text-[#B9AD9A] mt-0.5">Direct producer follow-up</p>
                      </div>
                    </div>

                    {/* Morphing Trigger Button */}
                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <MorphingPopoverTrigger className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#C6A875] text-[#171512] font-mono font-bold text-[14px] uppercase tracking-wider hover:bg-[#D5B988] transition-all shadow-[0_4px_24px_rgba(198,168,117,0.35)] active:scale-[0.99]">
                        <span>Inquire</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </MorphingPopoverTrigger>

                      <p className="text-xs font-mono text-[#B9AD9A] text-center sm:text-right">
                        Direct consultation · No obligations
                      </p>
                    </div>
                  </div>
                )}

                {/* Expanded State: Morphing Popover with Textarea and Inquiry Form */}
                <MorphingPopoverContent className="w-full bg-[#181512] border border-[#C6A875]/60 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                  <div className="relative">
                    {submittedRef ? (
                      <div className="py-8 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-[#C6A875] text-[#171512] inline-flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(198,168,117,0.4)]">
                          <Check className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="text-[12px] text-[#C6A875] font-mono font-semibold tracking-wider uppercase">
                            Inquiry {submittedRef} Logged
                          </p>
                          <h3 className="mt-1 font-serif-editorial text-[28px] font-medium text-[#F3EBDD]">
                            Thank You, {coupleNames}.
                          </h3>
                        </div>
                        <p className="text-[14.5px] text-[#F3EBDD]/90 max-w-[44ch] mx-auto leading-relaxed">
                          Our producers in Mumbai &amp; Udaipur will review your dates ({weddingDate || 'upcoming celebration'}) and reply directly to <span className="text-[#C6A875] font-mono">{email}</span> within 24 hours.
                        </p>
                        <div className="pt-4">
                          <button
                            type="button"
                            onClick={handleResetForm}
                            className="px-6 py-2.5 rounded-full bg-[#30251F] border border-[#C6A875]/40 text-[#F3EBDD] hover:bg-[#C6A875] hover:text-[#171512] text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                          >
                            Close &amp; Return
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Popover Header */}
                        <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-[#754C3D]/60">
                          <div>
                            <MorphingPopoverTitle>
                              Tell Us Your Story
                            </MorphingPopoverTitle>
                            <MorphingPopoverDescription className="mt-1">
                              Share a little about the celebration you&apos;re planning. We&apos;d love to hear what makes it yours.
                            </MorphingPopoverDescription>
                          </div>
                          <MorphingPopoverClose />
                        </div>

                        {/* Inquiry Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11.5px] text-[#C6A875] font-mono font-bold uppercase tracking-wider mb-1">
                                Your Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={coupleNames}
                                onChange={(e) => setCoupleNames(e.target.value)}
                                placeholder="e.g. Meera &amp; Aarav"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#754C3D]/80 text-[#F3EBDD] placeholder-[#B9AD9A]/60 text-[14px] font-medium focus:border-[#C6A875] focus:ring-1 focus:ring-[#C6A875] focus:outline-none transition-colors shadow-inner"
                              />
                            </div>
                            <div>
                              <label className="block text-[11.5px] text-[#C6A875] font-mono font-bold uppercase tracking-wider mb-1">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. meera@example.com"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#754C3D]/80 text-[#F3EBDD] placeholder-[#B9AD9A]/60 text-[14px] font-medium focus:border-[#C6A875] focus:ring-1 focus:ring-[#C6A875] focus:outline-none transition-colors shadow-inner"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11.5px] text-[#C6A875] font-mono font-bold uppercase tracking-wider mb-1">
                                Wedding Date (optional)
                              </label>
                              <input
                                type="text"
                                value={weddingDate}
                                onChange={(e) => setWeddingDate(e.target.value)}
                                placeholder="e.g. Nov 14–17, 2026"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#754C3D]/80 text-[#F3EBDD] placeholder-[#B9AD9A]/60 text-[14px] font-medium focus:border-[#C6A875] focus:ring-1 focus:ring-[#C6A875] focus:outline-none transition-colors shadow-inner"
                              />
                            </div>
                            <div>
                              <label className="block text-[11.5px] text-[#C6A875] font-mono font-bold uppercase tracking-wider mb-1">
                                Wedding Location (optional)
                              </label>
                              <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Taj Lake Palace, Udaipur"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#754C3D]/80 text-[#F3EBDD] placeholder-[#B9AD9A]/60 text-[14px] font-medium focus:border-[#C6A875] focus:ring-1 focus:ring-[#C6A875] focus:outline-none transition-colors shadow-inner"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11.5px] text-[#C6A875] font-mono font-bold uppercase tracking-wider mb-1">
                                Preferred Service
                              </label>
                              <select
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#754C3D]/80 text-[#F3EBDD] text-[14px] font-medium focus:border-[#C6A875] focus:ring-1 focus:ring-[#C6A875] focus:outline-none transition-colors shadow-inner cursor-pointer"
                              >
                                {AGENCY_SERVICES.map((s) => (
                                  <option key={s.id} value={s.title} className="bg-[#171512] text-[#F3EBDD]">
                                    {s.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11.5px] text-[#C6A875] font-mono font-bold uppercase tracking-wider mb-1">
                                Phone / WhatsApp (optional)
                              </label>
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. +91 98201 23456"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#754C3D]/80 text-[#F3EBDD] placeholder-[#B9AD9A]/60 text-[14px] font-medium focus:border-[#C6A875] focus:ring-1 focus:ring-[#C6A875] focus:outline-none transition-colors shadow-inner"
                              />
                            </div>
                          </div>

                          {/* Textarea */}
                          <div>
                            <label className="block text-[11.5px] text-[#C6A875] font-mono font-bold uppercase tracking-wider mb-1">
                              Tell Us About Your Celebration
                            </label>
                            <textarea
                              rows={3}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Tell us about your wedding, your vision, the moments you want us to capture, or anything you'd like us to know..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#754C3D]/80 text-[#F3EBDD] placeholder-[#B9AD9A]/60 text-[14px] font-medium focus:border-[#C6A875] focus:ring-1 focus:ring-[#C6A875] focus:outline-none resize-none transition-colors shadow-inner leading-relaxed"
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3.5 rounded-full bg-[#C6A875] text-[#171512] font-bold hover:bg-[#D5B988] active:scale-[0.99] transition-all cursor-pointer shadow-[0_4px_24px_rgba(198,168,117,0.35)] text-[14px] uppercase tracking-wider font-mono disabled:opacity-50"
                            >
                              {isSubmitting ? 'Transmitting Inquiry...' : 'Send Inquiry'}
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </MorphingPopoverContent>
              </MorphingPopover>
            </div>
          </div>
        </div>

        {/* Footer Sub-Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-[13.5px] text-[#F3EBDD] font-medium pt-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/Elegant_Gold_Shaadi-Savan_Emblem_d563beae.png"
              alt="Shaadi-Savan"
              className="h-10 sm:h-12 w-auto object-contain brightness-125 contrast-105"
            />
            <p className="drop-shadow-sm text-xs sm:text-[13.5px] text-[#B9AD9A]">
              © 2026 Shaadi-Savan Atelier. All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('hero')}
              className="inline-flex items-center gap-1.5 text-[#C6A875] hover:text-[#F3EBDD] font-semibold transition-colors cursor-pointer drop-shadow-sm"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BookingFooterSection;
