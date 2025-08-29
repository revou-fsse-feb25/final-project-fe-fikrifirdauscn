// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic'; // aman untuk halaman yang bergantung pada URL/localStorage

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-light-text">Memuat…</div>}>
      <DashboardClient />
    </Suspense>
  );
}
