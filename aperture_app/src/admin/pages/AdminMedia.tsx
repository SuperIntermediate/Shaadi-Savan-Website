import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Edit2,
  Film,
  Filter,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminMedia: React.FC = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit modal
  const [editItem, setEditItem] = useState<any | null>(null);

  const fetchMedia = () => {
    setLoading(true);
    api.admin
      .getMedia()
      .then((res: any) => {
        const items = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setMedia(items);
      })
      .catch((err: any) => {
        console.error('Fetch media error:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setToast(null);

    let successCount = 0;
    let lastError = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('category', categoryFilter === 'All' ? 'Weddings' : categoryFilter);

      try {
        await api.admin.uploadMedia(formData);
        successCount++;
      } catch (err: any) {
        lastError = err.message || 'Server upload failed';
        console.error('Upload error for', file.name, err);
      }
    }

    setUploading(false);
    fetchMedia();

    if (successCount > 0) {
      setToast({
        type: 'success',
        message: `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''} to library!`,
      });
      setTimeout(() => setToast(null), 4000);
    } else if (lastError) {
      setToast({
        type: 'error',
        message: `Upload failed: ${lastError}`,
      });
      setTimeout(() => setToast(null), 6000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this media item?')) return;
    try {
      await api.admin.deleteMedia(id);
      fetchMedia();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    try {
      await api.admin.updateMedia(editItem.id, {
        title: editItem.title,
        altText: editItem.altText,
        category: editItem.category,
      });
      setEditItem(null);
      fetchMedia();
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  const filtered = media.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.altText || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.mediaType === typeFilter;
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = ['All', 'Weddings', 'Portraits', 'Haldi & Mehendi', 'Sangeet & Films', 'Locations'];

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-[14px] flex items-center justify-between border ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
          }`}
        >
          <span>{toast.message}</span>
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
            Centralized Asset Storage
          </span>
          <h2 className="font-serif-editorial text-[30px] font-medium text-[#F3EBDD] mt-0.5">
            Media Library ({media.length})
          </h2>
          <p className="text-[13px] text-neutral-400 mt-1">
            Upload, manage, and inspect high-resolution photographs and cinematic footage
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13.5px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-lg">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            disabled={uploading}
            onChange={(e) => {
              handleFileUpload(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* Drag & Drop / Click to Upload Dropzone */}
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        className="block border-2 border-dashed border-[#754C3D]/60 hover:border-[#C6A875] bg-[#171512]/50 hover:bg-[#171512]/80 p-8 rounded-2xl text-center space-y-3 transition-colors cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-[#30251F] text-[#C6A875] flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[15px] font-medium text-white">
            {uploading ? 'Uploading asset(s)...' : 'Click to select or drag & drop photographs / videos here'}
          </p>
          <p className="text-[12.5px] text-neutral-400 mt-1">
            Supports JPG, JPEG, PNG, WebP, AVIF, MP4, WebM, and MOV up to 50MB
          </p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          disabled={uploading}
          onChange={(e) => {
            handleFileUpload(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
      </label>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#171512] border border-[#30251F]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by title or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-[#754C3D]/40 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex items-center rounded-lg bg-black/50 border border-[#754C3D]/40 p-1 text-[12px]">
            {(['all', 'image', 'video'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                  typeFilter === t
                    ? 'bg-[#C6A875] text-[#171512]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Types' : t + 's'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-black/50 border border-[#754C3D]/40 rounded-lg text-white text-[13px] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#C6A875]">
          <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px]">Loading Assets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-neutral-500 bg-[#171512] rounded-2xl border border-[#30251F]">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-[15px] font-medium text-neutral-300">No media found matching criteria</p>
          <p className="text-[13px] text-neutral-500 mt-1">Try resetting filters or upload new files.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#171512] border border-[#30251F] hover:border-[#C6A875]/70 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[4/3] bg-black overflow-hidden">
                {item.mediaType === 'video' || (item.mediaUrl && /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl)) ? (
                  <div className="w-full h-full relative bg-black">
                    <video
                      src={item.mediaUrl}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                      <Film className="w-7 h-7 text-[#C6A875]" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Type Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/70 text-white border border-white/10">
                  {item.mediaType}
                </span>

                {/* Quick copy overlay */}
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.mediaUrl, item.id)}
                  title="Copy URL"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-[#C6A875] text-white hover:text-black transition-colors"
                >
                  {copyFeedback === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3">
                <p className="text-[13px] font-medium text-white truncate" title={item.title}>
                  {item.title}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                  <span className="text-[#C6A875]">{item.category}</span>
                  <span>{item.size || 'HD'}</span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#30251F] flex items-center justify-between">
                  <button
                    onClick={() => setEditItem(item)}
                    className="text-[11.5px] text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-[11.5px] text-neutral-400 hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-[480px] bg-[#171512] border border-[#754C3D] rounded-2xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#30251F]">
              <h3 className="font-serif-editorial text-[20px] font-medium text-[#F3EBDD]">
                Edit Media Metadata
              </h3>
              <button onClick={() => setEditItem(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1">Alt Text</label>
                <input
                  type="text"
                  value={editItem.altText || ''}
                  onChange={(e) => setEditItem({ ...editItem, altText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1">Category</label>
                <select
                  value={editItem.category || 'Weddings'}
                  onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-[13px] hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13px] hover:bg-[#D5B988]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
