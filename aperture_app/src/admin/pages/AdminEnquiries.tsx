import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Filter,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Trash2,
  User,
} from 'lucide-react';

interface Enquiry {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  weddingDate: string;
  location: string;
  weddingType: string;
  service: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Confirmed' | 'Closed';
  submittedAt: string;
}

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getEnquiries();
      setEnquiries(data);
    } catch (err: any) {
      setAlert({ type: 'error', text: err.message || 'Failed to fetch enquiries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    try {
      await api.admin.updateEnquiry(id, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setAlert({ type: 'success', text: `Status updated to ${newStatus}` });
    } catch (err: any) {
      setAlert({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this client enquiry?')) return;
    try {
      await api.admin.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      setAlert({ type: 'success', text: 'Enquiry removed' });
    } catch (err: any) {
      setAlert({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      enq.clientName.toLowerCase().includes(query) ||
      enq.email.toLowerCase().includes(query) ||
      enq.location.toLowerCase().includes(query) ||
      (enq.service && enq.service.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'New':
        return 'bg-amber-950/70 border-amber-800 text-amber-300';
      case 'Contacted':
        return 'bg-blue-950/70 border-blue-800 text-blue-300';
      case 'In Discussion':
        return 'bg-purple-950/70 border-purple-800 text-purple-300';
      case 'Confirmed':
        return 'bg-emerald-950/70 border-emerald-800 text-emerald-300';
      case 'Closed':
        return 'bg-zinc-800 border-zinc-700 text-zinc-400';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#30251F]">
        <div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#F3EBDD] font-medium">
            Client Wedding Enquiries
          </h1>
          <p className="text-[13px] text-[#B9AD9A] mt-1">
            Review incoming wedding commissions, direct WhatsApp / email responses, and booking status
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-[13px] text-[#C6A875]">
            {filteredEnquiries.length} / {enquiries.length} Total Enquiries
          </span>
        </div>
      </div>

      {alert && (
        <div
          className={`p-3 rounded-lg text-[13px] flex items-center justify-between ${
            alert.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          <span>{alert.text}</span>
          <button onClick={() => setAlert(null)} className="text-sm font-bold opacity-75 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Search and Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'New', 'Contacted', 'In Discussion', 'Confirmed', 'Closed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-[#C6A875] text-[#171512] font-semibold shadow-sm'
                  : 'bg-[#171512] text-[#B9AD9A] hover:bg-[#30251F] border border-[#30251F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#B9AD9A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search couple, email, city..."
            className="w-full bg-[#171512] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] pl-9 pr-3 py-1.5 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* Main Content: Split List and Detail View */}
      {loading ? (
        <div className="p-12 text-center text-[#B9AD9A]">Loading client enquiries...</div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="p-12 text-center text-[#B9AD9A] bg-[#171512] border border-[#30251F] rounded-xl">
          No enquiries matching your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List View */}
          <div className="lg:col-span-7 space-y-3">
            {filteredEnquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#221c17] border-[#C6A875] shadow-lg'
                      : 'bg-[#171512] border-[#30251F] hover:border-[#754C3D]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif-editorial text-[18px] text-[#F3EBDD] font-medium leading-snug">
                        {enq.clientName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#B9AD9A] mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C6A875]" />
                          {enq.weddingDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C6A875]" />
                          {enq.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${getStatusBadge(
                        enq.status
                      )}`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <p className="text-[12.5px] text-[#B9AD9A]/80 mt-2 line-clamp-2 leading-relaxed">
                    {enq.message}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#30251F]/60 flex items-center justify-between text-[11px] text-[#B9AD9A]/60">
                    <span className="font-mono">
                      Received: {new Date(enq.submittedAt).toLocaleDateString()}
                    </span>
                    <span className="text-[#C6A875] font-medium">Click to inspect & respond →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail View Drawer */}
          <div className="lg:col-span-5">
            {selectedEnquiry ? (
              <div className="sticky top-6 bg-[#171512] border border-[#754C3D] rounded-xl p-6 space-y-5 shadow-xl">
                <div className="flex items-start justify-between pb-4 border-b border-[#30251F]">
                  <div>
                    <span className="text-[11px] font-mono text-[#C6A875] uppercase tracking-wider">
                      Commission Details
                    </span>
                    <h2 className="font-serif-editorial text-2xl text-[#F3EBDD] font-medium mt-0.5">
                      {selectedEnquiry.clientName}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#C6A875] mb-1.5">
                    Pipeline Status
                  </label>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      handleStatusChange(selectedEnquiry.id, e.target.value as Enquiry['status'])
                    }
                    className="w-full bg-[#12100E] border border-[#30251F] focus:border-[#C6A875] text-[#F3EBDD] text-[13px] px-3 py-2 rounded-lg outline-none font-medium"
                  >
                    <option value="New">New (Unread / Fresh)</option>
                    <option value="Contacted">Contacted (First touch made)</option>
                    <option value="In Discussion">In Discussion (Scope & Proposal)</option>
                    <option value="Confirmed">Confirmed (Retainer Received)</option>
                    <option value="Closed">Closed / Archived</option>
                  </select>
                </div>

                {/* Contact Coordinates */}
                <div className="space-y-2.5 text-[13px] bg-[#12100E] p-3.5 rounded-lg border border-[#30251F]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#B9AD9A] flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C6A875]" />
                      {selectedEnquiry.email}
                    </span>
                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=Shaadi-Savan: Your Wedding Photography Enquiry`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#C6A875] hover:underline"
                    >
                      Email ↗
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#30251F]/60">
                    <span className="text-[#B9AD9A] flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C6A875]" />
                      {selectedEnquiry.phone}
                    </span>
                    {selectedEnquiry.phone && (
                      <a
                        href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          selectedEnquiry.clientName
                        )},%20thank%20you%20for%20reaching%20out%20to%20Shaadi-Savan%20Photography!`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Event Particulars */}
                <div className="grid grid-cols-2 gap-3 text-[12.5px]">
                  <div className="bg-[#12100E] p-3 rounded-lg border border-[#30251F]">
                    <span className="text-[10px] font-mono text-[#C6A875] uppercase block">
                      Wedding Dates
                    </span>
                    <span className="text-[#F3EBDD] font-medium mt-0.5 block">
                      {selectedEnquiry.weddingDate || 'TBD'}
                    </span>
                  </div>
                  <div className="bg-[#12100E] p-3 rounded-lg border border-[#30251F]">
                    <span className="text-[10px] font-mono text-[#C6A875] uppercase block">
                      Venue / Destination
                    </span>
                    <span className="text-[#F3EBDD] font-medium mt-0.5 block">
                      {selectedEnquiry.location || 'Undisclosed'}
                    </span>
                  </div>
                </div>

                {/* Requested Scope */}
                <div className="bg-[#12100E] p-3 rounded-lg border border-[#30251F] text-[12.5px]">
                  <span className="text-[10px] font-mono text-[#C6A875] uppercase block">
                    Desired Scope / Services
                  </span>
                  <span className="text-[#F3EBDD] font-medium mt-0.5 block">
                    {selectedEnquiry.service || selectedEnquiry.weddingType || 'Full Commission'}
                  </span>
                </div>

                {/* Personal Note */}
                <div>
                  <span className="text-[11px] font-mono text-[#C6A875] uppercase tracking-wider block mb-1.5">
                    Couple's Message
                  </span>
                  <div className="bg-[#12100E] p-3.5 rounded-lg border border-[#30251F] text-[13px] text-[#F3EBDD] leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiry.message || 'No additional note provided.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-[#B9AD9A] bg-[#171512] border border-[#30251F] rounded-xl">
                Select an enquiry from the list to view its full details and respond directly.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
