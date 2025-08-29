// src/components/EventForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

interface EventFormProps {
  initialEvent?: {
    id: string;
    name: string;
    description?: string;
    date: string; // ISO string
    location: string;
    artist: string;
    price: number;
    totalTickets: number;
    imageUrl?: string;
    categoryId?: string;
  };
  onSuccess: () => void;
}

type EventPayload = {
  name: string;
  description: string;
  date: string; // 'YYYY-MM-DDTHH:mm'
  location: string;
  artist: string;
  price: number;
  totalTickets: number;
  imageUrl: string;
  categoryId: string;
};

interface Category {
  id: string;
  name: string;
}

export default function EventForm({ initialEvent, onSuccess }: EventFormProps) {
  const [formData, setFormData] = useState<EventPayload>({
    name: '',
    description: '',
    date: '',
    location: '',
    artist: '',
    price: 0,
    totalTickets: 0,
    imageUrl: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!initialEvent;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get('/categories', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCategories(response.data as Category[]);
      } catch {
        // sengaja diabaikan: kategori gagal fetch tidak memblok form
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && initialEvent) {
      setFormData({
        name: initialEvent.name || '',
        description: initialEvent.description || '',
        date: initialEvent.date ? initialEvent.date.slice(0, 16) : '',
        location: initialEvent.location || '',
        artist: initialEvent.artist || '',
        price: initialEvent.price,
        totalTickets: initialEvent.totalTickets,
        imageUrl: initialEvent.imageUrl || '',
        categoryId: initialEvent.categoryId || '',
      });
    }
  }, [initialEvent, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['price', 'totalTickets'].includes(name) ? Number(value) : value,
    }) as EventPayload);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Anda harus login untuk melanjutkan.');
      setLoading(false);
      return;
    }

    try {
      if (isEditMode && initialEvent) {
        await apiClient.patch(`/events/${initialEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Event berhasil diperbarui!');
      } else {
        await apiClient.post('/events', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Event berhasil ditambahkan!');
      }
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Terjadi kesalahan saat menyimpan event.');
      } else {
        setError('Terjadi kesalahan saat menyimpan event.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-gray-700">Nama Event</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Deskripsi</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Tanggal & Waktu</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Lokasi</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Artis</label>
        <input
          type="text"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Harga Tiket</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Total Tiket</label>
        <input
          type="number"
          name="totalTickets"
          value={formData.totalTickets}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">URL Gambar</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Kategori</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isEditMode ? 'Simpan Perubahan' : 'Tambahkan Event'}
      </button>
    </form>
  );
}
