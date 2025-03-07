import React from "react";

const Table = ({ items, onEdit, onDelete }) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-200 mt-4 shadow-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
            Nome da Demanda
          </th>
          <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
            Status da Demanda
          </th>
          <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
            Ações
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.ID} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-6 py-4 text-sm text-gray-600">
              {item.fields?.nomeDemanda || "-"}
            </td>
            <td className="border border-gray-300 px-6 py-4 text-sm text-gray-600">
              {item.fields?.statusDemanda || "-"}
            </td>
            <td className="border border-gray-300 px-6 py-4 text-sm text-gray-600">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => onEdit(item)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => onDelete(item.id)}
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
