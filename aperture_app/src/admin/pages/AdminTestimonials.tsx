import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Check,
  Edit2,
  Plus,
  Quote,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

interface Testimonial {
  id: string;
  couple: string;
  venue: string;
  coverage: string;
  quote: string;
  photo: string;
  rating: number;
  isPublished: boolean;
  order: number;
}

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load testimonials' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (test: Testimonial) => {
    setCurrentTestimonial(test);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentTestimonial({
      couple: '',
      venue: '',
      coverage: '3-Day Heritage Commission',
      quote: '',
      photo: '/assets/images/wedding_jaipur_couple_1794571322579.jpg',
      rating: 5,
      isPublished: true,
      order: testimonials.length + 1,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTestimonial.id) {
        await api.admin.updateTestimonial(currentTestimonial.id, currentTestimonial);
        setMessage({ type: 'success', text: 'Testimonial updated successfully' });
      } else {
        await api.admin.createTestimonial(currentTestimonial);
        setMessage({ type: 'success', text: 'New testimonial added' });
      }
      setIsEditing(false);
      setCurrentTestimonial({});
      fetchTestimonials();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save testimonial' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this testimonial?')) return;
    try {
      await api.admin.deleteTestimonial(id);
      setMessage({ type: 'success', text: 'Testimonial deleted' });
      fetchTestimonials();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete testimonial' });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `${currentTestimonial.couple || 'Couple'} Portrait`);
    formData.append('category', 'Portraits');

    try {
      const res = await api.admin.uploadMedia(formData);
      setCurrentTestimonial((prev) => ({ ...prev, photo: res.mediaUrl }));
      setMessage({ type: 'success', text: 'Couple photo uploaded' });
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
            Testimonials & Client Words
          </h1>
          <p className="text-[13px] text-[#B9AD9A] mt-1">
            Genuine words from couples, venue locations, and heirloom coverage stories
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#C6A875] text-[#171512] font-semibold text-[13px] rounded-lg hover:bg-[#d8bc8a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
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

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#B9AD9A]">Loading testimonials...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials
            .sort((a, b) => a.order - b.order)
            .map((test) => (
              <div
                key={test.id}
                className="bg-[#171512] border border-[#30251F] rounded-xl p-5 flex flex-col justify-between hover:border-[#754C3D]/80 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={test.photo}
                        alt={test.couple}
                        className="w-12 h-12 rounded-full object-cover border border-[#C6A875]/40"
                      />
                      <div>
                        <h3 className="font-serif-editorial text-[17px] text-[#F3EBDD] font-medium leading-snug">
                          {test.couple}
                        </h3>
                        <p className="text-[11px] text-[#C6A875] font-mono">{test.venue}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        test.isPublished
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {test.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-3 text-[#C6A875]">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <Star
                        key={starVal}
                        className={`w-3.5 h-3.5 ${
                          starVal <= (test.rating || 5)
                            ? 'fill-[#C6A875] text-[#C6A875]'
                            : 'text-[#30251F]'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-mono text-[#B9AD9A] ml-1.5 font-semibold">
                      {(test.rating || 5)}.0
                    </span>
                  </div>

                  <p className="text-[12.5px] text-[#B9AD9A] mt-3 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#30251F] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#B9AD9A]/70">{test.coverage}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="p-1.5 text-[#B9AD9A] hover:text-[#C6A875] hover:bg-[#30251F] rounded transition-colors"
                      title="Edit Testimonial"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-1.5 text-[#B9AD9A] hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171512] border border-[#754C3D] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#30251F]">
              <h2 className="font-serif-editorial text-2xl text-[#F3EBDD]">
                {currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
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
                    Couple Names
                  </label>
                  <input
                    type="text"
                    required
                    value={currentTestimonial.couple || ''}
                    onChange={(e) =>
                      setCurrentTestimonial((prev) => ({ ...prev, couple: e.target.value }))
                    }
                    placeholder="e.g. Meera & Aarav Singhania"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Wedding Venue / City
                  </label>
                  <input
                    type="text"
                    required
                    value={currentTestimonial.venue || ''}
                    onChange={(e) =>
                      setCurrentTestimonial((prev) => ({ ...prev, venue: e.target.value }))
                    }
                    placeholder="e.g. Taj Lake Palace, Udaipur"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Commission Coverage Type
                  </label>
                  <input
                    type="text"
                    value={currentTestimonial.coverage || ''}
                    onChange={(e) =>
                      setCurrentTestimonial((prev) => ({ ...prev, coverage: e.target.value }))
                    }
                    placeholder="e.g. 3-Day Heritage Commission"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Rating (Stars)
                  </label>
                  <div className="flex items-center gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() =>
                          setCurrentTestimonial((prev) => ({ ...prev, rating: starVal }))
                        }
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          (currentTestimonial.rating || 5) >= starVal
                            ? 'bg-[#30251F] border-[#C6A875] text-[#C6A875]'
                            : 'bg-[#12100E] border-[#30251F] text-[#B9AD9A]/30 hover:text-[#C6A875]'
                        }`}
                        title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            (currentTestimonial.rating || 5) >= starVal
                              ? 'fill-[#C6A875] text-[#C6A875]'
                              : 'text-current'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-mono text-xs text-[#F3EBDD] font-bold ml-1.5">
                      {currentTestimonial.rating || 5} / 5
                    </span>
                  </div>
                  <select
                    value={currentTestimonial.rating || 5}
                    onChange={(e) =>
                      setCurrentTestimonial((prev) => ({ ...prev, rating: parseInt(e.target.value) }))
                    }
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none cursor-pointer"
                  >
                    <option value={5}>5 Stars ★★★★★ (Exceptional)</option>
                    <option value={4}>4 Stars ★★★★☆ (Great)</option>
                    <option value={3}>3 Stars ★★★☆☆ (Good)</option>
                    <option value={2}>2 Stars ★★☆☆☆ (Fair)</option>
                    <option value={1}>1 Star ★☆☆☆☆ (Modest)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Testimonial Quote
                </label>
                <textarea
                  rows={4}
                  required
                  value={currentTestimonial.quote || ''}
                  onChange={(e) =>
                    setCurrentTestimonial((prev) => ({ ...prev, quote: e.target.value }))
                  }
                  placeholder="Share their reflection on the photographs and films..."
                  className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none resize-none"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                  Couple Photo
                </label>
                <div className="flex items-center gap-4">
                  {currentTestimonial.photo && (
                    <img
                      src={currentTestimonial.photo}
                      alt="Couple"
                      className="w-14 h-14 rounded-full object-cover border border-[#30251F]"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={currentTestimonial.photo || ''}
                      onChange={(e) =>
                        setCurrentTestimonial((prev) => ({ ...prev, photo: e.target.value }))
                      }
                      placeholder="/assets/images/... or https://..."
                      className="w-full bg-[#12100E] border border-[#30251F] text-[#F3EBDD] text-[12px] px-3 py-1.5 rounded outline-none font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#30251F] text-[#F3EBDD] text-[11px] font-medium rounded cursor-pointer hover:bg-[#43332a] transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C6A875]" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={currentTestimonial.order || 1}
                    onChange={(e) =>
                      setCurrentTestimonial((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full bg-[#12100E] border border-[#30251F] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#F3EBDD]">
                    <input
                      type="checkbox"
                      checked={currentTestimonial.isPublished ?? true}
                      onChange={(e) =>
                        setCurrentTestimonial((prev) => ({ ...prev, isPublished: e.target.checked }))
                      }
                      className="rounded border-[#30251F] bg-[#12100E] text-[#C6A875] focus:ring-0"
                    />
                    <span>Publish Testimonial</span>
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
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
