import { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Clock, Loader, MessageCircle } from 'lucide-react';
import { BookingData } from './BookingModal';
import { useBooking } from '../context/BookingContext';
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from '../../lib/email';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData | null;
  onPaymentSuccess: () => void;
}

type PaymentMethod = 'wave' | 'orange-money' | 'card';
type PaymentOutcome = 'confirmed' | 'pending' | null;

const WAVE_PHONE_DISPLAY = '+221 70 957 06 52';
const WHATSAPP_NUMBER = '221709570652';

export function PaymentModal({ isOpen, onClose, bookingData, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outcome, setOutcome] = useState<PaymentOutcome>(null);
  const [pendingBookingId, setPendingBookingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { addBooking, updateBookingStatus, markEmailSent } = useBooking();

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  if (!isOpen || !bookingData) return null;

  const validateCard = () => {
    setErrorMessage('');
    if (!/^[0-9]{14,19}$/.test(cardNumber.replace(/\s+/g, ''))) {
      setErrorMessage('Veuillez saisir un numéro de carte valide.');
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry)) {
      setErrorMessage("Veuillez saisir une date d'expiration au format MM/AA.");
      return false;
    }
    if (!/^[0-9]{3,4}$/.test(cardCVC)) {
      setErrorMessage('Veuillez saisir un CVC valide.');
      return false;
    }
    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card' && !validateCard()) return;

    setIsProcessing(true);
    try {
      if (paymentMethod === 'card') {
        // Carte : toujours simulée (nécessite un backend pour Stripe)
        const newBooking = addBooking({ ...bookingData, paymentMethod, paymentStatus: 'pending' });
        await new Promise((resolve) => setTimeout(resolve, 1800));
        updateBookingStatus(newBooking.id, 'confirmed');
        await sendBookingConfirmationEmail({ ...newBooking, paymentStatus: 'confirmed' });
        markEmailSent(newBooking.id);
        setOutcome('confirmed');
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
          setOutcome(null);
        }, 3000);
      } else {
        // Wave / Orange Money : réel — client envoie manuellement, admin confirme
        const newBooking = addBooking({ ...bookingData, paymentMethod, paymentStatus: 'pending' });
        await sendAdminNotificationEmail(newBooking);
        await sendBookingConfirmationEmail(newBooking);
        markEmailSent(newBooking.id);
        setPendingBookingId(newBooking.id);
        setOutcome('pending');
      }
    } catch (err) {
      console.error('[Paiement]', err);
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Écran — paiement carte confirmé
  if (outcome === 'confirmed') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" aria-live="polite">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Paiement Réussi !</h2>
          <p className="text-gray-600 mb-2">Votre réservation a été confirmée.</p>
          <p className="text-sm text-gray-500">
            Un email de confirmation a été envoyé à <strong>{bookingData.customerEmail}</strong>
          </p>
        </div>
      </div>
    );
  }

  // Écran — virement Wave/OM en attente
  if (outcome === 'pending') {
    const whatsappMessage = encodeURIComponent(
      `Bonjour, j'ai effectué un virement ${paymentMethod === 'wave' ? 'Wave' : 'Orange Money'} de ${bookingData.totalAmount.toLocaleString()} FCFA pour la réservation ${pendingBookingId} au nom de ${bookingData.customerName}.`
    );
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" aria-live="polite">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Réservation enregistrée !</h2>
          <p className="text-gray-600 mb-6">
            Notre équipe va vérifier votre virement et confirmer votre réservation sous 24h.
            Un récapitulatif a été envoyé à <strong>{bookingData.customerEmail}</strong>.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Numéro de réservation</p>
            <p className="text-xl font-bold text-[#ff2d7a]">{pendingBookingId}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all font-medium mb-3"
          >
            <MessageCircle className="w-5 h-5" />
            Confirmer par WhatsApp
          </a>
          <button
            type="button"
            onClick={() => { setOutcome(null); onPaymentSuccess(); onClose(); }}
            className="w-full py-3 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#ff2d7a] to-pink-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Paiement Sécurisé</h2>
            <p className="text-pink-100">Finalisez votre réservation</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            aria-label="Fermer le modal de paiement"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Récapitulatif */}
          <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 mb-8 border border-pink-200">
            <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pack</span>
                <span className="font-semibold">{bookingData.packName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold">
                  {bookingData.date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Personnes</span>
                <span className="font-semibold">{bookingData.numberOfPeople}</span>
              </div>
              <div className="border-t border-pink-200 my-3" />
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total à payer</span>
                <span className="text-2xl font-bold text-[#ff2d7a]">
                  {bookingData.totalAmount.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-4">Méthode de paiement</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {(['wave', 'orange-money', 'card'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method
                    ? 'border-[#ff2d7a] bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    method === 'wave'
                      ? 'bg-blue-100'
                      : method === 'orange-money'
                      ? 'bg-orange-100'
                      : 'bg-green-100'
                  }`}
                >
                  {method === 'card' ? (
                    <CreditCard className="w-6 h-6 text-green-600" />
                  ) : (
                    <Smartphone
                      className={`w-6 h-6 ${
                        method === 'wave' ? 'text-blue-600' : 'text-orange-600'
                      }`}
                    />
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {method === 'wave' ? 'Wave' : method === 'orange-money' ? 'Orange Money' : 'Carte'}
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handlePayment}>
            {(paymentMethod === 'wave' || paymentMethod === 'orange-money') && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-blue-600 font-medium mb-1">Montant exact à envoyer</p>
                  <p className="text-4xl font-bold text-blue-900 mb-4">
                    {bookingData.totalAmount.toLocaleString()} FCFA
                  </p>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Numéro {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 tracking-widest">
                      {WAVE_PHONE_DISPLAY}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    Envoyez le montant exact, puis cliquez sur{' '}
                    <strong>"J'ai payé"</strong>. Votre réservation sera confirmée par notre équipe
                    sous 24h.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff2d7a] focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff2d7a] focus:border-transparent"
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                    <input
                      type="text"
                      required
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff2d7a] focus:border-transparent"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#ff2d7a] to-pink-600 text-white font-medium hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Traitement...
                  </>
                ) : paymentMethod === 'card' ? (
                  `Payer ${bookingData.totalAmount.toLocaleString()} FCFA`
                ) : (
                  "J'ai payé"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
