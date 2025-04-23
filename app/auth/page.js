"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Importa o useRouter do Next.js

const API_URL = process.env.NEXT_PUBLIC_API_URL_AUTH || "http://localhost:8000/autenticar";

const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter(); // Inicia o useRouter

  const autenticar = async (e) => {
    e.preventDefault();
    setMensagem(null);
    setCarregando(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      const data = await response.json();

      if (data.success) {
        // Armazena o estado de autenticação no localStorage com chave "authenticated"
        localStorage.setItem("authenticated", "true"); // Estado de autenticação
        localStorage.setItem("user_info", JSON.stringify(data.user_info)); // Armazenando as informações do usuário

        setMensagem(`Bem-vindo(a), ${data.user_info.display_name || data.user_info.nome_completo}!`);

        // Redireciona para a página principal após sucesso
        router.push("/"); // Redireciona para a página principal
      } else {
        setMensagem("Falha na autenticação: " + (data.message || "Credenciais inválidas."));
      }
    } catch (error) {
      setMensagem("Erro na requisição: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={autenticar} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
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
};

export default Login;
