import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Sparkles,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface ConsultationSettings {
  contactEmail: string;
  phone: string;
  whatsapp: string;
  locations: string;
  bookingHeadline?: string;
  bookingDescription?: string;
  calendarStatus?: string;
}

export const AdminConsultations: React.FC = () => {
  const [data, setData] = useState<ConsultationSettings>({
    contactEmail: 'studio@shaadisavan.com',
    phone: '+91 98200 11223',
    whatsapp: '+919820011223',
    locations: 'Colaba Atelier, Mumbai & Lake Pichola, Udaipur',
    bookingHeadline: "Let's Create Something Eternal Together.",
    bookingDescription:
      'We accept a strictly limited number of commissions each season to give each couple unhurried artistic focus.',
    calendarStatus: '2026 Season: Limited Fall & Winter dates available.',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.admin.getSettings();
        if (res) {
          setData((prev) => ({
            ...prev,
            contactEmail: res.contactEmail || prev.contactEmail,
            phone: res.phone || prev.phone,
            whatsapp: res.whatsapp || prev.whatsapp,
            locations: res.locations || prev.locations,
            bookingHeadline: res.bookingHeadline || prev.bookingHeadline,
            bookingDescription: res.bookingDescription || prev.bookingDescription,
            calendarStatus: res.calendarStatus || prev.calendarStatus,
          }));
        }
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to load consultation settings' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.admin.updateSettings(data);
      setMessage({ type: 'success', text: 'Consultations & Bookings details updated successfully' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  const cleanWhatsappDigits = data.whatsapp.replace(/[^0-9]/g, '');
  const previewWhatsappUrl = `https://wa.me/${cleanWhatsappDigits || '919820011223'}`;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30251F] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-[1.5px] bg-[#C6A875]" />
            <p className="text-[11px] font-mono tracking-wider uppercase text-[#C6A875]">
              Section 08 Management
            </p>
          </div>
          <h1 className="font-serif-editorial text-3xl font-medium text-[#F3EBDD]">
            Consultations &amp; Bookings
          </h1>
          <p className="text-[13.5px] text-[#B9AD9A] mt-1">
            Manage your studio address, enquiry email, phone line, WhatsApp concierge, and calendar availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C6A875] text-[#171512] font-semibold rounded-full hover:bg-[#d5b988] transition-colors cursor-pointer shadow-lg disabled:opacity-50 text-[13.5px]"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-[13px] ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border border-red-800 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-sm font-bold opacity-75 hover:opacity-100 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#B9AD9A]">Loading consultation details...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Card 1: Studio Contact Coordinates & Outpost Locations */}
          <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="font-serif-editorial text-xl text-[#F3EBDD] flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#C6A875]" />
              <span>Studio Address &amp; Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Locations / Address */}
              <div className="md:col-span-2">
                <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold mb-1.5">
                  Studio Atelier Address / Locations
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#C6A875] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="locations"
                    required
                    value={data.locations}
                    onChange={handleChange}
                    placeholder="e.g. Colaba Atelier, Mumbai & Lake Pichola, Udaipur"
                    className="w-full bg-[#0D0B0A] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13.5px] pl-10 pr-4 py-3 rounded-xl outline-none font-medium"
                  />
                </div>
                <p className="text-[11.5px] text-[#B9AD9A] mt-1">
                  Appears next to the map pin icon in the consultation card.
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold mb-1.5">
                  Enquiry Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#C6A875] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    value={data.contactEmail}
                    onChange={handleChange}
                    placeholder="e.g. studio@shaadisavan.com"
                    className="w-full bg-[#0D0B0A] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13.5px] pl-10 pr-4 py-3 rounded-xl outline-none font-medium font-mono"
                  />
                </div>
                <p className="text-[11.5px] text-[#B9AD9A] mt-1">
                  Couples can click this to compose an inquiry email directly.
                </p>
              </div>

              {/* WhatsApp Concierge Number */}
              <div>
                <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold mb-1.5">
                  WhatsApp Concierge Number
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-[#C6A875] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="whatsapp"
                    required
                    value={data.whatsapp}
                    onChange={handleChange}
                    placeholder="e.g. +91 98200 11223"
                    className="w-full bg-[#0D0B0A] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13.5px] pl-10 pr-4 py-3 rounded-xl outline-none font-medium font-mono"
                  />
                </div>
                <p className="text-[11.5px] text-[#B9AD9A] mt-1">
                  Used for direct WhatsApp concierge chat links.
                </p>
              </div>

              {/* Phone Line */}
              <div>
                <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold mb-1.5">
                  Studio Phone Line (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#C6A875] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98200 11223"
                    className="w-full bg-[#0D0B0A] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13.5px] pl-10 pr-4 py-3 rounded-xl outline-none font-medium font-mono"
                  />
                </div>
              </div>

              {/* Calendar / Season Status */}
              <div>
                <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold mb-1.5">
                  Current Calendar / Availability Status
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#C6A875] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="calendarStatus"
                    value={data.calendarStatus || ''}
                    onChange={handleChange}
                    placeholder="e.g. 2026 Season: Limited Fall & Winter dates available."
                    className="w-full bg-[#0D0B0A] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13.5px] pl-10 pr-4 py-3 rounded-xl outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Editorial Headlines & Statement */}
          <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="font-serif-editorial text-xl text-[#F3EBDD] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#C6A875]" />
              <span>Section Editorial Copy</span>
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  name="bookingHeadline"
                  value={data.bookingHeadline || ''}
                  onChange={handleChange}
                  placeholder="e.g. Let's Create Something Eternal Together."
                  className="w-full bg-[#0D0B0A] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[15px] px-4 py-3 rounded-xl outline-none font-serif-editorial"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold mb-1.5">
                  Supporting Statement / Manifesto
                </label>
                <textarea
                  rows={3}
                  name="bookingDescription"
                  value={data.bookingDescription || ''}
                  onChange={handleChange}
                  placeholder="e.g. We accept a strictly limited number of commissions each season to give each couple unhurried artistic focus."
                  className="w-full bg-[#0D0B0A] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13.5px] px-4 py-3 rounded-xl outline-none leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Live Preview */}
          <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-editorial text-xl text-[#F3EBDD] flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-[#C6A875]" />
                <span>Live Website Preview</span>
              </h2>
              <span className="text-[11px] font-mono text-[#C6A875] uppercase tracking-wider">
                08 · Consultations &amp; Bookings
              </span>
            </div>

            <div className="bg-[#171512] border border-[#754C3D]/70 p-6 sm:p-8 rounded-2xl relative shadow-2xl">
              <span
                aria-hidden="true"
                className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#C6A875]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[#C6A875]"
              />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-[1.5px] bg-[#C6A875]" />
                  <p className="text-[12px] tracking-[0.1em] uppercase text-[#C6A875] font-mono font-bold">
                    08 · Consultations &amp; Bookings
                  </p>
                </div>

                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#F3EBDD] font-medium leading-snug">
                  {data.bookingHeadline || "Let's Create Something Eternal Together."}
                </h3>

                <p className="text-[14px] text-[#F3EBDD] leading-relaxed max-w-xl">
                  {data.bookingDescription ||
                    'We accept a strictly limited number of commissions each season to give each couple unhurried artistic focus.'}
                </p>

                {/* Contact Pill Badges */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-[#F3EBDD] text-[13.5px]">
                    <div className="w-7 h-7 rounded-lg bg-[#30251F] border border-[#C6A875]/40 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#C6A875]" />
                    </div>
                    <span>{data.locations || 'Colaba Atelier, Mumbai & Lake Pichola, Udaipur'}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-[#F3EBDD] text-[13.5px]">
                    <div className="w-7 h-7 rounded-lg bg-[#30251F] border border-[#C6A875]/40 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-[#C6A875]" />
                    </div>
                    <span>{data.contactEmail || 'studio@shaadisavan.com'}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-[#F3EBDD] text-[13.5px]">
                    <div className="w-7 h-7 rounded-lg bg-[#30251F] border border-[#C6A875]/40 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-3.5 h-3.5 text-[#C6A875]" />
                    </div>
                    <span className="text-[#C6A875] font-semibold">
                      Direct WhatsApp Concierge ({data.whatsapp || '+91 98200 11223'})
                    </span>
                  </div>
                </div>

                {/* Calendar Status */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#30251F]/80 border border-[#C6A875]/50">
                  <p className="text-[11px] font-mono tracking-wider uppercase text-[#C6A875] font-bold">
                    Current Calendar Status
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#F3EBDD] font-medium">
                    {data.calendarStatus || '2026 Season: Limited Fall & Winter dates available.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#C6A875] text-[#171512] font-bold rounded-full hover:bg-[#d5b988] transition-colors cursor-pointer shadow-xl disabled:opacity-50 text-[14px]"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save & Publish to Website'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminConsultations;
