import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Booking {
  id: string;
  packName: string;
  packPrice: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  numberOfPeople: number;
  paymentMethod: 'wave' | 'orange-money' | 'card';
  paymentStatus: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  emailSent: boolean;
  createdAt: Date;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'emailSent'>) => Booking;
  updateBookingStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  markEmailSent: (id: string) => void;
  getBookingsByDate: (date: Date) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'lacrose_bookings';

type StoredBooking = Omit<Booking, 'date' | 'createdAt'> & { date: string; createdAt: string };

function parseStoredBookings(value: string | null): Booking[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as StoredBooking[];
    return parsed.map((booking) => ({
      ...booking,
      date: new Date(booking.date),
      createdAt: new Date(booking.createdAt),
    }));
  } catch {
    return [];
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window === 'undefined') return [];
    return parseStoredBookings(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'emailSent'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `BK${Date.now()}`,
      createdAt: new Date(),
      emailSent: false,
    };
    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, paymentStatus: status } : booking
      )
    );
  };

  const markEmailSent = (id: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, emailSent: true } : booking
      )
    );
  };

  const getBookingsByDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <BookingContext.Provider
      value={{ bookings, addBooking, updateBookingStatus, markEmailSent, getBookingsByDate }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
