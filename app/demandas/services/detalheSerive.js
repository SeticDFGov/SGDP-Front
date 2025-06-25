import { URL_DETALHAMENTO_SERVICE } from "@/app/consts/consts";

const API_URL =  process.env.NEXT_PUBLIC_API_URL_DETALHAMENTO || "http://localhost:5148/api/detalhamento"

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const createDetalhe = async (itemData, token) => {
  try {
    console.log("Enviando dados:", JSON.stringify(itemData)); // Log para debug

    const response = await fetch(`${URL_DETALHAMENTO_SERVICE}`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData), // Envia o objeto diretamente, sem "fields"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar item: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return null;
  }
};


export const getAllDetalhes = async (nameId, token) => {
  try {
    console.log(` asdasdas${nameId}`)
    const response = await fetch(`${URL_DETALHAMENTO_SERVICE}/${nameId}`, { headers: getAuthHeaders(token) });
    if (!response.ok) throw new Error("Erro ao obter itens");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteDemandante = async (id, token) => {
  try {
    const response = await fetch(`${URL_DETALHAMENTO_SERVICE}/items/${id}`, { method: "DELETE", headers: getAuthHeaders(token) });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};