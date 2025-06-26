import { useAuth } from "@/app/contexts/AuthContext";
import * as etapaService from "../services/etapaService"


export const useEtapaApi = () => {
  const { Token } = useAuth();
 

  return {
    getAllEtapas: (id) => etapaService.getAllEtapas(id, Token),
    getSituacao: (id) => etapaService.getSituacao(id, Token),
    getPercent: (id) => etapaService.getPercent(id,Token),
    getItemById: (id) => etapaService.getItemById(id, Token),
    createEtapa: (itemData) => etapaService.createEtapa(itemData, Token),
    deleteItem: (id) => etapaService.deleteItem(id, Token),
    updateItem: (id, itemData) => etapaService.updateItem(id, itemData, Token),
    getTags: () => etapaService.getTags(Token),
    iniciarEtapa: (itemData) => etapaService.iniciarEtapa(itemData, Token),
  };
};
