import { useAuth } from "@/app/contexts/AuthContext";
import * as analiseService from "../services/analiseService";

export const useAnaliseApi = () => {
  const { Token } = useAuth();

  return {
    getLastAnalise: (nome_projeto) => analiseService.getLastAnalise(nome_projeto, Token),
    getItemById: (id) => analiseService.getItemById(id, Token),
    createItem: (itemData, id) => analiseService.createItem(itemData, id, Token),
    updateItem: (id, itemData) => analiseService.updateItem(id, itemData, Token),
    deleteItem: (id) => analiseService.deleteItem(id, Token),
  };
};
