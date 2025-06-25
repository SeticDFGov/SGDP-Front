'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {  useAuth } from '@/app/contexts/AuthContext';
import jwtDecode from 'jwt-decode';
import { URL_AUTH_SERVICE } from '../consts/consts';

export default function PrivateRoute({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, loading, Token } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (loading) {
        return;
      }

      if (!isAuthenticated) {
        router.push('/auth');
        return;
      }
     
      if (user && user.Email) {
        console.log("aosdiaops")
        try {
          const response = await fetch(`${URL_AUTH_SERVICE}/user/${encodeURIComponent(user.Email)}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
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
  }, [isAuthenticated, loading, user, Token, router]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;

      if (!isAuthenticated) {
        router.push('/auth');
        return;
      }

      // Verificar se o usuário tem perfil admin
      const email = user?.email || user?.Email;
      console.log(email)
      if (user && email) {
        try {
          const response = await fetch(`${URL_AUTH_SERVICE}/user/${encodeURIComponent(email)}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            router.push('/auth');
            return;
          }

          const userData = await response.json();
          // Considere 'admin' ou 'Admin'
          if (userData.Perfil?.toLowerCase() === 'admin') {
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
  }, [isAuthenticated, loading, user, Token, router]);

  if (loading || checkingAdmin) {
    return <div className="text-center mt-10">Verificando permissões...</div>;
  }

  if (!isAuthenticated) {
    router.push("/auth");
    return null;
  }

  return <>{children}</>;
}
