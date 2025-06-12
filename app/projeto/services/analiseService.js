const API_URL = process.env.NEXT_PUBLIC_API_URL_ANALISE || "http://localhost:5148/api/projeto/analise";





const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getLastAnalise = async (nome_projeto, token) => {
  try {
    const response = await fetch(`${API_URL}/${nome_projeto}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro:", response.status, errorData.message);
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getItemById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error(`Erro ao obter item ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createItem = async (itemData, id, token) => {
  try {
    console.log("Enviando dados:", JSON.stringify(itemData));
    const response = await fetch(`${API_URL}/${id}`, {
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
    const response = await fetch(`${API_URL}/items/${id}`, {
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