import { URL_DEMANDANTE_SERVICE } from "@/app/consts/consts";

const API_URL =  process.env.NEXT_PUBLIC_API_URL_DEMANDANTE || "http://localhost:5148/api/demandante"

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const createDemandante = async (itemData, token) => {
  try {
    console.log("Enviando dados:", JSON.stringify(itemData)); // Log para debug

    const response = await fetch(`${URL_DEMANDANTE_SERVICE}`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData), // Envia o objeto diretamente, sem "fields"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar item: ${errorText}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return null;
  }
};

export const getAllDemandantes = async (token) => {
  try {
    const response = await fetch(`${URL_DEMANDANTE_SERVICE}`, { headers: getAuthHeaders(token) });
    if (!response.ok) throw new Error("Erro ao obter itens");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteDemandante = async (id, token) => {
  try {
    const response = await fetch(`${URL_DEMANDANTE_SERVICE}/${id}`, { method: "DELETE", headers: getAuthHeaders(token) });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};