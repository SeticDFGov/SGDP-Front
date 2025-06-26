import { URL_PROJETO_SERVICE } from "@/app/consts/consts";
import { useContext } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL_PROJETO || "http://localhost:5148/api/projeto";
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});


export const getAllItems = async (token, unidade = null) => {
  
  try {
    let url = `${URL_PROJETO_SERVICE}`;
    
    // Adiciona a unidade como query parameter se fornecida
    if (unidade) {
      url += `?unidade=${encodeURIComponent(unidade)}`;
    }
    
    const response = await fetch(url, {
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
  console.log("token enviado?" + token)
  try {
    const response = await fetch(`${URL_PROJETO_SERVICE}/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error(`Erro ao obter item ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getQuantidade = async (token) => {
  try {
    const response = await fetch(`${URL_PROJETO_SERVICE}/quantidade`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error(`Erro ao obter quantidade`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createItem = async (itemData, token) => {
  try {
    const response = await fetch(`${URL_PROJETO_SERVICE}/template`, {
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

export const updateItem = async (id, itemData, token) => {
  try {
    const response = await fetch(`${URL_PROJETO_SERVICE}/items/${id}`, {
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