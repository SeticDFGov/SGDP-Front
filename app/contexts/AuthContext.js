"use client"
const URL_AUTH_SERVICE =process.env.NEXT_PUBLIC_API_URL || "http://localhost:5148/api/Auth";

import { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token inválido", err);
        logout();
      }
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const res = await fetch(URL_AUTH_SERVICE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Senha: senha }),
      });

      if (!res.ok) throw new Error('Falha no login');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      const decoded = jwt_decode(data.token);
      setUser(decoded);
      router.push('/'); // ou a rota protegida desejada
    } catch (err) {
      console.error('Erro ao logar:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
