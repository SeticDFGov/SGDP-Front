import { useAuth } from "@/app/contexts/AuthContext";
import * as apiService from "../services/apiService";
import * as demandanteService from "../services/demandanteService";
import * as detalheService from "../services/detalheSerive";
import * as categoriaService from "../services/categoriaService";

export const useDemandaApi = () => {
  const { Token } = useAuth();

  
  return {
    // Demandas
    getAllDemandas: () => apiService.getAllItems(Token),
    getDemandaById: (id) => apiService.getItemById(id, Token),
    createDemanda: (data) => apiService.createItem(data, Token),
    updateDemanda: (id, data) => apiService.updateItem(id, data, Token),
    deleteDemanda: (id) => apiService.deleteItem(id, Token),

    // Demandantes
    getAllDemandantes: () => demandanteService.getAllDemandantes(Token),
    createDemandante: (data) => demandanteService.createDemandante(data, Token),
    deleteDemandante: (id) => demandanteService.deleteDemandante(id, Token),

    // Detalhes
    getAllDetalhes: (nameId) => detalheService.getAllDetalhes(nameId, Token),
    createDetalhe: (data) => detalheService.createDetalhe(data, Token),
    deleteDetalhe: (id) => detalheService.deleteDemandante(id, Token),

    // Categorias
    getAllCategoria: () => categoriaService.getAllCategoria(Token),
    createCategoria: (data) => categoriaService.createCategoria(data, Token),
    deleteCategoria: (id) => categoriaService.deleteCategoria(id, Token),
  };
}; 