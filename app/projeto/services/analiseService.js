const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/analise";

export const getAllAnalise = async (nome_etapa) => {
  try {
    const response = await fetch(`${API_URL}/${nome_etapa}`);
    if (!response.ok) throw new Error("Erro ao obter itens");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getLastAnalise = async (nome_etapa) => {
  try {
    const response = await fetch(`${API_URL}/${nome_etapa}`);
    if (!response.ok) throw new Error("Erro ao obter itens");
    const analises = await response.json();
    
    // Ordena as análises pelo campo 'Created' para pegar a última
    const lastAnalise = analises.sort((a, b) => new Date(b.Created) - new Date(a.Created))[0];
    
    return lastAnalise;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getItemById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`);
    if (!response.ok) throw new Error(`Erro ao obter item ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createItem = async (itemData) => {
  try {
    console.log("Enviando dados:", JSON.stringify(itemData)); // Log para debug

    const response = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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


export const updateItem = async (id, itemData) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

