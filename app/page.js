"use client"

import 'material-icons/iconfont/material-icons.css';
import { useRouter } from 'next/navigation';
import { useEffect , useState} from 'react';
import Header from './demandas/components/Header';

export default function HomePage() {
  const router = useRouter();
  
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

  // Se o usuário não estiver autenticado, renderiza nada até ser redirecionado
  if (!isAuthenticated) return null;
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SGD - Sistema Gestão de Demanda */}
          <div
            className={`flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl cursor-pointer hover:bg-gray-200 transition ${!isAuthenticated && "pointer-events-none opacity-50"}`}
            onClick={() => router.push('/demandas')}
          >
            <span className="material-icons text-blue-500 text-6xl">description</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">SGD - Sistema Gestão de Demanda</h2>
          </div>

          {/* SGP - Sistema Gestão de Projetos */}
          <div
            className={`flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl cursor-pointer hover:bg-gray-200 transition ${!isAuthenticated && "pointer-events-none opacity-50"}`}
            onClick={() => router.push('/projeto')}
          >
            <span className="material-icons text-green-500 text-6xl">dashboard</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">SGP - Sistema Gestão de Projetos</h2>
          </div>

          {/* SEGD - Sistema de Gestão da Estratégia de Governança Digital */}
          <div
            className={`flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl cursor-pointer hover:bg-gray-200 transition ${!isAuthenticated && "pointer-events-none opacity-50"}`}
            onClick={() => router.push('/segd')}
          >
            <span className="material-icons text-gray-500 text-6xl">dashboard</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">SEGD - Sistema de Gestão da Estratégia de Governança Digital</h2>
          </div>

          {/* SIMI - Sistema de monitoramento de indicadores */}
          <div
            className={`flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl cursor-pointer hover:bg-gray-200 transition ${!isAuthenticated && "pointer-events-none opacity-50"}`}
            onClick={() => router.push('/simi')}
          >
            <span className="material-icons text-gray-500 text-6xl">dashboard</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">SIMI - Sistema de Monitoramento de Indicadores</h2>
          </div>
        </div>
      </div>
    </>
  );
}
