"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Obtém o objeto do roteador
  const { data: session } = useSession();



  const handleLogin = () => {
    if (username === "admin" && password === "@admin") {
      localStorage.setItem("authenticated", "true"); // Guarda o estado de login
      router.push("/"); // Redireciona para a página raiz após login bem-sucedido
    } else {
      setError("Usuário ou senha incorretos!");
    }
  };

  return (
    <div>
      {session ? (
        <>
          <h1>Bem-vindo, {session.user?.name}</h1>
          <p>Email: {session.user?.email}</p>
          <button onClick={() => signOut()}>Sair</button>
        </>
      ) : (
        <button onClick={() => signIn("azure-ad")}>Entrar com Microsoft</button>
      )}
    </div>
  );
};

export default LoginForm;
