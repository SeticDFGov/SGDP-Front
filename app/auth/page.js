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
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: "url('/login2.jpg')" }}
    >
      {/* Container do formulário ocupando toda a altura da tela */}
      <div className="w-1/3 min-h-screen bg-blue-900 bg-opacity-90 flex flex-col justify-center p-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Bem-Vindo</h2>
  
        <form onSubmit={autenticar} className="space-y-5">
          <input
            type="text"
            placeholder="E-mail"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
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
  
      {/* O espaço restante da imagem de fundo é automaticamente ocupado */}
      <div className="w-1/2 hidden md:block" />
    </div>
  );
}  
export default Login;
