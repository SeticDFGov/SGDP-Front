import { URL_DEMANDA_SERVICE } from "@/app/consts/consts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5148/api/demanda";

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getAllItems = async (token) => {
  try {
    console.log(token);
    const response = await fetch(`${URL_DEMANDA_SERVICE}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error("Erro ao obter itens");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getItemById = async (id, token) => {
  try {
    const response = await fetch(`${URL_DEMANDA_SERVICE}/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error(`Erro ao obter item ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createItem = async (itemData, token) => {
  try {
    const response = await fetch(`${URL_DEMANDA_SERVICE}`, {
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

export const updateItem = async (itemData, token) => {
  try {
    const response = await fetch(`${URL_DEMANDA_SERVICE}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteItem = async (id, token) => {
  try {
    const response = await fetch(`${URL_DEMANDA_SERVICE}/${id}`, { method: "DELETE", headers: getAuthHeaders(token) });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const tmpAVG = async (token) => {
  try {
    const response = await fetch(`${URL_DEMANDA_SERVICE}/rank`, { method: "GET", headers: getAuthHeaders(token) });
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};