// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: string;
  numberOfTickets: number;
  totalPrice: number;
  bookingDate: string;
  event: {
    name: string;
    date: string;
    location: string;
  };
}

export default function UserDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await apiClient.get('/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message || 'Gagal mengambil data booking. Mohon coba lagi.');
      } else {
        setError('Gagal mengambil data booking. Mohon coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (searchParams.get('bookingSuccess') === 'true') {
      setShowNotification(true);
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      await apiClient.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Pemesanan berhasil dibatalkan!');

      // Perbarui state secara lokal
      setBookings(bookings.filter(booking => booking.id !== bookingId));

    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membatalkan pesanan.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-light-text">Memuat...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-light-text">
      <h1 className="text-3xl font-bold text-center mb-8">Tiket Saya</h1>

      {showNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 p-4 bg-green-500 text-white rounded-lg shadow-xl z-50">
          Tiket telah dikirimkan ke email kamu.
        </div>
      )}

      <div className="bg-light-dark-blue rounded-lg shadow-xl p-6">
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 bg-light-dark-blue rounded-lg shadow border border-gray-600">
                <p className="font-bold text-lg">{booking.event.name}</p>
                <p className="text-sm text-gray-400 mt-1">Tanggal Event: {new Date(booking.event.date).toLocaleString()}</p>
                <p className="text-sm text-gray-400">Lokasi: {booking.event.location}</p>
                <p className="text-sm mt-2">Jumlah Tiket: {booking.numberOfTickets}</p>
                <p className="font-semibold mt-2">Total Harga: Rp {booking.totalPrice.toLocaleString('id-ID')}</p>
                <button 
                  onClick={() => handleCancelBooking(booking.id)}
                  className="mt-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors"
                >
                  Batalkan Pesanan
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>Anda belum memiliki pemesanan tiket.</p>
            <Link href="/events" className="text-blue-400 mt-2 block hover:underline">
              Lihat semua event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}