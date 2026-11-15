import React, { useEffect, useState } from 'react';
import {
  Compass,
  Upload,
  Save,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Camera,
  Plus,
  Trash2,
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminPhilosophy: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [headline, setHeadline] = useState('');
  const [paragraphs, setParagraphs] = useState<string[]>(['', '']);
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [exif, setExif] = useState('');
  const [stats, setStats] = useState<{ label: string; value: string }[]>([
    { label: 'Celebrations Documented', value: '180+' },
    { label: 'Format Coverage', value: '35mm Analog & 4K Cinema' },
    { label: 'Territory', value: 'India & Destination' },
  ]);

  const fetchPhilosophy = () => {
    setLoading(true);
    api.admin
      .getPhilosophy()
      .then((res: any) => {
        const data = res?.data || res;
        if (data) {
          setHeadline(
            data.headline ||
              'A wedding is more than a celebration. It is a thousand little emotions, unspoken promises, stolen glances and moments that deserve to live forever.'
          );
          if (Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
            setParagraphs(data.paragraphs);
          }
          setPhotoUrl(data.photoUrl || '/assets/images/philosophy_emotional_hug_1794655081817.jpg');
          setCaption(data.caption || 'Unscripted Morning Embrace · Chennai');
          setExif(data.exif || '35mm f/1.4 · Natural Light');
          if (Array.isArray(data.stats) && data.stats.length > 0) {
            setStats(data.stats);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load philosophy data:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhilosophy();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setToast(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `Philosophy Photo - ${file.name.replace(/\.[^/.]+$/, '')}`);
    formData.append('category', 'Weddings');

    try {
      const res: any = await api.admin.uploadMedia(formData);
      const uploadedUrl = res.url || res.data?.url || (typeof res === 'string' ? res : res?.mediaUrl);
      if (uploadedUrl) {
        setPhotoUrl(uploadedUrl);
        setToast({
          type: 'success',
          message: 'Philosophy photo uploaded successfully! Click "Publish Philosophy Changes" to save live.',
        });
      }
    } catch (err: any) {
      setToast({
        type: 'error',
        message: `Upload failed: ${err.message || 'Server error'}`,
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      await api.admin.updatePhilosophy({
        headline,
        paragraphs: paragraphs.filter((p) => p.trim().length > 0),
        photoUrl,
        caption,
        exif,
        stats,
      });

      setToast({
        type: 'success',
        message: 'Philosophy section published and live on website!',
      });
      setTimeout(() => setToast(null), 5000);
    } catch (err: any) {
      setToast({
        type: 'error',
        message: `Save failed: ${err.message || 'Server error'}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleParagraphChange = (index: number, value: string) => {
    const next = [...paragraphs];
    next[index] = value;
    setParagraphs(next);
  };

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const handleRemoveParagraph = (index: number) => {
    if (paragraphs.length <= 1) return;
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: 'label' | 'value', val: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: val };
    setStats(next);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-[#C6A875]">
        <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[13px] tracking-wider uppercase">Loading Philosophy Section...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-[14px] flex items-center justify-between border ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-xs uppercase tracking-wider underline hover:opacity-80 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30251F]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#C6A875]">
            Section 02 · Editorial Heritage
          </span>
          <h2 className="font-serif-editorial text-[30px] font-medium text-[#F3EBDD] mt-0.5">
            Brand Philosophy &amp; Photo
          </h2>
          <p className="text-[13px] text-neutral-400 mt-1">
            Manage your emotional brand manifesto, story narrative, and featured emotional documentary photograph
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13.5px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Publish Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Headline, Paragraphs & Stats */}
        <div className="lg:col-span-7 space-y-6">
          {/* Headline Card */}
          <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#C6A875]">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-serif-editorial text-[18px] text-[#F3EBDD] font-medium">
                Core Brand Headline
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              The grand Cormorant statement displayed in the philosophy section on the homepage.
            </p>
            <textarea
              rows={3}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="A wedding is more than a celebration..."
              className="w-full p-3.5 bg-black/50 border border-[#754C3D]/40 rounded-xl text-white font-serif-editorial text-[18px] leading-relaxed focus:border-[#C6A875] focus:outline-none"
            />
          </div>

          {/* Narrative Paragraphs */}
          <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#C6A875]">
                <Compass className="w-4 h-4" />
                <h3 className="font-serif-editorial text-[18px] text-[#F3EBDD] font-medium">
                  Manifesto Paragraphs
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C6A875]/40 text-[#C6A875] text-xs hover:bg-[#C6A875]/10 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Editorial body text describing your unhurried documentary ethos and approach to family memories.
            </p>

            <div className="space-y-3">
              {paragraphs.map((p, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-center justify-between text-xs text-[#C6A875] mb-1">
                    <span>Paragraph 0{idx + 1}</span>
                    {paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParagraph(idx)}
                        className="text-neutral-500 hover:text-rose-400 p-0.5 cursor-pointer"
                        title="Remove paragraph"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => handleParagraphChange(idx, e.target.value)}
                    className="w-full p-3 bg-black/50 border border-[#754C3D]/40 rounded-xl text-white text-[13.5px] leading-relaxed focus:border-[#C6A875] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 space-y-4">
            <h3 className="font-serif-editorial text-[18px] text-[#F3EBDD] font-medium">
              Section Metadata &amp; Key Accents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.map((st, sIdx) => (
                <div key={sIdx} className="space-y-1.5 bg-black/30 p-3 rounded-lg border border-[#30251F]">
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => handleStatChange(sIdx, 'value', e.target.value)}
                    placeholder="e.g. 180+"
                    className="w-full px-2.5 py-1.5 bg-black/60 border border-[#754C3D]/30 rounded text-xs text-white font-mono focus:border-[#C6A875] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => handleStatChange(sIdx, 'label', e.target.value)}
                    placeholder="Metric Label"
                    className="w-full px-2.5 py-1 bg-transparent border-0 text-[11px] text-[#B9AD9A] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Featured Philosophy Photograph */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#30251F]">
              <div className="flex items-center gap-2 text-[#C6A875]">
                <Camera className="w-4 h-4" />
                <h3 className="font-serif-editorial text-[18px] text-[#F3EBDD] font-medium">
                  Featured Photograph
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#C6A875] bg-[#30251F] px-2.5 py-0.5 rounded">
                Live Preview
              </span>
            </div>

            {/* Photo Visual Preview with Gold Corner Brackets */}
            <div className="relative aspect-[4/3] bg-black/60 rounded-xl overflow-hidden border border-[#754C3D]/50 shadow-2xl">
              <span
                aria-hidden="true"
                className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#C6A875] z-10 pointer-events-none"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#C6A875] z-10 pointer-events-none"
              />

              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={caption || 'Philosophy documentary photograph'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-2">
                  <ImageIcon className="w-10 h-10 opacity-30" />
                  <span className="text-xs">No image selected</span>
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-[#C6A875] z-20">
                  <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-mono tracking-wider uppercase">Uploading Image...</span>
                </div>
              )}
            </div>

            {/* Caption & EXIF Preview Under Image */}
            <div className="flex items-center justify-between text-xs text-[#F3EBDD]/80 px-1">
              <span className="truncate pr-2">{caption || 'Caption preview...'}</span>
              <span className="text-[#C6A875] font-mono shrink-0">{exif || 'Lens EXIF'}</span>
            </div>

            {/* Upload Button & File Selector */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#C6A875] text-[#171512] font-semibold text-[13.5px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-md">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload New Photograph'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {/* Manual URL Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Or Paste Photo URL
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="/assets/images/photo.jpg or https://..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/40 rounded-lg text-white text-[12.5px] font-mono focus:border-[#C6A875] focus:outline-none"
                />
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Editorial Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Unscripted Morning Embrace · Chennai"
                  className="w-full px-3.5 py-2 bg-black/50 border border-[#754C3D]/40 rounded-lg text-white text-[13px] focus:border-[#C6A875] focus:outline-none"
                />
              </div>

              {/* Lens / Camera EXIF */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Lens &amp; Film Metadata (EXIF)
                </label>
                <input
                  type="text"
                  value={exif}
                  onChange={(e) => setExif(e.target.value)}
                  placeholder="e.g. 35mm f/1.4 · Natural Light"
                  className="w-full px-3.5 py-2 bg-black/50 border border-[#754C3D]/40 rounded-lg text-white text-[13px] focus:border-[#C6A875] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPhilosophy;
