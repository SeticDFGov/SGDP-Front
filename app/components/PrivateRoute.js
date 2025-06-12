'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {  useAuth } from '@/app/contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const router = useRouter();
   const { user,isAuthenticated, loading } = useAuth();
useEffect(() => {
  if (loading) return;

  if (!isAuthenticated) {
    router.push('/auth');
    return;
  }
  console.log('user', user);
  if (!user?.unidade) {
    router.push('/auth/unidade');
  }
}, [isAuthenticated, loading, user, router]);
;

  if (loading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return isAuthenticated ? children : null;
}
