import React, { useState, useEffect } from "react";

const EditTemplateModal = ({ etapa, isOpen, onSave, onClose }) => {
  const [form, setForm] = useState({
    NM_TEMPLATE: "",
    NM_ETAPA: "",
    PERCENT_TOTAL: 0,
    DIAS_PREVISTOS: 0,
    ORDER: 0,
  });

  useEffect(() => {
    if (etapa) {
      setForm({
        NM_TEMPLATE: etapa.NM_TEMPLATE || "",
        NM_ETAPA: etapa.NM_ETAPA || "",
        PERCENT_TOTAL: etapa.PERCENT_TOTAL || 0,
        DIAS_PREVISTOS: etapa.DIAS_PREVISTOS || 0,
        ORDER: etapa.ORDER || 0,
      });
    }
  }, [etapa]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Etapa</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium">Nome do Template</label>
          <input name="NM_TEMPLATE" value={form.NM_TEMPLATE} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Nome da Etapa</label>
          <input name="NM_ETAPA" value={form.NM_ETAPA} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Percentual Total</label>
          <input name="PERCENT_TOTAL" type="number" value={form.PERCENT_TOTAL} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Dias Previstos</label>
          <input name="DIAS_PREVISTOS" type="number" value={form.DIAS_PREVISTOS} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Ordem</label>
          <input name="ORDER" type="number" value={form.ORDER} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default EditTemplateModal; 