import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
          <Link href="#" className="hover:text-blue-400 transition-colors">
            Tentang Kami
          </Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">
            Kontak
          </Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">
            Kebijakan Privasi
          </Link>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} EventHub. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}