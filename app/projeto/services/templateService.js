import { URL_TEMPLATE_SERVICE } from "@/app/consts/consts";

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getAllTemplates = async (token) => {
  try {
    const response = await fetch(`${URL_TEMPLATE_SERVICE}`, {
   
    });
    if (!response.ok) throw new Error("Erro ao obter templates");
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const createTemplate = async (templateData, token) => {
  try {
    const response = await fetch(`${URL_TEMPLATE_SERVICE}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar template: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return null;
  }
};

export const updateTemplate = async (id, templateData, token) => {
  try {
    const response = await fetch(`${URL_TEMPLATE_SERVICE}/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao atualizar template: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}; 