import emailjs from '@emailjs/browser';
import { Booking } from '../app/context/BookingContext';

const SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
const CUSTOMER_TEMPLATE = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID ?? '';
const WEB3FORMS_KEY    = import.meta.env.VITE_WEB3FORMS_KEY ?? '';

function formatPaymentMethod(method: string) {
  if (method === 'wave') return 'Wave';
  if (method === 'orange-money') return 'Orange Money';
  return 'Carte bancaire';
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/* ─── Notification admin via Web3Forms (toujours fonctionnel) ─── */
export async function sendAdminNotificationEmail(booking: Booking) {
  if (!WEB3FORMS_KEY) return;
  await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `🏍️ Nouvelle réservation — ${booking.packName}`,
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone ?? '',
      message: `
Nouvelle réservation reçue !

👤 Client : ${booking.customerName}
📧 Email : ${booking.customerEmail}
📞 Téléphone : ${booking.customerPhone ?? 'Non renseigné'}

🏍️ Pack : ${booking.packName}
📅 Date : ${formatDate(booking.date)}
👥 Personnes : ${booking.numberOfPeople}
💰 Total : ${booking.totalAmount.toLocaleString()} FCFA
💳 Paiement : ${formatPaymentMethod(booking.paymentMethod)}
📌 Statut : ${booking.paymentStatus === 'confirmed' ? 'Confirmé ✅' : 'En attente ⏳'}
      `.trim(),
    }),
  });
}

/* ─── Confirmation client via EmailJS (optionnel) ─── */
export async function sendBookingConfirmationEmail(booking: Booking) {
  if (!SERVICE_ID || !PUBLIC_KEY || !CUSTOMER_TEMPLATE) return;
  try {
    await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE, {
      to_email: booking.customerEmail,
      to_name: booking.customerName,
      booking_id: booking.id,
      pack_name: booking.packName,
      booking_date: formatDate(booking.date),
      number_of_people: booking.numberOfPeople,
      total_amount: booking.totalAmount.toLocaleString(),
      payment_method: formatPaymentMethod(booking.paymentMethod),
      payment_status: booking.paymentStatus === 'confirmed' ? 'Confirmé ✓' : 'En attente',
    }, PUBLIC_KEY);
  } catch {
    // EmailJS optionnel — ne bloque pas le flux
  }
}
