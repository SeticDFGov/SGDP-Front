"use client"

import 'material-icons/iconfont/material-icons.css';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SGD - Sistema Gestão de Demanda */}
        <div
          className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl cursor-pointer hover:bg-gray-200 transition"
          onClick={() => router.push('/demandas')}
        >
          <span className="material-icons text-blue-500 text-6xl">description</span>
          <h2 className="mt-4 text-lg font-semibold text-gray-800">SGD - Sistema Gestão de Demanda</h2>
        </div>

        {/* SGP - Sistema Gestão de Projetos */}
        <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl cursor-pointer hover:bg-gray-200 transition">
          <span className="material-icons text-green-500 text-6xl">dashboard</span>
          <h2 className="mt-4 text-lg font-semibold text-gray-800">SGP - Sistema Gestão de Projetos</h2>
        </div>
      </div>
    </div>
  );
}
