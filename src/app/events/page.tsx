// src/app/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import EventCard from '@/components/EventCard';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  artist: string;
  price: number;
  imageUrl?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get('/events'); // <-- Tidak perlu token lagi
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
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">Tidak ada event yang ditemukan.</p>
        )}
      </div>
    </div>
  );
}