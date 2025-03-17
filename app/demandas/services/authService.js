const API_URL = process.env.NEXT_PUBLIC_API_URL_AUTH || "http://localhost:5000/api/auth/login";


export const login = async () => {

 

    try {
    window.location.href = `${API_URL}`;
    if (!response.ok) throw new Error("Erro na autenticação");
    localStorage.setItem("authenticated", "true"); // Guarda o estado de login

    return await response.json(); 
  } catch (error) {
    console.error(error);
    return [];
  }
};
