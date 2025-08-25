import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    artist: string;
    price: number;
    imageUrl?: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative w-full h-48">
        <Image
          src={event.imageUrl || 'https://via.placeholder.com/400x300'}
          alt={event.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{event.name}</h3>
        <p className="text-sm text-gray-500 mt-2">{event.artist}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(event.date).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">{event.location}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">
            Rp {event.price.toLocaleString('id-ID')}
          </span>
          <Link
            href={`/events/${event.id}`}
            className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}