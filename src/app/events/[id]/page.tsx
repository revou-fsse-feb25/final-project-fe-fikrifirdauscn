// src/app/events/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location: string;
  artist: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  imageUrl?: string;
  category?: {
    name: string;
  };
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiClient.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err: any) {
        setError('Event tidak ditemukan atau gagal mengambil data.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleBooking = async () => {
    setBookingMessage(null);
    setBookingError(null);
    if (!event) return;

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectUrl', window.location.pathname);
      router.push('/login');
      return;
    }

    try {
      await apiClient.post(
        '/bookings',
        {
          eventId: event.id,
          numberOfTickets,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookingMessage(`Booking berhasil! Anda memesan ${numberOfTickets} tiket.`);
      setEvent({
        ...event,
        availableTickets: event.availableTickets - numberOfTickets,
      });
    } catch (err: any) {
      if (err.response) {
        setBookingError(err.response.data.message);
      } else {
        setBookingError('Terjadi kesalahan saat memesan. Mohon coba lagi.');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Memuat...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="flex justify-center items-center min-h-screen">Event tidak ditemukan.</div>;
  }

  const totalHarga = event.price * numberOfTickets;

  return (
    <div className="bg-gradient-to-br from-dark-blue via-light-dark-blue to-magenta min-h-screen text-light-text">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-light-dark-blue rounded-lg shadow-xl overflow-hidden md:flex">
          <div className="relative md:w-1/2 h-96">
            <Image
              src={event.imageUrl || 'https://via.placeholder.com/600x400'}
              alt={event.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-light-text">{event.name}</h1>
              <p className="text-xl text-gray-400 mt-2">{event.artist}</p>
              <p className="text-gray-300 text-sm mt-4">{event.description}</p>

              <div className="mt-6 space-y-2 text-gray-200">
                <p className="flex items-center">
                  <span className="font-semibold w-24">Tanggal:</span> {new Date(event.date).toLocaleString()}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold w-24">Lokasi:</span> {event.location}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold w-24">Harga:</span> Rp {event.price.toLocaleString('id-ID')}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold w-24">Kategori:</span> {event.category?.name || 'Tidak Ada'}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-600 pt-4">
              <h3 className="text-xl font-bold mb-4">Pesan Tiket</h3>
              {bookingMessage && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{bookingMessage}</div>
              )}
              {bookingError && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{bookingError}</div>
              )}
              <p className="mb-2">Tersedia: {event.availableTickets} tiket</p>
              <div className="flex items-center gap-4">
                <label htmlFor="tickets" className="font-medium">Jumlah Tiket:</label>
                <input
                  type="number"
                  id="tickets"
                  value={numberOfTickets}
                  onChange={(e) => setNumberOfTickets(parseInt(e.target.value) || 1)}
                  min="1"
                  max={event.availableTickets}
                  className="w-20 border rounded px-2 py-1 text-center text-dark-blue"
                />
                <span className="text-lg font-bold">Total: Rp {totalHarga.toLocaleString('id-ID')}</span>
              </div>
              <button
                onClick={handleBooking}
                className="mt-6 bg-magenta text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-80 transition-colors disabled:bg-gray-400"
                disabled={numberOfTickets > event.availableTickets || event.availableTickets === 0}
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}