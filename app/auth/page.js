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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha);
    } catch {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: "url('/login2.jpg')" }}
    >
      {/* Container do formulário ocupando toda a altura da tela */}
      <div className="w-1/3 min-h-screen bg-blue-900 bg-opacity-90 flex flex-col justify-center p-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Bem-Vindo</h2>
  
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-600"
            required
          />
  
          <div className="flex items-center justify-between text-sm text-white">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-white" />
              <span>Lembrar senha</span>
            </label>
          </div>
  
          <button
            type="submit"
            className="w-full bg-green-400 text-white font-semibold py-2 rounded-full hover:bg-green-500 transition"
            disabled={carregando}
          >
            {carregando ? "Autenticando..." : "Entrar"}
          </button>
  
          {mensagem && (
            <div className="text-sm text-red-100 text-center mt-2">
              {mensagem}
            </div>
          )}
        </form>
      </div>
  
   
      <div className="w-1/2 hidden md:block" />
    </div>
  );
}  
export default Login;