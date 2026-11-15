import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { COVERAGE_PACKAGES } from '../data/portfolio';
import { WeddingFrame } from '../types/portfolio';

interface BookingModalProps {
  isOpen: boolean;
  initialPackage?: string;
  initialNote?: string;
  shortlistedFrames: WeddingFrame[];
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialPackage,
  initialNote,
  shortlistedFrames,
  onClose,
}) => {
  const [coupleNames, setCoupleNames] = useState('');
  const [email, setEmail] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [cityAndVenue, setCityAndVenue] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(
    initialPackage || COVERAGE_PACKAGES[1].name,
  );
  const [storyNotes, setStoryNotes] = useState(initialNote || '');
  const [confirmationRef, setConfirmationRef] = useState<string | null>(null);

  useEffect(() => {
    if (initialPackage) setSelectedPackage(initialPackage);
  }, [initialPackage]);

  useEffect(() => {
    if (initialNote) setStoryNotes(initialNote);
  }, [initialNote]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleNames.trim() || !email.trim() || !weddingDate.trim()) return;
    const refId = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationRef(refId);
  };

  const handleClose = () => {
    setConfirmationRef(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[620px] max-h-[90vh] overflow-y-auto bg-[#171512] border border-[#754C3D]/80 rounded-2xl p-6 sm:p-9 shadow-2xl text-[#F3EBDD]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close booking form"
          className="absolute top-4 right-4 min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-[#B9AD9A] hover:text-[#F3EBDD] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[1.6]" />
        </button>

        {confirmationRef ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#C6A875] text-[#171512] inline-flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-[12px] text-[#C6A875] font-mono tabular-nums font-semibold">
              Inquiry {confirmationRef} Received
            </p>
            <h3
              id="booking-modal-title"
              className="mt-1 font-serif-editorial text-[26px] font-medium tracking-[-0.015em] text-[#F3EBDD]"
            >
              Date Availability Request Logged
            </h3>
            <p className="mt-3 text-[14.5px] text-[#F3EBDD] leading-relaxed max-w-[42ch] mx-auto">
              Thank you, {coupleNames}. Our lead producers in Mumbai &amp; Udaipur will review {weddingDate} ({selectedPackage}) and respond to {email} within 24 hours.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-7 inline-flex items-center justify-center bg-[#C6A875] text-[#171512] rounded-full px-7 py-2.5 text-[13.5px] font-semibold hover:bg-[#D5B988] transition-colors cursor-pointer shadow-lg"
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[12px] tracking-[0.1em] uppercase text-[#C6A875] font-mono font-bold">
              Shaadi-Savan Atelier
            </p>
            <h3
              id="booking-modal-title"
              className="mt-1 font-serif-editorial text-[28px] font-medium tracking-[-0.015em] text-[#F3EBDD]"
            >
              Book a Consultation &amp; Commission
            </h3>
            <p className="mt-1.5 text-[14px] text-[#F3EBDD]/90">
              Share your celebration dates and venue so we can reserve a creative team for your weekend.
            </p>

            {shortlistedFrames.length > 0 && (
              <div className="mt-5 p-3.5 border border-[#754C3D]/60 bg-black/50 rounded-xl flex items-center justify-between gap-3">
                <div className="text-[12.5px] text-[#F3EBDD]">
                  <span className="font-semibold text-[#C6A875]">
                    {shortlistedFrames.length} saved inspiration{' '}
                    {shortlistedFrames.length === 1 ? 'frame' : 'frames'}
                  </span>{' '}
                  attached to your inquiry
                </div>
                <div className="flex -space-x-2 shrink-0">
                  {shortlistedFrames.slice(0, 3).map((frame) => (
                    <img
                      key={frame.id}
                      src={frame.imageUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#C6A875]/40"
                    />
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-names"
                    className="block text-[12px] font-mono font-bold uppercase tracking-wider text-[#C6A875] mb-1.5"
                  >
                    Couple Names *
                  </label>
                  <input
                    id="booking-names"
                    type="text"
                    required
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    placeholder="Ishita &amp; Arjun"
                    className="w-full px-4 py-2.5 text-[14px] bg-[#0D0B0A] border border-[#754C3D]/80 rounded-xl text-[#F3EBDD] placeholder-[#B9AD9A]/60 focus:border-[#C6A875] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-email"
                    className="block text-[12px] font-mono font-bold uppercase tracking-wider text-[#C6A875] mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ishita.arjun@example.com"
                    className="w-full px-4 py-2.5 text-[14px] bg-[#0D0B0A] border border-[#754C3D]/80 rounded-xl text-[#F3EBDD] placeholder-[#B9AD9A]/60 focus:border-[#C6A875] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-[12px] font-mono font-bold uppercase tracking-wider text-[#C6A875] mb-1.5"
                  >
                    Wedding Date(s) *
                  </label>
                  <input
                    id="booking-date"
                    type="text"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    placeholder="e.g. Nov 14–17, 2026"
                    className="w-full px-4 py-2.5 text-[14px] bg-[#0D0B0A] border border-[#754C3D]/80 rounded-xl text-[#F3EBDD] placeholder-[#B9AD9A]/60 focus:border-[#C6A875] focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-venue"
                    className="block text-[12px] font-mono font-bold uppercase tracking-wider text-[#C6A875] mb-1.5"
                  >
                    City &amp; Venue *
                  </label>
                  <input
                    id="booking-venue"
                    type="text"
                    required
                    value={cityAndVenue}
                    onChange={(e) => setCityAndVenue(e.target.value)}
                    placeholder="Udaipur · Oberoi Udaivilas"
                    className="w-full px-4 py-2.5 text-[14px] bg-[#0D0B0A] border border-[#754C3D]/80 rounded-xl text-[#F3EBDD] placeholder-[#B9AD9A]/60 focus:border-[#C6A875] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-package"
                  className="block text-[12px] font-mono font-bold uppercase tracking-wider text-[#C6A875] mb-1.5"
                >
                  Preferred Coverage
                </label>
                <select
                  id="booking-package"
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full px-4 py-2.5 text-[14px] bg-[#0D0B0A] border border-[#754C3D]/80 rounded-xl text-[#F3EBDD] focus:border-[#C6A875] focus:outline-none"
                >
                  {COVERAGE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.name} className="bg-[#171512] text-[#F3EBDD]">
                      {pkg.name} ({pkg.investment})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  className="block text-[12px] font-mono font-bold uppercase tracking-wider text-[#C6A875] mb-1.5"
                >
                  Tell Us About Your Celebration
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={storyNotes}
                  onChange={(e) => setStoryNotes(e.target.value)}
                  placeholder="Number of functions, daytime rituals, or film preferences..."
                  className="w-full px-4 py-2.5 text-[14px] bg-[#0D0B0A] border border-[#754C3D]/80 rounded-xl text-[#F3EBDD] placeholder-[#B9AD9A]/60 focus:border-[#C6A875] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#C6A875] text-[#171512] font-bold hover:bg-[#D5B988] transition-colors cursor-pointer shadow-xl text-[14px] font-mono uppercase tracking-wider"
                >
                  Request Date Availability
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
