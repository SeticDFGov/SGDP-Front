import { useAuth } from "@/app/contexts/AuthContext";
import * as projetoService from "../services/projetoService"

export const useProjetoApi = () => {
  const { Token } = useAuth();
  console.log(Token)

  return {
    getAllItems: () => projetoService.getAllItems(Token),
    getItemById: (id) => projetoService.getItemById(id, Token),
    getQuantidade: () => projetoService.getQuantidade(Token),
    createItem: (data) => projetoService.createItem(data, Token),
    updateItem: (id, data) => projetoService.updateItem(id, data, Token),
    deleteItem: (id) => projetoService.deleteItem(id, Token),
    
  };
};
