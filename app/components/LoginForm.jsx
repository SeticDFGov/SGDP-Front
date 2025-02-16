"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Obtém o objeto do roteador

  const handleLogin = () => {
    if (username === "admin" && password === "@admin") {
      localStorage.setItem("authenticated", "true"); // Guarda o estado de login
      router.push("/"); // Redireciona para a página raiz após login bem-sucedido
    } else {
      setError("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen text-black bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center ">Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Usuário"
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 mt-4 rounded"
          onClick={handleLogin}
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
