'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/utils/jwt';
export default function Navbar() {
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lastScrollY]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    router.push('/login');
  };
  const isHomepage = pathname === '/';
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-20 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isHomepage ? 'bg-transparent text-white' : 'bg-dark-blue shadow-md text-light-text'}`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          EventHub
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/events" className="hover:text-magenta transition-colors">
            Events
          </Link>
          {userRole ? (
            <>
              {userRole === 'ADMIN' && (
                <Link href="/admin/dashboard" className="hover:text-magenta transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="hover:text-magenta transition-colors">
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
            <Link href="/login" className="bg-magenta hover:bg-opacity-80 text-white font-semibold px-4 py-2 rounded-full">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}