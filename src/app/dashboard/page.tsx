import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-light-text">Memuat…</div>}>
      <DashboardClient />
    </Suspense>
  );
}
