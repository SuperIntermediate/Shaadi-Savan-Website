import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicHome } from './pages/PublicHome';
import { StoryDetail } from './pages/StoryDetail';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminOverview } from './admin/pages/AdminOverview';
import { AdminHero } from './admin/pages/AdminHero';
import { AdminPhilosophy } from './admin/pages/AdminPhilosophy';
import { AdminMedia } from './admin/pages/AdminMedia';
import { AdminStories } from './admin/pages/AdminStories';
import { AdminServices } from './admin/pages/AdminServices';
import { AdminChapters } from './admin/pages/AdminChapters';
import { AdminFilms } from './admin/pages/AdminFilms';
import { AdminTestimonials } from './admin/pages/AdminTestimonials';
import { AdminConsultations } from './admin/pages/AdminConsultations';
import { AdminEnquiries } from './admin/pages/AdminEnquiries';
import { AdminSettings } from './admin/pages/AdminSettings';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#12100E] flex items-center justify-center text-[#C6A875]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#C6A875] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-[#C6A875] tracking-wider uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/story/:slug" element={<StoryDetail />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin CMS Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="philosophy" element={<AdminPhilosophy />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="stories" element={<AdminStories />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="chapters" element={<AdminChapters />} />
            <Route path="films" element={<AdminFilms />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="consultations" element={<AdminConsultations />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
