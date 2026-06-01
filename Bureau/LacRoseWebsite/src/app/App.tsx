import { useEffect } from 'react';
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
import { initAnalytics, logEvent } from '../lib/analytics';

export default function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    logEvent('page_view', { page: 'home' });
  }, []);

  return (
    <BookingProvider>
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
      </div>
    </BookingProvider>
  );
}
