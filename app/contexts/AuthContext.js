"use client"

import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import { URL_AUTH_SERVICE } from "../consts/consts";


const AuthContext = createContext();

async function fetchUserData(email) {
  const res = await fetch(`${URL_AUTH_SERVICE}/user/${encodeURIComponent(email)}`, {
    headers: {
      "Content-Type": "application/json",
    
    }
  });
  if (!res.ok) throw new Error("Erro ao buscar dados do usuário");
  return await res.json();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [Token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      try {
        const decoded = jwtDecode(token);

        // Verifica expiração do token
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          logout();
          setLoading(false);
          return;
        }

        fetchUserData(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"])
          .then(setUser)
          .catch(() => {
            logout();
            setLoading(false);
          })
          .finally(() => setLoading(false));
      } catch (err) {
        console.error("Token inválido", err);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Desloga automaticamente quando o token expirar durante a sessão
  useEffect(() => {
    if (!Token) return;
    let decoded;
    try {
      decoded = jwtDecode(Token);
    } catch {
      logout();
      return;
    }
    if (!decoded.exp) return;
    const now = Date.now() / 1000;
    const timeout = (decoded.exp - now) * 1000;
    if (timeout > 0) {
      const timer = setTimeout(() => {
        logout();
      }, timeout);
      return () => clearTimeout(timer);
    } else {
      logout();
    }
  }, [Token]);

  const login = async (email, senha) => {
    try {
      const res = await fetch(URL_AUTH_SERVICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Senha: senha }),
      });

      if (!res.ok) throw new Error("Falha no login");

      const data = await res.json();
      localStorage.setItem("token", data.token);

      // Buscar dados do usuário pela API
      const userData = await fetchUserData(email, data.token);
      setUser(userData);
      setToken(data.token);

      router.push("/");
    } catch (err) {
      console.error("Erro ao logar:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, Token, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}