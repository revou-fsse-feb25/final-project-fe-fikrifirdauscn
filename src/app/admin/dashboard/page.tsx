'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/utils/jwt';

interface Booking {
  id: string;
  numberOfTickets: number;
  totalPrice: number;
  bookingDate: string;
  user: {
    name: string | null;
    email: string;
  };
  event: {
    name: string;
    date: string;
    location: string;
  };
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const decodedToken = decodeToken(token);
        if (!decodedToken || decodedToken.role !== 'ADMIN') {
          alert('Akses ditolak. Anda bukan admin.');
          router.push('/');
          return;
        }

        const response = await apiClient.get('/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err: any) {
        setError('Gagal mengambil data booking.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Memuat...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard Admin</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Semua Pemesanan</h2>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border-b pb-4">
                <p className="font-bold text-gray-800">Event: {booking.event.name}</p>
                <p className="text-sm text-gray-600 mt-1">Oleh: {booking.user.name || booking.user.email}</p>
                <p className="text-sm text-gray-600">Tanggal Pesan: {new Date(booking.bookingDate).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Jumlah Tiket: {booking.numberOfTickets}</p>
                <p className="font-semibold mt-2">Total Harga: Rp {booking.totalPrice.toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Belum ada pemesanan tiket.</p>
        )}
      </div>
    </div>
  );
}