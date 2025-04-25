"use client";

import React, { useEffect, useState, useRef } from "react";
import Dashboard from "./components/Dasjboard";


const Home = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se o código está rodando no lado do cliente
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("authenticated");
      setIsAuthenticated(authStatus === "true");

      // Se o usuário não estiver autenticado, redireciona para a página de login
      if (authStatus !== "true") {
        router.push('/auth');
      }
    }
  }, [router]); 
  return (

<Dashboard></Dashboard>

  );
};

export default Home;
