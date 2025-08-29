// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/utils/jwt';
import Link from 'next/link';

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
  const pathname = usePathname();

  const fetchAllBookings = useCallback(async () => {
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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Gagal mengambil data booking.');
      } else {
        setError('Gagal mengambil data booking.');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-light-text">Memuat...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="container mx-auto px-4 py-8 text-light-text">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard Admin</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        <Link 
          href="/admin/dashboard" 
          className={`p-4 rounded-lg shadow-md transition-colors ${isActive('/admin/dashboard') ? 'bg-magenta text-white' : 'bg-light-dark-blue hover:bg-opacity-80'}`}
        >
          Lihat Semua Pemesanan
        </Link>
        <Link 
          href="/admin/dashboard/events" 
          className={`p-4 rounded-lg shadow-md transition-colors ${isActive('/admin/dashboard/events') ? 'bg-light-dark-blue hover:bg-opacity-80' : 'bg-dark-blue hover:bg-light-dark-blue'}`}
        >
          Kelola Event
        </Link>
      </div>

      <div className="bg-light-dark-blue rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Semua Pemesanan</h2>
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left bg-light-dark-blue">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Event</th>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Pembeli</th>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Jumlah Tiket</th>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-700">
                    <td className="py-2 px-4 text-gray-200">{booking.event.name}</td>
                    <td className="py-2 px-4 text-gray-200">{booking.user.name || booking.user.email}</td>
                    <td className="py-2 px-4 text-gray-200">{booking.numberOfTickets}</td>
                    <td className="py-2 px-4 text-gray-200">Rp {booking.totalPrice.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">Belum ada pemesanan tiket.</p>
        )}
      </div>
    </div>
  );
}