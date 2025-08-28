'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/utils/jwt';

export default function Navbar() {
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUserRole(decodedToken.role);
      } else {
        setUserRole(null);
        localStorage.removeItem('token');
      }
    } else {
      setUserRole(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    router.push('/login');
  };
  
  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          EventHub
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/events" className="text-gray-600 hover:text-blue-500 transition-colors">
            Events
          </Link>
          {userRole ? (
            <>
              {userRole === 'ADMIN' && (
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-500 transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 transition-colors">
                Dashboard Saya
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-600">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}