import { URL_ETAPA_SERVICE } from "@/app/consts/consts";

const API_URL = process.env.NEXT_PUBLIC_API_URL_ETAPA || "http://localhost:5148/api/etapa";


const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getAllEtapas = async (id, token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}/${id}`, {
      headers: getAuthHeaders(token),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSituacao = async (token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}/situacao`, {
      headers: getAuthHeaders(token),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPercent = async (id, token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}/percent/${id}`, {
      headers: getAuthHeaders(token),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getItemById = async (id, token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}/api/byid/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error(`Erro ao obter item ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createEtapa = async (itemData, token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
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

export const updateItem = async (id, itemData, token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}/${id}`, {
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
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getTags = async (token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}/tags`, {
      headers: getAuthHeaders(token),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const iniciarEtapa = async (id, token) => {
  try {
    const response = await fetch(`${URL_ETAPA_SERVICE}/iniciar/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};