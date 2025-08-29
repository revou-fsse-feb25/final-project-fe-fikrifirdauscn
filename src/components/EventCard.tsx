import Link from "next/link";
import Image from "next/image";
interface EventCardProps {
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    artist: string;
    imageUrl?: string;
  };
}
export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return (
    <Link href={`/events/${event.id}`}>
      <div className="flex-none w-72 bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer">
        <div className="relative w-full h-48">
          <Image
            src={event.imageUrl || 'https://via.placeholder.com/400x300'}
            alt={event.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 bg-purple-700 text-white px-4 py-2 text-sm font-semibold">
            {formattedDate}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{event.name}</h3>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </p>
        </div>
      </div>
    </Link>
  );
}