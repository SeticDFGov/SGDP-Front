import { useAuth } from "@/app/contexts/AuthContext";
import * as projetoService from "../services/projetoService"

export const useProjetoApi = () => {
  const { Token, user } = useAuth();

  return {
    getAllItems: () => projetoService.getAllItems(Token, user?.Unidade.Nome),
    getItemById: (id) => projetoService.getItemById(id, Token),
    getQuantidade: () => projetoService.getQuantidade(Token),
    createItem: (data) => projetoService.createItem(data, Token),
    updateItem: (id, data) => projetoService.updateItem(id, data, Token),
    deleteItem: (id) => projetoService.deleteItem(id, Token),
    getTemplateNames: () => projetoService.getTemplateNames(Token),
  };
};
