import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Calendar,
  Check,
  Edit2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

interface WeddingChapter {
  id: string;
  title: string;
  ritual: string;
  timeOfDay: string;
  location: string;
  description: string;
  image: string;
  order: number;
  isPublished: boolean;
}

export const AdminChapters: React.FC = () => {
  const [chapters, setChapters] = useState<WeddingChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Partial<WeddingChapter>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getChapters();
      setChapters(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load chapters' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleEdit = (chapter: WeddingChapter) => {
    setCurrentChapter(chapter);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentChapter({
      title: '',
      ritual: '',
      timeOfDay: '',
      location: '',
      description: '',
      image: '/assets/images/wedding_haldi_celebration_1794571322283.jpg',
      order: chapters.length + 1,
      isPublished: true,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentChapter.id) {
        await api.admin.updateChapter(currentChapter.id, currentChapter);
        setMessage({ type: 'success', text: 'Chapter updated successfully' });
      } else {
        await api.admin.createChapter(currentChapter);
        setMessage({ type: 'success', text: 'New chapter added to timeline' });
      }
      setIsEditing(false);
      setCurrentChapter({});
      fetchChapters();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save chapter' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this wedding chapter?')) return;
    try {
      await api.admin.deleteChapter(id);
      setMessage({ type: 'success', text: 'Chapter deleted' });
      fetchChapters();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete chapter' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `${currentChapter.title || 'Chapter'} Photo`);
    formData.append('category', 'Chapters');

    try {
      const res = await api.admin.uploadMedia(formData);
      setCurrentChapter((prev) => ({ ...prev, image: res.mediaUrl }));
      setMessage({ type: 'success', text: 'Chapter visual uploaded' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Upload failed' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#30251F]">
        <div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#F3EBDD] font-medium">
            Wedding Chapters Timeline
          </h1>
          <p className="text-[13px] text-[#B9AD9A] mt-1">
            Curate the 5 Indian ceremonial milestones (Haldi, Mehendi, Sangeet, Ceremony, Reception)
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#C6A875] text-[#171512] font-semibold text-[13px] rounded-lg hover:bg-[#d8bc8a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-[13px] flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-sm font-bold opacity-75 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Chapters Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#B9AD9A]">Loading chapters timeline...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chapters
            .sort((a, b) => a.order - b.order)
            .map((chapter) => (
              <div
                key={chapter.id}
                className="bg-[#171512] border border-[#30251F] rounded-xl overflow-hidden flex flex-col group hover:border-[#754C3D]/80 transition-all shadow-md"
              >
                <div className="relative aspect-[16/10] bg-[#12100E] overflow-hidden">
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/75 border border-white/20 backdrop-blur-none rounded text-[11px] font-mono text-[#C6A875]">
                    0{chapter.order} · {chapter.timeOfDay}
                  </div>
                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      chapter.isPublished
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {chapter.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-editorial text-[20px] text-[#F3EBDD] font-medium leading-snug">
                      {chapter.title}
                    </h3>
                    <p className="text-[12px] text-[#C6A875] tracking-wide mt-0.5 font-medium">
                      {chapter.ritual}
                    </p>
                    <p className="text-[12px] text-[#B9AD9A] mt-2 line-clamp-3 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#30251F] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#B9AD9A]/80">
                      Loc: {chapter.location}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(chapter)}
                        className="p-1.5 text-[#B9AD9A] hover:text-[#C6A875] hover:bg-[#30251F] rounded transition-colors"
                        title="Edit Chapter"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(chapter.id)}
                        className="p-1.5 text-[#B9AD9A] hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Chapter Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171512] border border-[#754C3D] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#30251F]">
              <h2 className="font-serif-editorial text-2xl text-[#F3EBDD]">
                {currentChapter.id ? 'Edit Wedding Chapter' : 'New Wedding Chapter'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#B9AD9A] hover:text-[#F3EBDD] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    required
                    value={currentChapter.title || ''}
                    onChange={(e) =>
                      setCurrentChapter((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Morning Haldi"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Ritual Essence
                  </label>
                  <input
                    type="text"
                    required
                    value={currentChapter.ritual || ''}
                    onChange={(e) =>
                      setCurrentChapter((prev) => ({ ...prev, ritual: e.target.value }))
                    }
                    placeholder="e.g. Auspicious Turmeric Blessings"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Time & Atmosphere
                  </label>
                  <input
                    type="text"
                    value={currentChapter.timeOfDay || ''}
                    onChange={(e) =>
                      setCurrentChapter((prev) => ({ ...prev, timeOfDay: e.target.value }))
                    }
                    placeholder="e.g. 09:30 AM · Sunlight Courtyard"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Setting / Location
                  </label>
                  <input
                    type="text"
                    value={currentChapter.location || ''}
                    onChange={(e) =>
                      setCurrentChapter((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g. Jaipur & Udaipur Haveli"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Poetic Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={currentChapter.description || ''}
                  onChange={(e) =>
                    setCurrentChapter((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe the mood, sounds, emotions and visual details of this ritual..."
                  className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none resize-none"
                />
              </div>

              {/* Photo Preview & Change */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                  Chapter Visual
                </label>
                <div className="flex items-center gap-4">
                  {currentChapter.image && (
                    <img
                      src={currentChapter.image}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded border border-[#30251F]"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={currentChapter.image || ''}
                      onChange={(e) =>
                        setCurrentChapter((prev) => ({ ...prev, image: e.target.value }))
                      }
                      placeholder="/assets/images/... or https://..."
                      className="w-full bg-[#12100E] border border-[#30251F] text-[#F3EBDD] text-[12px] px-3 py-1.5 rounded outline-none font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#30251F] text-[#F3EBDD] text-[11px] font-medium rounded cursor-pointer hover:bg-[#43332a] transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C6A875]" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Order Index
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={currentChapter.order || 1}
                    onChange={(e) =>
                      setCurrentChapter((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full bg-[#12100E] border border-[#30251F] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#F3EBDD]">
                    <input
                      type="checkbox"
                      checked={currentChapter.isPublished ?? true}
                      onChange={(e) =>
                        setCurrentChapter((prev) => ({ ...prev, isPublished: e.target.checked }))
                      }
                      className="rounded border-[#30251F] bg-[#12100E] text-[#C6A875] focus:ring-0"
                    />
                    <span>Publish on Live Website</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#30251F]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#30251F]/40 hover:bg-[#30251F] text-[#B9AD9A] text-[13px] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A875] hover:bg-[#d8bc8a] text-[#171512] font-semibold text-[13px] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Chapter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
