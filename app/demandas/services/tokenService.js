export const getMicrosoftGraphToken = async () => {
  try {
    const response = await fetch("/api/token", { method: "POST" });
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Erro ao buscar o token:", error);
    return null;
  }
};
