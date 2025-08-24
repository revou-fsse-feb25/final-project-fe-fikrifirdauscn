'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';


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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
       
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login untuk melihat event.');
          setLoading(false);
          return;
        }

        const response = await apiClient.get('/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
      } catch (err: any) {
        setError('Gagal mengambil data event. Mohon coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Memuat...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daftar Event</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={event.imageUrl || 'https://via.placeholder.com/400x300'} alt={event.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{event.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{event.artist}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">{event.location}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    Rp {event.price.toLocaleString('id-ID')}
                  </span>
                  <a href={`/events/${event.id}`} className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
                    Lihat Detail
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">Tidak ada event yang ditemukan.</p>
        )}
      </div>
    </div>
  );
}