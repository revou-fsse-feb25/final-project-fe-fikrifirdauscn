// src/app/events/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api';
import EventCard from '@/components/EventCard';
import { useRouter } from 'next/navigation';

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
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();

  const fetchEvents = useCallback(async (name: string, categoryId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: { name?: string, categoryId?: string } = {};
      if (name) params.name = name;
      if (categoryId) params.categoryId = categoryId;

      const response = await apiClient.get('/events', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params,
      });
      setEvents(response.data);
      setError(null);
    } catch (err: any) {
      setError('Gagal mengambil data event. Mohon coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get('/categories', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEvents(searchTerm, selectedCategory);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedCategory, fetchEvents]);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-light-text">
      <h1 className="text-3xl font-bold text-center mb-8">Daftar Event</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari event atau artis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded bg-dark-blue border border-gray-600"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-auto p-2 rounded bg-dark-blue border border-gray-600"
        >
          <option value="">Semua Kategori</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }} className="p-2 rounded bg-magenta text-white hover:bg-opacity-80">
          Reset
        </button>
      </div>
      {loading ? (
        <div className="text-center text-light-text">Memuat...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="text-center text-gray-500 col-span-full">Tidak ada event yang ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}