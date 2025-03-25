const API_URL =  process.env.NEXT_PUBLIC_API_URL_CATEGORIA || "http://localhost:5148/api/categoria"

export const createCategoria = async (itemData) => {
  try {
    

    const response = await fetch(`${API_URL}`, {
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

    return await response.text();
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return null;
  }
};


export const getAllCategoria = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error("Erro ao obter itens");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteCategoria = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};