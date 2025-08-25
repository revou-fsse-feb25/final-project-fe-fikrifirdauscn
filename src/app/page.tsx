import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <Image
        src="https://images.unsplash.com/photo-1549497554-1823126f58f4?q=80&w=2940&auto=format&fit=crop"
        alt="Konser musik"
        layout="fill"
        objectFit="cover"
        className="absolute z-0 opacity-50"
      />
      <div className="relative z-10 text-center p-8 bg-gray-800 bg-opacity-70 rounded-lg shadow-xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Temukan Event Musik Terbaik
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300">
          Jelajahi konser, festival, dan acara lainnya.
        </p>
        <Link
          href="/events"
          className="mt-8 inline-block px-8 py-4 text-lg font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Lihat Semua Event
        </Link>
      </div>
    </div>
  );
}