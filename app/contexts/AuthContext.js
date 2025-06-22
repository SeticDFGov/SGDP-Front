"use client"
const URL_AUTH_SERVICE =process.env.NEXT_PUBLIC_API_URL || "http://localhost:5148/api/Auth";

import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";


const AuthContext = createContext();

function mapUserClaims(user) {
  if (!user) return null;

  return {
    nome: user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "",
    email: user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
    unidade: user["Unidade"] || "",
    perfil: user["Perfil"]
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [Token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      setToken(token)
      try {
        const decoded = jwtDecode(token);
        const mappedUser = mapUserClaims(decoded);
        setUser(mappedUser);
      } catch (err) {
        console.error("Token inválido", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

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
      const decoded = jwtDecode(data.token);
      const mappedUser = mapUserClaims(decoded);
      setUser(mappedUser);
      router.push("/");
    } catch (err) {
      console.error("Erro ao logar:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, Token,login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}