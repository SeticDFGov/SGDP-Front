const API_URL =  process.env.NEXT_PUBLIC_API_URL_DETALHAMENTO || "http://localhost:5148/api/detalhamento"

export const createDetalhe = async (itemData) => {
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


export const getAllDetalhes = async (nameId) => {
  try {
    console.log(nameId)
    const response = await fetch(`${API_URL}/detalhes`,
        {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({nameDemanda : nameId}), // Envia o objeto diretamente, sem "fields"
    }
    );
    if (!response.ok) throw new Error("Erro ao obter itens");
    return response.json();
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