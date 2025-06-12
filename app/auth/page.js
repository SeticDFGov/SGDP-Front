"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Importa o useRouter do Next.js
import { useAuth } from "../contexts/AuthContext";



const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter(); // Inicia o useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha);
    } catch {
      setError('Email ou senha inválidos.');
    }
  }; 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={carregando}
        >
          {carregando ? "Autenticando..." : "Entrar"}
        </button>

        {mensagem && (
          <div className="mt-4 text-sm text-center text-red-600">
            {mensagem}
          </div>
        )}
      </form>
    </div>
  );
}  
export default Login;
