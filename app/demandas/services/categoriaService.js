import { URL_CATEGORIA_SERVICE } from "@/app/consts/consts";

const API_URL =  process.env.NEXT_PUBLIC_API_URL_CATEGORIA || "http://localhost:5148/api/categoria"

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const createCategoria = async (itemData, token) => {
  try {
    const response = await fetch(`${URL_CATEGORIA_SERVICE}`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
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

export const getAllCategoria = async (token) => {
  try {
    const response = await fetch(`${URL_CATEGORIA_SERVICE}`, { headers: getAuthHeaders(token) });
    if (!response.ok) throw new Error("Erro ao obter itens");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteCategoria = async (id, token) => {
  try {
    const response = await fetch(`${URL_CATEGORIA_SERVICE}/${id}`, { method: "DELETE", headers: getAuthHeaders(token) });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};