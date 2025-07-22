import { useAuth } from "@/app/contexts/AuthContext";
import * as templateService from "../services/templateService";

export const useTemplateApi = () => {
  const { Token } = useAuth();

  return {
    getAllTemplates: () => templateService.getAllTemplates(Token),
    createTemplate: (data) => templateService.createTemplate(data, Token),
    updateTemplate: (id, data) => templateService.updateTemplate(id, data, Token),
  };
}; 