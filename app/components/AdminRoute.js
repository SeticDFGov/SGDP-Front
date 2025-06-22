'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function AdminRoute({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;

      if (!isAuthenticated) {
        router.push('/auth');
        return;
      }

      // Verificar se o usuário tem perfil admin
      if (user && user.email) {
        try {
          const response = await fetch(`http://localhost:5148/api/auth/user/${user.email}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            router.push('/auth');
            return;
          }

          const userData = await response.json();
          if (userData.Perfil === 'admin') {
            setIsAdmin(true);
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Erro ao verificar perfil admin:', error);
          router.push('/auth');
        } finally {
          setCheckingAdmin(false);
        }
      } else {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, loading, user, router]);

  if (loading || checkingAdmin) {
    return <div className="text-center mt-10">Verificando permissões...</div>;
  }

  return isAdmin ? children : null;
} 