import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  Check,
  Edit,
  MapPin,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminStories: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<any | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    coupleNames: '',
    slug: '',
    location: '',
    weddingDate: '',
    category: 'Palace Destination',
    coverImage: '/assets/images/wedding_udaipur_palace_1794571321843.jpg',
    gallery: [] as string[],
    description: '',
    filmDuration: '08:00',
    isPublished: true,
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const fetchStories = () => {
    api.admin
      .getStories()
      .then((res) => {
        if (res.success && res.data) setStories(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openCreateModal = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      coupleNames: '',
      slug: '',
      location: '',
      weddingDate: '',
      category: 'Palace Destination',
      coverImage: '/assets/images/wedding_udaipur_palace_1794571321843.jpg',
      gallery: [],
      description: '',
      filmDuration: '08:00',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (story: any) => {
    setEditingStory(story);
    setFormData({
      title: story.title || '',
      coupleNames: story.coupleNames || '',
      slug: story.slug || '',
      location: story.location || '',
      weddingDate: story.weddingDate || '',
      category: story.category || 'Palace Destination',
      coverImage: story.coverImage || '',
      gallery: Array.isArray(story.gallery) ? story.gallery : [],
      description: story.description || '',
      filmDuration: story.filmDuration || '08:00',
      isPublished: story.isPublished !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStory) {
        await api.admin.updateStory(editingStory.id, formData);
      } else {
        await api.admin.createStory(formData);
      }
      setModalOpen(false);
      fetchStories();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this wedding story? This action cannot be undone.')) return;
    try {
      await api.admin.deleteStory(id);
      fetchStories();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleTogglePublish = async (story: any) => {
    try {
      await api.admin.updateStory(story.id, { isPublished: !story.isPublished });
      fetchStories();
    } catch (err: any) {
      alert('Publish toggle failed: ' + err.message);
    }
  };

  const handleAddGalleryItem = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData({
      ...formData,
      gallery: [...formData.gallery, newGalleryUrl.trim()],
    });
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryItem = (index: number) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== index),
    });
  };

  const handleMoveGalleryItem = (index: number, direction: -1 | 1) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= formData.gallery.length) return;
    const updated = [...formData.gallery];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setFormData({ ...formData, gallery: updated });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30251F]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#C6A875]">
            Editorial Portfolio CMS
          </span>
          <h2 className="font-serif-editorial text-[30px] font-medium text-[#F3EBDD] mt-0.5">
            Wedding Stories ({stories.length})
          </h2>
          <p className="text-[13px] text-neutral-400 mt-1">
            Curate multi-day heritage commissions, couple narratives, and photographic galleries
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13.5px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Wedding Story</span>
        </button>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#C6A875]">
          <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px]">Loading Wedding Stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="py-20 text-center text-neutral-500 bg-[#171512] rounded-2xl border border-[#30251F]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-[15px] font-medium text-neutral-300">No wedding stories published</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#C6A875] text-black font-semibold text-[13px] rounded-lg"
          >
            Create First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-[#171512] border border-[#30251F] hover:border-[#754C3D] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all"
            >
              {/* Cover Preview */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(story)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border ${
                      story.isPublished !== false
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                        : 'bg-neutral-900/80 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {story.isPublished !== false ? '● Live Published' : '○ Draft'}
                  </button>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-[#C6A875] border border-white/10">
                    {story.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono bg-black/70 text-white">
                  {(story.gallery || []).length} Frames
                </div>
              </div>

              {/* Story Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif-editorial text-[22px] font-medium text-[#F3EBDD] leading-snug">
                    {story.coupleNames}
                  </h3>
                  <p className="text-[13px] font-medium text-[#C6A875] mt-0.5">
                    {story.title}
                  </p>
                  <div className="flex items-center gap-3 text-[12px] text-neutral-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {story.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {story.weddingDate}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                    {story.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#30251F] flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(story)}
                    className="text-[13px] text-[#C6A875] hover:text-[#F3EBDD] flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Project</span>
                  </button>

                  <button
                    onClick={() => handleDelete(story.id)}
                    className="text-[13px] text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Drawer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-[720px] max-h-[92vh] overflow-y-auto bg-[#171512] border border-[#754C3D] rounded-2xl p-6 sm:p-8 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#30251F]">
              <h3 className="font-serif-editorial text-[24px] font-medium text-[#F3EBDD]">
                {editingStory ? 'Edit Wedding Story' : 'Create New Wedding Story'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] uppercase text-[#C6A875] mb-1 font-medium">
                    Couple Names
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.coupleNames}
                    onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                    placeholder="e.g. Meera &amp; Aarav"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase text-[#C6A875] mb-1 font-medium">
                    Editorial Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Echoes Across Lake Pichola"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] uppercase text-[#C6A875] mb-1 font-medium">
                    Location &amp; Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Taj Lake Palace, Udaipur"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase text-[#C6A875] mb-1 font-medium">
                    Wedding Dates
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    placeholder="e.g. Nov 14–17, 2025"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase text-[#C6A875] mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                  >
                    <option value="Palace Destination">Palace Destination</option>
                    <option value="Royal Heritage">Royal Heritage</option>
                    <option value="Intimate Coastal">Intimate Coastal</option>
                    <option value="Courtyard Baithak">Courtyard Baithak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1 font-medium">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="/assets/images/..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1 font-medium">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Atmospheric narrative capturing the celebration, light, and couple dynamic..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none resize-none"
                />
              </div>

              {/* Gallery Images Management */}
              <div className="pt-2">
                <label className="block text-[12px] uppercase text-[#C6A875] mb-2 font-medium">
                  Gallery Photographs ({formData.gallery.length} Frames)
                </label>

                {/* Add new photo input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Enter image URL or path to add..."
                    className="flex-1 px-3.5 py-2 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13px] font-mono focus:border-[#C6A875] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryItem}
                    className="px-4 py-2 bg-[#30251F] border border-[#754C3D] hover:bg-[#C6A875] hover:text-black rounded-lg text-[13px] font-medium transition-colors"
                  >
                    Add Frame
                  </button>
                </div>

                {/* Gallery List with Reordering */}
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl border border-[#30251F]">
                  {formData.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 bg-[#171512] rounded-lg border border-[#30251F]"
                    >
                      <img src={imgUrl} alt="" className="w-10 h-7 object-cover rounded bg-black shrink-0" />
                      <span className="flex-1 text-[12px] font-mono text-neutral-300 truncate">
                        {imgUrl}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => handleMoveGalleryItem(i, -1)}
                          className="p-1 hover:text-[#C6A875] disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={i === formData.gallery.length - 1}
                          onClick={() => handleMoveGalleryItem(i, 1)}
                          className="p-1 hover:text-[#C6A875] disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(i)}
                          className="p-1 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#C6A875]"
                />
                <label htmlFor="pub-check" className="text-[13.5px] text-[#F3EBDD] cursor-pointer">
                  Publish to Public Website Portfolio immediately
                </label>
              </div>

              <div className="pt-4 border-t border-[#30251F] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-neutral-800 text-neutral-300 text-[13px] hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13px] hover:bg-[#D5B988] transition-colors shadow-lg"
                >
                  {editingStory ? 'Save Changes' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
