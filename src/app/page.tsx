'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/services/api";
import EventCard from "@/components/EventCard";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  artist: string;
  imageUrl?: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get('/events', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setEvents(response.data.slice(0, 3));
      } catch (err: any) {
        setError('Gagal mengambil data event.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const uniqueArtists = Array.from(new Set(events.map(event => event.artist)));

  return (
    <div className="bg-dark-blue">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1549497554-1823126f58f4?q=80&w=2940&auto=format&fit=crop"
          alt="Konser musik"
          layout="fill"
          objectFit="cover"
          className="absolute z-0 opacity-40"
          unoptimized={true}
        />
        <div className="relative z-10 text-center p-8">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight font-serif italic text-white drop-shadow-xl">
            Feel the heart beats
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-300">
            Nikmati malam penuh musik dengan pengalaman yang tak terlupakan.
          </p>
          <a
            href="#upcoming-events"
            className="mt-8 inline-block px-8 py-4 text-lg font-bold bg-magenta text-white rounded-full hover:bg-opacity-80 transition-colors"
          >
            Lihat Semua Event
          </a>
        </div>
      </div>

      {/* Upcoming Concerts Section */}
      <div id="upcoming-events" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-light-text mb-12">Konser Mendatang</h2>
        {loading ? (
          <div className="text-center text-light-text">Memuat konser...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : events.length > 0 ? (
          <div className="flex space-x-6 overflow-x-scroll scrollbar-hide">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Tidak ada event yang akan datang.</div>
        )}
      </div>

      {/* Artist Lineup Section */}
      {uniqueArtists.length > 0 && (
        <div className="container mx-auto px-4 py-16 text-light-text">
          <h2 className="text-4xl font-bold text-center mb-12">Lineup Terbaru</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uniqueArtists.map((artist, index) => (
              <div key={index} className="p-6 bg-light-dark-blue rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{artist}</h3>
                <p className="text-gray-400">Tampil di konser mendatang</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 py-16 text-light-text">
        <h2 className="text-4xl font-bold text-center mb-12">Mengapa Memilih Kami?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-light-dark-blue rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-magenta" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm-5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pemesanan Mudah</h3>
            <p className="text-gray-400">Pesan tiket hanya dalam beberapa klik dengan antarmuka yang ramah pengguna.</p>
          </div>
          <div className="p-6 bg-light-dark-blue rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-magenta" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h3a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Event Terkini</h3>
            <p className="text-gray-400">Dapatkan akses ke konser-konser terbaru dan paling dinanti.</p>
          </div>
          <div className="p-6 bg-light-dark-blue rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-magenta" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pembayaran Aman</h3>
            <p className="text-gray-400">Nikmati pengalaman pemesanan dengan sistem pembayaran yang terjamin aman.</p>
          </div>
        </div>
      </div>
    </div>
  );
}