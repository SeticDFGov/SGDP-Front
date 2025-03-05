const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export const login = async () => {

 

    try {
    window.location.href = "http://localhost:5000/api/auth/login";
    if (!response.ok) throw new Error("Erro na autenticação");
    localStorage.setItem("authenticated", "true"); // Guarda o estado de login

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
