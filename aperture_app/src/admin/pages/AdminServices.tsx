import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const fetchServices = () => {
    api.admin
      .getServices()
      .then((res) => {
        if (res.success && res.data) setServices(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id && editingItem.id.startsWith('srv-')) {
        await api.admin.updateService(editingItem.id, editingItem);
      } else {
        await api.admin.createService(editingItem);
      }
      setEditingItem(null);
      fetchServices();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.admin.deleteService(id);
      fetchServices();
    } catch (e: any) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleNew = () => {
    setEditingItem({
      title: '',
      tag: 'Specialized Offering',
      description: '',
      deliverables: '',
      image: '/assets/images/wedding_jaipur_couple_1794571322579.jpg',
      isPublished: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30251F]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#C6A875]">
            Atelier Offerings
          </span>
          <h2 className="font-serif-editorial text-[30px] font-medium text-[#F3EBDD] mt-0.5">
            Service Packages &amp; Formats ({services.length})
          </h2>
          <p className="text-[13px] text-neutral-400 mt-1">
            Configure documentary photography, 4K cinema, pre-wedding, and destination packages
          </p>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13.5px] hover:bg-[#D5B988] transition-colors cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#C6A875]">
          <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px]">Loading Services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#171512] border border-[#30251F] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#C6A875]">
                    {srv.tag}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      srv.isPublished !== false
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {srv.isPublished !== false ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <h3 className="font-serif-editorial text-[24px] font-medium text-white">
                  {srv.title}
                </h3>

                <p className="text-[13.5px] text-neutral-300 leading-relaxed">
                  {srv.description}
                </p>

                <div className="p-3 bg-black/40 rounded-lg border border-white/10 text-[12px] text-neutral-400">
                  <span className="text-white font-medium">Deliverables:</span> {srv.deliverables}
                </div>
              </div>

              <div className="pt-4 border-t border-[#30251F] flex items-center justify-between">
                <button
                  onClick={() => setEditingItem(srv)}
                  className="text-[13px] text-[#C6A875] hover:underline flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Offering</span>
                </button>
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="text-[13px] text-neutral-400 hover:text-red-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-[560px] bg-[#171512] border border-[#754C3D] rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#30251F]">
              <h3 className="font-serif-editorial text-[22px] font-medium text-[#F3EBDD]">
                {editingItem.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Wedding Photography"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingItem.tag}
                  onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                  placeholder="e.g. Editorial &amp; Documentary"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase text-[#C6A875] mb-1">Deliverables Summary</label>
                <input
                  type="text"
                  value={editingItem.deliverables}
                  onChange={(e) => setEditingItem({ ...editingItem, deliverables: e.target.value })}
                  placeholder="800+ Retouched Photographs · Private Cloud Vault"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-[#754C3D]/50 rounded-lg text-white text-[13.5px] focus:border-[#C6A875] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="srv-pub"
                  checked={editingItem.isPublished !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#C6A875]"
                />
                <label htmlFor="srv-pub" className="text-[13px] text-neutral-300">
                  Visible on Public Website
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#30251F]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13px] hover:bg-[#D5B988]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
