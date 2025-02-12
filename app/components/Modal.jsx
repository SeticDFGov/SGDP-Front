import React from "react";



const Modal = ({ isOpen, onClose, title, children }) => {
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header do Modal */}
        <div className="flex justify-between items-center border-b pb-3">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="mt-4">{children}</div>

        {/* Rodapé opcional */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
