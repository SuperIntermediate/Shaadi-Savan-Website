import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Clapperboard,
  Film,
  MapPin,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminHero: React.FC = () => {
  const [hero, setHero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [headline, setHeadline] = useState('');
  const [supportingText, setSupportingText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [framesCount, setFramesCount] = useState(300);
  const [previewFrame, setPreviewFrame] = useState(1);

  const fetchHero = () => {
    api.admin
      .getHero()
      .then((res) => {
        if (res.success && res.data) {
          setHero(res.data);
          setHeadline(res.data.headline || '');
          setSupportingText(res.data.supportingText || '');
          setLocationText(res.data.locationText || res.data.address || 'Shaadi-Savan Atelier · Mumbai & Udaipur');
          setPosterUrl(res.data.posterUrl || '');
          setAspectRatio(res.data.aspectRatio || '16:9');
          setFramesCount(res.data.framesCount || 300);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await api.admin.updateHero({
        headline,
        supportingText,
        locationText,
        posterUrl,
        aspectRatio,
        framesCount: Number(framesCount),
        isPublished: true,
      });

      if (res.success) {
        setHero(res.data);
        setToast('Hero video configuration published successfully!');
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', 'Hero Media');

    try {
      const res = await api.admin.uploadMedia(formData);
      if (res.success && res.url) {
        setPosterUrl(res.url);
        setToast('Media uploaded! Click "Publish Hero Changes" to make it live.');
      }
    } catch (e: any) {
      alert('Upload failed: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-[#C6A875]">
        <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[13px] tracking-wider uppercase">Loading Hero Manager...</p>
      </div>
    );
  }

  const paddedFrame = String(previewFrame).padStart(6, '0');
  const previewFrameUrl = `/wedding_video_frames_30fps/frame_${paddedFrame}.jpg`;

  return (
    <div className="space-y-8 max-w-[1100px]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30251F]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#C6A875]">
            Hero Cinematic Experience
          </span>
          <h2 className="font-serif-editorial text-[30px] font-medium text-[#F3EBDD] mt-0.5">
            Hero Video &amp; Reel Manager
          </h2>
          <p className="text-[13px] text-neutral-400 mt-1">
            Manage the scroll-controlled video reel, poster image, and editorial typography
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13.5px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-lg disabled:opacity-50"
        >
          {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Publish Hero Changes</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-700 text-emerald-200 rounded-xl flex items-center gap-3 text-[14px]">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Video Reel Interactive Scrub Preview */}
      <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clapperboard className="w-5 h-5 text-[#C6A875]" />
            <h3 className="font-semibold text-white text-[16px]">
              Active Hero Reel Scrubbing Preview
            </h3>
          </div>
          <span className="text-[12px] font-mono text-[#C6A875] bg-[#30251F] px-3 py-1 rounded-full border border-[#754C3D]/40">
            Frame {previewFrame} of {framesCount}
          </span>
        </div>

        {/* Video Canvas Container */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-white/15 shadow-inner">
          <img
            src={previewFrameUrl}
            alt="Hero Video Frame"
            className="w-full h-full object-cover"
          />

          {/* Overlay text simulation */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30">
            <div className="max-w-[420px]">
              <h1 className="font-serif-editorial text-[28px] sm:text-[36px] font-medium text-white leading-tight drop-shadow-md">
                {headline || 'Some moments last a second. Some last forever.'}
              </h1>
            </div>
            <div className="max-w-[340px] space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-[#C6A875] font-mono font-medium drop-shadow-sm flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#C6A875] shrink-0" />
                <span>{locationText || 'Shaadi-Savan Atelier · Mumbai & Udaipur'}</span>
              </p>
              <p className="text-[13px] text-[#F3EBDD]/90 drop-shadow-sm">
                {supportingText || 'We capture the stories that stay with you.'}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Frame Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[12px] text-neutral-400">
            <span>Frame 001 (Start)</span>
            <span className="text-[#C6A875] font-mono font-medium">
              Scrub Sequence: Frame {previewFrame}
            </span>
            <span>Frame {framesCount} (End)</span>
          </div>
          <input
            type="range"
            min="1"
            max={framesCount}
            value={previewFrame}
            onChange={(e) => setPreviewFrame(Number(e.target.value))}
            className="w-full accent-[#C6A875] cursor-pointer h-2 bg-neutral-800 rounded-lg"
          />
        </div>
      </div>

      {/* Hero Configuration Form */}
      <form onSubmit={handleSave} className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="font-serif-editorial text-[22px] font-medium text-white pb-3 border-b border-[#30251F]">
          Typography &amp; Hero Content
        </h3>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2 font-medium">
              Main Cormorant Headline
            </label>
            <textarea
              rows={3}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Some moments last a second.&#10;Some last forever."
              className="w-full p-4 rounded-xl bg-black/50 border border-[#754C3D]/60 text-white font-serif-editorial text-[18px] focus:border-[#C6A875] focus:outline-none resize-none"
            />
            <p className="mt-1 text-[11.5px] text-neutral-500">
              Line breaks will render as clean editorial poetry breaks on desktop and mobile.
            </p>
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2 font-medium">
              Supporting Narrative Copy
            </label>
            <input
              type="text"
              value={supportingText}
              onChange={(e) => setSupportingText(e.target.value)}
              placeholder="We capture the stories that stay with you."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-white text-[14px] focus:border-[#C6A875] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2 font-medium flex items-center justify-between">
              <span>Hero Studio Atelier Address &amp; Location Tag</span>
              <span className="text-neutral-500 font-normal lowercase text-[11px]">e.g. Shaadi-Savan Atelier · Mumbai &amp; Udaipur</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#C6A875] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Shaadi-Savan Atelier · Mumbai & Udaipur"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-white text-[14px] focus:border-[#C6A875] focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11.5px] text-neutral-500">
              Displays directly above the supporting narrative copy in the lower-left overlay of the Hero video reel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2 font-medium">
                Sequence Frames Count
              </label>
              <input
                type="number"
                value={framesCount}
                onChange={(e) => setFramesCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-white text-[14px] focus:border-[#C6A875] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2 font-medium">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#754C3D]/60 text-white text-[14px] focus:border-[#C6A875] focus:outline-none"
              >
                <option value="16:9">16:9 Widescreen Cinema</option>
                <option value="2.39:1">2.39:1 Anamorphic</option>
                <option value="4:3">4:3 Medium Format</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#C6A875] mb-2 font-medium">
                Replace Poster / Media
              </label>
              <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#30251F] border border-[#754C3D]/60 text-[#C6A875] hover:bg-[#30251F]/80 text-[13px] font-medium cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload New File</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#C6A875] text-[#171512] font-semibold text-[14px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-xl disabled:opacity-50"
          >
            {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save &amp; Publish Hero</span>
          </button>
        </div>
      </form>
    </div>
  );
};
