"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = false;
      const userRole = localStorage.getItem('userRole');

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      switch(userRole) {
        case 'admin':
          router.push('/admin/users');
          break;
        case 'hr':
          router.push('/hr/attendance');
          break;
        case 'manager':
          router.push('/manager/team');
          break;
        case 'employee':
          router.push('/employee/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Chargement de Mozart ERP...</p>
      </div>
    </div>
  );
}
