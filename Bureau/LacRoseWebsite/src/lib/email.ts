import emailjs from '@emailjs/browser';
import { Booking } from '../app/context/BookingContext';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
const CUSTOMER_TEMPLATE = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID ?? '';
const ADMIN_TEMPLATE = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID ?? '';

function isConfigured() {
  return SERVICE_ID && PUBLIC_KEY && CUSTOMER_TEMPLATE;
}

function formatPaymentMethod(method: string) {
  if (method === 'wave') return 'Wave';
  if (method === 'orange-money') return 'Orange Money';
  return 'Carte bancaire';
}

export async function sendBookingConfirmationEmail(booking: Booking) {
  if (!isConfigured()) {
    console.warn('[EmailJS] Non configuré — ajoutez les variables VITE_EMAILJS_* dans votre .env');
    return;
  }
  await emailjs.send(
    SERVICE_ID,
    CUSTOMER_TEMPLATE,
    {
      to_email: booking.customerEmail,
      to_name: booking.customerName,
      booking_id: booking.id,
      pack_name: booking.packName,
      booking_date: new Date(booking.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      number_of_people: booking.numberOfPeople,
      total_amount: booking.totalAmount.toLocaleString(),
      payment_method: formatPaymentMethod(booking.paymentMethod),
      payment_status:
        booking.paymentStatus === 'confirmed' ? 'Confirmé ✓' : 'En attente de confirmation',
    },
    PUBLIC_KEY
  );
}

export async function sendAdminNotificationEmail(booking: Booking) {
  if (!isConfigured() || !ADMIN_TEMPLATE) return;
  await emailjs.send(
    SERVICE_ID,
    ADMIN_TEMPLATE,
    {
      booking_id: booking.id,
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      customer_phone: booking.customerPhone,
      pack_name: booking.packName,
      booking_date: new Date(booking.date).toLocaleDateString('fr-FR'),
      number_of_people: booking.numberOfPeople,
      total_amount: booking.totalAmount.toLocaleString(),
      payment_method: formatPaymentMethod(booking.paymentMethod),
    },
    PUBLIC_KEY
  );
}
