import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GuestHome from './pages/GuestHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRSVPPage from './pages/AdminRSVPPage';
import AdminWallPage from './pages/AdminWallPage';
import AdminGalleryPage from './pages/AdminGalleryPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminGiftsPage from './pages/AdminGiftsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ZONE: Digital Interactive Invitation */}
        <Route path="/" element={<GuestHome />} />

        {/* SECURE ADMIN ZONE: Credentials Page */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* SECURE ADMIN PANEL: Dashboard tabs */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/rsvps" element={<AdminRSVPPage />} />
        <Route path="/admin/moderation" element={<AdminWallPage />} />
        <Route path="/admin/gallery" element={<AdminGalleryPage />} />
        <Route path="/admin/gifts" element={<AdminGiftsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
