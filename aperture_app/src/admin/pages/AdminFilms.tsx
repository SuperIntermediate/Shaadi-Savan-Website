import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Check,
  Edit2,
  Film,
  Play,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';

interface CinematicFilm {
  id: string;
  title: string;
  couple: string;
  location: string;
  year: string;
  duration: string;
  posterImage: string;
  videoUrl: string;
  storyBlurb: string;
  isPublished: boolean;
  order: number;
}

function isVideoFile(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.includes('/uploads/');
}

export const AdminFilms: React.FC = () => {
  const [films, setFilms] = useState<CinematicFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFilm, setCurrentFilm] = useState<Partial<CinematicFilm>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getFilms();
      setFilms(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load films' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const handleEdit = (film: CinematicFilm) => {
    // If the user previously uploaded an MP4 into posterImage, auto-repair it for the editor
    let repairedVideo = film.videoUrl;
    let repairedPoster = film.posterImage;

    if (isVideoFile(film.posterImage) && (!film.videoUrl || film.videoUrl.endsWith('.jpg'))) {
      repairedVideo = film.posterImage;
      repairedPoster = '/assets/images/film_cinema_still_1794655082919.jpg';
    }

    setCurrentFilm({
      ...film,
      videoUrl: repairedVideo,
      posterImage: repairedPoster,
    });
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentFilm({
      title: '',
      couple: '',
      location: '',
      year: new Date().getFullYear().toString(),
      duration: '08:00',
      posterImage: '/assets/images/film_cinema_still_1794655082919.jpg',
      videoUrl: '',
      storyBlurb: '',
      isPublished: true,
      order: films.length + 1,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure video vs poster separation
      let savePayload = { ...currentFilm };
      if (isVideoFile(savePayload.posterImage) && !savePayload.videoUrl) {
        savePayload.videoUrl = savePayload.posterImage;
        savePayload.posterImage = '/assets/images/film_cinema_still_1794655082919.jpg';
      }

      if (currentFilm.id) {
        await api.admin.updateFilm(currentFilm.id, savePayload);
        setMessage({ type: 'success', text: 'Cinematic film updated successfully' });
      } else {
        await api.admin.createFilm(savePayload);
        setMessage({ type: 'success', text: 'New film added to archive' });
      }
      setIsEditing(false);
      setCurrentFilm({});
      fetchFilms();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save film' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this cinematic film?')) return;
    try {
      await api.admin.deleteFilm(id);
      setMessage({ type: 'success', text: 'Film removed from collection' });
      fetchFilms();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete film' });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `${currentFilm.title || 'Film'} Video`);
    formData.append('category', 'Films');

    try {
      const res = await api.admin.uploadMedia(formData);
      const url = res.mediaUrl || res.url;
      setCurrentFilm((prev) => ({ ...prev, videoUrl: url }));
      setMessage({ type: 'success', text: 'Video file uploaded! Preview is ready below.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Upload failed' });
    }
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if user inadvertently selected a video file for the poster
    if (file.type.startsWith('video/')) {
      return handleVideoUpload(e);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `${currentFilm.title || 'Film'} Poster`);
    formData.append('category', 'Films');

    try {
      const res = await api.admin.uploadMedia(formData);
      const url = res.mediaUrl || res.url;
      setCurrentFilm((prev) => ({ ...prev, posterImage: url }));
      setMessage({ type: 'success', text: 'Poster still uploaded' });
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
            Cinematic Films Archive
          </h1>
          <p className="text-[13px] text-[#B9AD9A] mt-1">
            Manage widescreen wedding film releases, video streams (MP4/Vimeo/YouTube), and poster stills
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#C6A875] text-[#171512] font-semibold text-[13px] rounded-lg hover:bg-[#d8bc8a] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Film</span>
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

      {/* Film Archive Cards */}
      {loading ? (
        <div className="p-12 text-center text-[#B9AD9A]">Loading cinematic films...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {films
            .sort((a, b) => a.order - b.order)
            .map((film) => {
              const hasVideo = isVideoFile(film.videoUrl) || isVideoFile(film.posterImage);
              const previewVid = isVideoFile(film.videoUrl) ? film.videoUrl : (isVideoFile(film.posterImage) ? film.posterImage : null);

              return (
                <div
                  key={film.id}
                  className="bg-[#171512] border border-[#30251F] rounded-xl overflow-hidden flex flex-col group hover:border-[#754C3D]/80 transition-all shadow-md"
                >
                  {/* Poster or Video Preview Box */}
                  <div className="relative aspect-[16/9] bg-[#12100E] overflow-hidden">
                    {previewVid ? (
                      <video
                        src={previewVid}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={film.posterImage || '/assets/images/film_cinema_still_1794655082919.jpg'}
                        alt={film.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-white/40 bg-black/40 flex items-center justify-center text-[#C6A875]">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/80 rounded font-mono text-[11px] text-[#F3EBDD] border border-white/10">
                      {film.duration}
                    </div>
                    {hasVideo && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-[#C6A875] text-[#171512] rounded font-mono text-[10px] font-bold uppercase tracking-wider">
                        MP4 Ready
                      </span>
                    )}
                    <span
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        film.isPublished
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {film.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#C6A875]">
                        <span>{film.couple}</span>
                        <span>·</span>
                        <span>{film.location}</span>
                      </div>
                      <h3 className="font-serif-editorial text-[20px] text-[#F3EBDD] font-medium leading-snug mt-1">
                        {film.title}
                      </h3>
                      <p className="text-[12px] text-[#B9AD9A] mt-2 line-clamp-3 leading-relaxed">
                        {film.storyBlurb}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#30251F] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#B9AD9A]/70">
                        Release: {film.year}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(film)}
                          className="p-1.5 text-[#B9AD9A] hover:text-[#C6A875] hover:bg-[#30251F] rounded transition-colors cursor-pointer"
                          title="Edit Film"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(film.id)}
                          className="p-1.5 text-[#B9AD9A] hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                          title="Delete Film"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Film Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#171512] border border-[#754C3D] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#30251F]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C6A875]/15 border border-[#C6A875]/40 flex items-center justify-center text-[#C6A875]">
                  <Video className="w-4 h-4" />
                </div>
                <h2 className="font-serif-editorial text-2xl text-[#F3EBDD]">
                  {currentFilm.id ? 'Edit Cinematic Film' : 'New Cinematic Film'}
                </h2>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#B9AD9A] hover:text-[#F3EBDD] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Film Title
                  </label>
                  <input
                    type="text"
                    required
                    value={currentFilm.title || ''}
                    onChange={(e) =>
                      setCurrentFilm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Echoes Across Lake Pichola"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Couple Names
                  </label>
                  <input
                    type="text"
                    required
                    value={currentFilm.couple || ''}
                    onChange={(e) =>
                      setCurrentFilm((prev) => ({ ...prev, couple: e.target.value }))
                    }
                    placeholder="e.g. Meera & Aarav"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={currentFilm.location || ''}
                    onChange={(e) =>
                      setCurrentFilm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g. Udaipur, Rajasthan"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Release Year
                  </label>
                  <input
                    type="text"
                    value={currentFilm.year || ''}
                    onChange={(e) =>
                      setCurrentFilm((prev) => ({ ...prev, year: e.target.value }))
                    }
                    placeholder="2026"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={currentFilm.duration || ''}
                    onChange={(e) =>
                      setCurrentFilm((prev) => ({ ...prev, duration: e.target.value }))
                    }
                    placeholder="08:42"
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              {/* ============================================================== */}
              {/* PRIMARY VIDEO SOURCE: MP4 Upload or Direct Streaming Link */}
              {/* ============================================================== */}
              <div className="p-4 bg-[#12100E] border border-[#754C3D]/60 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11.5px] font-mono uppercase tracking-wider text-[#C6A875] font-semibold">
                    Wedding Film Video (MP4 File or Streaming Link)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C6A875] text-[#171512] text-[11px] font-semibold rounded-lg cursor-pointer hover:bg-[#d8bc8a] transition-colors shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload MP4 / WebM Video</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={currentFilm.videoUrl || ''}
                  onChange={(e) =>
                    setCurrentFilm((prev) => ({ ...prev, videoUrl: e.target.value }))
                  }
                  placeholder="/uploads/my_wedding_film.mp4, or YouTube / Vimeo URL"
                  className="w-full bg-[#171512] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[12.5px] px-3 py-2 rounded-lg outline-none font-mono"
                />

                {/* Video Playback Verification Box */}
                {currentFilm.videoUrl && isVideoFile(currentFilm.videoUrl) && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] font-mono text-[#C6A875] uppercase block">
                      Live Video Playback Test:
                    </span>
                    <div className="aspect-[16/9] w-full max-h-[220px] bg-black rounded-lg overflow-hidden border border-[#30251F]">
                      <video
                        src={currentFilm.videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Poster Image */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                  Cinema Poster Frame (JPG, PNG)
                </label>
                <div className="flex items-center gap-4">
                  {currentFilm.posterImage && !isVideoFile(currentFilm.posterImage) && (
                    <img
                      src={currentFilm.posterImage}
                      alt="Poster Preview"
                      className="w-24 h-14 object-cover rounded border border-[#30251F]"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={currentFilm.posterImage || ''}
                      onChange={(e) =>
                        setCurrentFilm((prev) => ({ ...prev, posterImage: e.target.value }))
                      }
                      placeholder="/assets/images/... or https://..."
                      className="w-full bg-[#12100E] border border-[#30251F] text-[#F3EBDD] text-[12px] px-3 py-1.5 rounded outline-none font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#30251F] text-[#F3EBDD] text-[11px] font-medium rounded cursor-pointer hover:bg-[#43332a] transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C6A875]" />
                      <span>Upload Poster Frame</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePosterUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1">
                  Story Narrative Blurb
                </label>
                <textarea
                  rows={3}
                  value={currentFilm.storyBlurb || ''}
                  onChange={(e) =>
                    setCurrentFilm((prev) => ({ ...prev, storyBlurb: e.target.value }))
                  }
                  placeholder="Describe the musical score, vows, and emotional arc of this wedding film..."
                  className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none resize-none"
                />
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
                    value={currentFilm.order || 1}
                    onChange={(e) =>
                      setCurrentFilm((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full bg-[#12100E] border border-[#30251F] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#F3EBDD]">
                    <input
                      type="checkbox"
                      checked={currentFilm.isPublished ?? true}
                      onChange={(e) =>
                        setCurrentFilm((prev) => ({ ...prev, isPublished: e.target.checked }))
                      }
                      className="rounded border-[#30251F] bg-[#12100E] text-[#C6A875] focus:ring-0"
                    />
                    <span>Publish in Video Gallery</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#30251F]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#30251F]/40 hover:bg-[#30251F] text-[#B9AD9A] text-[13px] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A875] hover:bg-[#d8bc8a] text-[#171512] font-semibold text-[13px] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Film</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
