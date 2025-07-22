import React, { useState } from "react";

const TemplateCollapse = ({ templates, onEdit }) => {
  const [open, setOpen] = useState({});

  // templates: objeto { nomeTemplate: [etapas] }
  return (
    <div className="w-full">
      {Object.entries(templates).map(([templateName, etapas]) => (
        <div key={templateName} className="mb-4 border rounded">
          <button
            className="w-full text-left px-4 py-2 bg-gray-200 font-semibold rounded-t focus:outline-none"
            onClick={() => setOpen((prev) => ({ ...prev, [templateName]: !prev[templateName] }))}
          >
            {templateName}
          </button>
          {open[templateName] && (
            <div className="bg-white px-4 py-2">
              {etapas.map((etapa) => (
                <div key={etapa.TemplateId} className="flex justify-between items-center border-b py-2">
                  <div>
                    <span className="font-medium">{etapa.NM_ETAPA}</span>
                    <span className="ml-4 text-gray-500">Dias previstos: {etapa.DIAS_PREVISTOS}</span>
                  </div>
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-800"
                    onClick={() => onEdit(etapa)}
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TemplateCollapse; 