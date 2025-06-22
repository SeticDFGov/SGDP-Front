'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {  useAuth } from '@/app/contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (loading) {
        return;
      }

      if (!isAuthenticated) {
        router.push('/auth');
        return;
      }
     
      if (user && user.email) {
        try {

          const response = await fetch(`http://localhost:5148/api/auth/user/${user.email}`);
          console.log(response)
          if (!response.ok) {
          
            router.push('/auth');
            return;
          }

          const userData = await response.json();
          if (userData.Unidade === null) {
            
            router.push('/auth/unidade');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário via API:', error);
          router.push('/auth');
        }
      } else if (isAuthenticated) {
       
        console.error('Usuário autenticado mas sem email para verificação.');
        router.push('/auth');
      }
    };

    checkUserStatus();
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return isAuthenticated ? children : null;
}
