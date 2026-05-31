import { Suspense, lazy, useEffect, useState } from 'react';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

import { Packs } from './components/Packs';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { LocalisationContact } from './components/LocalisationContact';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { createAdminSession, isAdminSessionActive, removeAdminSession } from '../lib/auth';
import { initAnalytics, logEvent } from '../lib/analytics';

const AdminLogin = lazy(() => import('./components/AdminLogin').then((module) => ({ default: module.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));

type Page = 'home' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => isAdminSessionActive());
  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    logEvent('page_view', { page: currentPage });
  }, [currentPage]);

  const handleAdminLogin = () => {
    createAdminSession();
    setIsAdminLoggedIn(true);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    removeAdminSession();
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
  };

  return (
    <BookingProvider>
      {currentPage === 'home' && (
        <div className="min-h-screen bg-white">
          <Navbar />
          <Hero />
          <Packs />
          <Gallery />
          <Testimonials />
          <FAQ />
          <Contact />
          <LocalisationContact />
          <Footer />
          <WhatsAppButton />

          {/* Bouton admin placé en bas à gauche pour éviter le chevauchement */}
          <button
            type="button"
            onClick={() => setCurrentPage('admin-login')}
            className="fixed bottom-8 left-8 w-14 h-14 bg-gradient-to-r from-[#ff2d7a] to-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all flex items-center justify-center z-40"
            aria-label="Ouvrir l'espace administrateur"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      )}

      {currentPage === 'admin-login' && (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement de l'espace admin...</div>}>
          <div>
            <AdminLogin onLogin={handleAdminLogin} />
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="fixed top-8 left-8 px-6 py-3 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              ← Retour au site
            </button>
          </div>
        </Suspense>
      )}

      {currentPage === 'admin-dashboard' && isAdminLoggedIn && (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement de l'administration...</div>}>
          <AdminDashboard onLogout={handleAdminLogout} />
        </Suspense>
      )}
    </BookingProvider>
  );
}