import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

const ORGAOS = [
  { label: "TCDF", value: "TCDF" },
  { label: "CGDF", value: "CGDF" },
];

export default function DespachoModal({ isOpen, onClose, projetoId }) {
  const { Token } = useAuth();
  const [orgaos, setOrgaos] = useState([]);
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ultimoDespacho, setUltimoDespacho] = useState(null);
  const [despachos, setDespachos] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    // Buscar último despacho
    fetch(`http://localhost:5148/api/despacho/projeto/${projetoId}/ultimo`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`,
      }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.NomeOrgao) {
          setOrgaos([data.NomeOrgao]);
          setDataEntrada(data.DataEntrada ? data.DataEntrada.substring(0, 10) : "");
          setDataSaida(data.DataSaida ? data.DataSaida.substring(0, 10) : "");
          setUltimoDespacho(data);
        } else {
          setOrgaos([]);
          setDataEntrada("");
          setDataSaida("");
          setUltimoDespacho(null);
        }
      })
      .catch(() => {
        setOrgaos([]);
        setDataEntrada("");
        setDataSaida("");
        setUltimoDespacho(null);
      });
    // Buscar todos os despachos
    fetch(`http://localhost:5148/api/despacho/${projetoId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`,
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setDespachos)
      .finally(() => setLoading(false));
  }, [isOpen, projetoId, Token]);

  const handleOrgaoChange = (value) => {
    setOrgaos((prev) =>
      prev.includes(value)
        ? prev.filter((o) => o !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (orgaos.length === 0) {
      setError("Selecione pelo menos um órgão de controle.");
      return;
    }
    if (!dataEntrada || !dataSaida) {
      setError("Preencha as datas de entrada e saída.");
      return;
    }
    setLoading(true);
    try {
      for (const orgao of orgaos) {
        await fetch("http://localhost:5148/api/despacho", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Token}`,
          },
          body: JSON.stringify({
            ProjetoId: projetoId,
            NomeOrgao: orgao,
            DataEntrada: dataEntrada,
            DataSaida: dataSaida,
          }),
        });
      }
      onClose();
      window.location.reload();
    } catch (err) {
      setError("Erro ao cadastrar despacho.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">Despacho</h2>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Órgãos de Controle</label>
            <div className="flex gap-4">
              {ORGAOS.map((orgao) => (
                <label key={orgao.value} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={orgaos.includes(orgao.value)}
                    onChange={() => handleOrgaoChange(orgao.value)}
                  />
                  <span className="ml-2">{orgao.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Data de Entrada</label>
            <input
              type="date"
              value={dataEntrada}
              onChange={e => setDataEntrada(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Data de Saída</label>
            <input
              type="date"
              value={dataSaida}
              onChange={e => setDataSaida(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              Salvar
            </button>
          </div>
        </form>
        <hr className="my-4" />
        <h3 className="text-lg font-semibold mb-2">Histórico de Despachos</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {despachos.length === 0 ? (
            <div className="text-gray-500 text-center">Nenhum despacho cadastrado.</div>
          ) : (
            despachos.map((d) => (
              <div key={d.DespachoId} className="border rounded p-2 flex flex-col">
                <div><b>Órgão:</b> {d.NomeOrgao}</div>
                <div><b>Entrada:</b> {d.DataEntrada ? d.DataEntrada.substring(0, 10) : "-"}</div>
                <div><b>Saída:</b> {d.DataSaida ? d.DataSaida.substring(0, 10) : "-"}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 