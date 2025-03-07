const API_URL =  process.env.NEXT_PUBLIC_API_URL_DEMANDANTE || "http://localhost:5000/api/demandante"

export const createDemandante = async (itemData) => {
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


export const getAllDemandantes = async () => {
  try {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error("Erro ao obter itens");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteDemandante = async (id) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};