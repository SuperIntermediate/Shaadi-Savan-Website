import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clapperboard,
  Eye,
  Film,
  Image,
  Mail,
  Plus,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    api.admin
      .getDashboard()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.admin.updateEnquiry(id, { status: newStatus });
      fetchDashboard();
    } catch (e: any) {
      alert('Failed to update: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-[#C6A875]">
        <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[13px] tracking-wider uppercase">Loading Atelier Overview...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentEnquiries = data?.recentEnquiries || [];
  const recentStories = data?.recentStories || [];
  const hero = data?.hero || {};

  return (
    <div className="space-y-10">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#30251F]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#C6A875]">
            Atelier Executive Control
          </span>
          <h2 className="font-serif-editorial text-[32px] font-medium text-[#F3EBDD] mt-0.5">
            Dashboard Overview
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/stories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C6A875] text-[#171512] font-semibold text-[13px] hover:bg-[#D5B988] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Wedding Story</span>
          </Link>
          <Link
            to="/admin/media"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#30251F] border border-[#754C3D]/60 text-[#F3EBDD] font-medium text-[13px] hover:bg-[#30251F]/80 transition-colors"
          >
            <Image className="w-4 h-4 text-[#C6A875]" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {[
          { label: 'Photographs', value: stats.totalPhotos || 0, icon: Image, color: 'text-amber-400' },
          { label: 'Cinematic Videos', value: stats.totalVideos || 0, icon: Film, color: 'text-emerald-400' },
          { label: 'Published Stories', value: stats.publishedProjects || 0, icon: BookOpen, color: 'text-blue-400' },
          { label: 'Draft Projects', value: stats.draftProjects || 0, icon: Sparkles, color: 'text-purple-400' },
          { label: 'New Enquiries', value: stats.newEnquiries || 0, icon: Mail, color: 'text-[#C6A875]', highlight: true },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-xl border ${
                card.highlight
                  ? 'bg-[#30251F]/80 border-[#C6A875]/80 shadow-lg'
                  : 'bg-[#171512] border-[#30251F]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] uppercase tracking-wider text-neutral-400">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-[28px] font-bold text-white mt-3 font-mono tabular-nums">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Hero Video Live Status Card */}
      <div className="bg-[#171512] border border-[#30251F] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#30251F] border border-[#754C3D]/60 flex items-center justify-center text-[#C6A875] shrink-0">
            <Clapperboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-semibold text-white">
                Published Hero Video Reel
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                Active (300 Frames)
              </span>
            </div>
            <p className="text-[13px] text-neutral-400 mt-1">
              Scroll-scrubbed cinematography sequence with 60 FPS LERP physics.
            </p>
          </div>
        </div>

        <Link
          to="/admin/hero"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black/50 border border-neutral-700 text-white text-[13px] hover:border-[#C6A875] transition-colors self-start md:self-auto"
        >
          <span>Manage Hero Video</span>
          <Eye className="w-3.5 h-3.5 text-[#C6A875]" />
        </Link>
      </div>

      {/* Grid: Recent Client Enquiries & Stories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Enquiries */}
        <div className="lg:col-span-8 bg-[#171512] border border-[#30251F] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30251F] flex items-center justify-between">
            <div>
              <h3 className="font-serif-editorial text-[20px] font-medium text-white">
                Recent Client Enquiries
              </h3>
              <p className="text-[12px] text-neutral-400">
                Direct booking consultations submitted via the public website
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-[12.5px] text-[#C6A875] hover:underline"
            >
              View All ({stats.totalEnquiries || 0}) →
            </Link>
          </div>

          <div className="divide-y divide-[#30251F] overflow-x-auto">
            {recentEnquiries.length === 0 ? (
              <p className="p-8 text-center text-neutral-500 text-[13px]">
                No client inquiries recorded yet.
              </p>
            ) : (
              recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#30251F]/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-[14.5px]">
                        {enq.clientName}
                      </span>
                      <span className="text-[11px] text-[#C6A875] font-mono">
                        {enq.weddingDate || '2026 Season'}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-neutral-400">
                      {enq.location} · <span className="text-neutral-300">{enq.service}</span>
                    </p>
                    <p className="text-[12px] text-neutral-400 truncate max-w-[500px]">
                      "{enq.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                      className={`text-[11px] font-semibold uppercase px-2.5 py-1.5 rounded border bg-black/60 focus:outline-none ${
                        enq.status === 'New'
                          ? 'text-amber-400 border-amber-800'
                          : enq.status === 'Contacted'
                          ? 'text-blue-400 border-blue-800'
                          : enq.status === 'In Discussion'
                          ? 'text-purple-400 border-purple-800'
                          : 'text-emerald-400 border-emerald-800'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <Link
                      to="/admin/enquiries"
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Inspect enquiry"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Published Stories Snippet */}
        <div className="lg:col-span-4 bg-[#171512] border border-[#30251F] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#30251F] flex items-center justify-between">
            <h3 className="font-serif-editorial text-[20px] font-medium text-white">
              Wedding Stories
            </h3>
            <Link to="/admin/stories" className="text-[12px] text-[#C6A875] hover:underline">
              Manage →
            </Link>
          </div>

          <div className="p-4 space-y-3">
            {recentStories.map((story: any) => (
              <div
                key={story.id}
                className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#30251F]/40 transition-colors"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-14 h-10 object-cover rounded bg-black/40 border border-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13.5px] font-medium text-white truncate">
                    {story.coupleNames}
                  </h4>
                  <p className="text-[11.5px] text-[#C6A875] truncate">{story.location}</p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    story.isPublished !== false
                      ? 'bg-emerald-950 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {story.isPublished !== false ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
