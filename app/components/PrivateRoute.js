'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {  useAuth } from '@/app/contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const router = useRouter();
   const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth'); // ou onde for sua rota pública
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return isAuthenticated ? children : null;
}
