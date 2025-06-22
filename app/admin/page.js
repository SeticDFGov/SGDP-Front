'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/app/components/AdminRoute';

function AdminPageContent() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [loadingUnit, setLoadingUnit] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadUsers();
    loadUnits();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('http://localhost:5148/api/auth/usuarios', {
        headers: {
          'Content-Type': 'application/json',
          'adminEmail': user.email
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        showMessage('Erro ao carregar usuários', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showMessage('Erro ao carregar usuários', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadUnits = async () => {
    setLoadingUnits(true);
    try {
      const response = await fetch('http://localhost:5148/api/auth/unidades', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      } else {
        showMessage('Erro ao carregar unidades', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
      showMessage('Erro ao carregar unidades', 'error');
    } finally {
      setLoadingUnits(false);
    }
  };

  const alterarPerfil = async (email, novoPerfil) => {
    try {
      const response = await fetch('http://localhost:5148/api/auth/alterar-perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Email: email,
          Perfil: novoPerfil
        })
      });

      if (response.ok) {
        showMessage('Perfil alterado com sucesso!', 'success');
        loadUsers(); // Recarregar lista
      } else {
        showMessage('Erro ao alterar perfil', 'error');
      }
    } catch (error) {
      console.error('Erro ao alterar perfil:', error);
      showMessage('Erro ao alterar perfil', 'error');
    }
  };

  const cadastrarUnidade = async (e) => {
    e.preventDefault();
    if (!newUnitName.trim()) {
      showMessage('Nome da unidade é obrigatório', 'error');
      return;
    }

    setLoadingUnit(true);
    try {
      const response = await fetch('http://localhost:5148/api/auth/unidade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: newUnitName.trim()
        })
      });

      if (response.ok) {
        showMessage('Unidade cadastrada com sucesso!', 'success');
        setNewUnitName('');
        loadUnits(); // Recarregar lista de unidades
      } else {
        showMessage('Erro ao cadastrar unidade', 'error');
      }
    } catch (error) {
      console.error('Erro ao cadastrar unidade:', error);
      showMessage('Erro ao cadastrar unidade', 'error');
    } finally {
      setLoadingUnit(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
            <div className="text-sm text-gray-600">
              Logado como: <span className="font-medium">{user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagem de feedback */}
        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seção de Cadastro de Unidade */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gerenciar Unidades</h2>
            
            {/* Formulário de Cadastro */}
            <form onSubmit={cadastrarUnidade} className="mb-6">
              <div className="mb-4">
                <label htmlFor="unitName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Nova Unidade
                </label>
                <input
                  type="text"
                  id="unitName"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o nome da unidade"
                  disabled={loadingUnit}
                />
              </div>
              <button
                type="submit"
                disabled={loadingUnit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingUnit ? 'Cadastrando...' : 'Cadastrar Unidade'}
              </button>
            </form>

            {/* Lista de Unidades Cadastradas */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-900">Unidades Cadastradas</h3>
                <button
                  onClick={loadUnits}
                  disabled={loadingUnits}
                  className="text-sm bg-gray-600 text-white py-1 px-3 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  {loadingUnits ? 'Carregando...' : 'Atualizar'}
                </button>
              </div>

              {loadingUnits ? (
                <div className="text-center py-4 text-gray-500">Carregando unidades...</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {units.length > 0 ? (
                    units.map((unit) => (
                      <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <span className="font-medium text-gray-900">{unit.Nome}</span>
                          <p className="text-xs text-gray-500">ID: {unit.id}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhuma unidade cadastrada
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Seção de Gerenciamento de Usuários */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Gerenciar Usuários</h2>
              <button
                onClick={loadUsers}
                disabled={loadingUsers}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loadingUsers ? 'Carregando...' : 'Atualizar'}
              </button>
            </div>

            {loadingUsers ? (
              <div className="text-center py-4">Carregando usuários...</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.Id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.Nome}</h3>
                        <p className="text-sm text-gray-600">{user.Email}</p>
                        {user.Unidade && (
                          <p className="text-sm text-gray-500">
                            Unidade: {user.Unidade.Nome}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.Perfil === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.Perfil}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alterarPerfil(user.Email, user.Perfil === 'admin' ? 'basico' : 'admin')}
                        className="text-sm bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Alterar para {user.Perfil === 'admin' ? 'Básico' : 'Admin'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {users.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum usuário encontrado
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
} 