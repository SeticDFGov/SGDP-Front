"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const name = urlParams.get("name");

      if (token && name) {
        localStorage.setItem("authToken", token); // Salva o token
        localStorage.setItem("authenticated", "true")
        localStorage.setItem("userName", name); // Salva o nome do usuário
        router.push("/"); // Redireciona para a home
      } else {
        console.error("Erro na autenticação");
        router.push("/login"); // Redireciona para login se falhar
      }
    };

    handleCallback();
  }, [router]);

  return <p>Processando login...</p>;
};

export default Callback;
