// src/app/events/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchEvents = useCallback(async () => {
    try {
      const response = await apiClient.get('/events');
      setEvents(response.data as Event[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Gagal mengambil data event. Mohon coba lagi.');
      } else {
        setError('Gagal mengambil data event. Mohon coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-light-text">
        Memuat...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-light-text">
      <h1 className="text-3xl font-bold text-center mb-8">Daftar Event</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Tidak ada event yang ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
