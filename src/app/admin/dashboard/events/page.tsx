// src/app/admin/dashboard/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/utils/jwt';
import EventForm from '@/components/EventForm';

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
  category?: {
    name: string;
  };
}

export default function AdminManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const response = await apiClient.get('/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data event.');
    } finally {
      setLoading(false);
      setIsFormVisible(false);
      setSelectedEvent(null);
    }
  };

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
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      await apiClient.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Event berhasil dihapus!');
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus event.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Memuat...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Manajemen Event</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Daftar Event</h2>
          <button onClick={() => { setIsFormVisible(!isFormVisible); setSelectedEvent(null); }} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
            {isFormVisible ? 'Tutup Form' : 'Tambah Event'}
          </button>
        </div>

        {isFormVisible && (
          <div className="mb-8 p-4 border rounded">
            <h3 className="text-lg font-bold mb-4">{selectedEvent ? 'Edit Event' : 'Tambah Event'}</h3>
            <EventForm initialEvent={selectedEvent ?? undefined} onSuccess={fetchEvents} />
          </div>
        )}

        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Nama</th>
                  <th className="py-2 px-4 border-b">Tanggal</th>
                  <th className="py-2 px-4 border-b">Harga</th>
                  <th className="py-2 px-4 border-b">Tiket Tersedia</th>
                  <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="py-2 px-4 border-b text-center">{event.name}</td>
                    <td className="py-2 px-4 border-b text-center">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-center">Rp {event.price.toLocaleString('id-ID')}</td>
                    <td className="py-2 px-4 border-b text-center">{event.availableTickets}/{event.totalTickets}</td>
                    <td className="py-2 px-4 border-b text-center space-x-2">
                      <button onClick={() => { setSelectedEvent(event); setIsFormVisible(true); }} className="bg-yellow-500 text-white p-1 rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white p-1 rounded text-sm">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">Tidak ada event untuk dikelola.</p>
        )}
      </div>
    </div>
  );
}