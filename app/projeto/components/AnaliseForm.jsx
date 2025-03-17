import {React,useState } from "react";
import { createItem } from "../services/analiseService";

export const  AnaliseForm = ({ showModal, setShowModal, etapaSelecionada }) => {
    const [formData, setFormData] = useState({
        NM_ETAPA: etapaSelecionada.NM_ETAPA,
        ANALISE_ETAPA: '',
        PERCENT_EXEC: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const analiseData = {
            NM_ETAPA: formData.NM_ETAPA,
            ANALISE_ETAPA: formData.ANALISE_ETAPA,
            PERCENT_EXEC: formData.PERCENT_EXEC,
        };

        // Chamar sua API para cadastrar a análise
        const result = await createItem(analiseData);

        
            alert('Análise cadastrada com sucesso!');
            setShowModal(false);  // Fecha o modal após sucesso
        
    };

    return (
        showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-md w-[500px] shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Cadastrar Análise de Desempenho</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Análise da Etapa</label>
                            <textarea
                                name="ANALISE_ETAPA"
                                value={formData.ANALISE_ETAPA}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Percentual Executado</label>
                            <input
                                type="number"
                                name="PERCENT_EXEC"
                                value={formData.PERCENT_EXEC}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Cadastrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};
