"use client";

const URL_AUTH_SERVICE = process.env.NEXT_PUBLIC_API_URL_AUTH || "http://localhost:5148/api/Auth";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function SelecionarUnidade() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUnidades = async () => {
      const response = await fetch(`${URL_AUTH_SERVICE}/unidades`);
      const data = await response.json();
      setUnidades(data);
      setLoading(false);
    };

    fetchUnidades();
  }, []);

  const handleSelecionar = async (unidadeSelecionada) => {
    // Enviar para API para salvar no backend
    await fetch(`${URL_AUTH_SERVICE}/informar-unidade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email:user.email, unidadeId: unidadeSelecionada }),
    });

    

    router.push("/");
  };

  if (loading) return <div>Carregando unidades...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Selecione sua Unidade</h1>
      <ul className="space-y-2">
        {unidades.map((u) => (
          <li key={u.id}>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleSelecionar(u.id)}
            >
              {u.Nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
