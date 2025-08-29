'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/utils/jwt';
import EventForm from '@/components/EventForm';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  artist: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  imageUrl?: string;
  categoryId?: string;
  category?: { name: string };
}

type ApiError = { response?: { data?: { message?: string } } };
const errMsg = (e: unknown, fallback: string) =>
  (typeof e === 'object' && e !== null && 'response' in e
    ? (e as ApiError).response?.data?.message ?? fallback
    : fallback);

export default function AdminManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await apiClient.get<Event[]>('/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setError(null);
    } catch (e: unknown) {
      setError(errMsg(e, 'Gagal mengambil data event.'));
    } finally {
      setLoading(false);
      setIsFormVisible(false);
      setSelectedEvent(null);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.role !== 'ADMIN') {
        alert('Akses ditolak. Anda bukan admin.');
        router.push('/');
      } else {
        fetchEvents();
      }
    } else {
      router.push('/login');
    }
  }, [router, fetchEvents]);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');
      await apiClient.delete<void>(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Event berhasil dihapus!');
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (e: unknown) {
      alert(errMsg(e, 'Gagal menghapus event.'));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-light-text">Memuat...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="container mx-auto px-4 py-8 text-light-text">
      <h1 className="text-3xl font-bold text-center mb-8">Manajemen Event</h1>

      <div className="flex justify-center space-x-4 mb-8">
        <Link
          href="/admin/dashboard"
          className={`p-4 rounded-lg shadow-md transition-colors ${isActive('/admin/dashboard') ? 'bg-light-dark-blue hover:bg-opacity-80' : 'bg-dark-blue hover:bg-light-dark-blue'}`}
        >
          Lihat Semua Pemesanan
        </Link>
        <Link
          href="/admin/dashboard/events"
          className={`p-4 rounded-lg shadow-md transition-colors ${isActive('/admin/dashboard/events') ? 'bg-magenta text-white' : 'bg-light-dark-blue hover:bg-opacity-80'}`}
        >
          Kelola Event
        </Link>
      </div>

      <div className="bg-light-dark-blue rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Daftar Event</h2>
          <button
            onClick={() => { setIsFormVisible(v => !v); setSelectedEvent(null); }}
            className="bg-magenta text-white p-2 rounded hover:bg-opacity-80"
          >
            {isFormVisible ? 'Tutup Form' : 'Tambah Event'}
          </button>
        </div>

        {isFormVisible && (
          <div className="mb-8 p-4 border rounded border-gray-600">
            <h3 className="text-lg font-bold mb-4">{selectedEvent ? 'Edit Event' : 'Tambah Event'}</h3>
            <EventForm initialEvent={selectedEvent ?? undefined} onSuccess={fetchEvents} />
          </div>
        )}

        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left bg-light-dark-blue">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Nama</th>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Tanggal</th>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Harga</th>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Tiket Tersedia</th>
                  <th className="py-2 px-4 border-b border-gray-600 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-700">
                    <td className="py-2 px-4 text-gray-200">{event.name}</td>
                    <td className="py-2 px-4 text-gray-200">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-gray-200">Rp {event.price.toLocaleString('id-ID')}</td>
                    <td className="py-2 px-4 text-gray-200">{event.availableTickets}/{event.totalTickets}</td>
                    <td className="py-2 px-4 text-gray-200 space-x-2">
                      <button onClick={() => { setSelectedEvent(event); setIsFormVisible(true); }} className="bg-yellow-500 text-white p-1 rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white p-1 rounded text-sm">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">Tidak ada event untuk dikelola.</p>
        )}
      </div>
    </div>
  );
}
