import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicHome } from './pages/PublicHome';
import { StoryDetail } from './pages/StoryDetail';

/**
 * =========================================================================================
 * 💍 SHAADI-SAVAN — LUXURY CLIENT PORTFOLIO APPLICATION
 * =========================================================================================
 * 
 * Standalone Client Mode:
 * - Simple, ultra-fast client-side routing.
 * - Admin panel removed for a clean, streamlined client-ready portfolio.
 * - No backend or database server required.
 * =========================================================================================
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Client Portfolio */}
        <Route path="/" element={<PublicHome />} />

        {/* Wedding Story Gallery & Detail View */}
        <Route path="/story/:slug" element={<StoryDetail />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
