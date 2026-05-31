import { Link } from 'react-router';
import { ArrowLeft, Phone } from 'lucide-react';
import { LocalisationContact } from '../components/LocalisationContact';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { BookingProvider } from '../context/BookingContext';

export function ContactPage() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
        {/* Header minimal */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="text-3xl font-bold">
                <span className="text-[#ff2d7a]">Au Coeur du Lac</span>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <a
                  href="tel:+221711358759"
                  className="flex items-center gap-2 px-6 py-3 bg-[#ff2d7a] text-white rounded-full hover:bg-[#e01d6a] transition-all shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  +221 71 135 87 59
                </a>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour au site
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-20">
          <LocalisationContact />
        </div>
      </div>
    </BookingProvider>
  );
}
