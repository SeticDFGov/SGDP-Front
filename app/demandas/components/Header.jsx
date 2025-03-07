import { useRouter } from "next/navigation";
import React, {useState, useEffect} from "react"
import { login } from "../services/authService";

export const Header = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("authenticated")
        setIsAuthenticated(false)
        window.location.reload()
   
        
    }
    const login1 = () => {
  window.location.href = `${API_URL}/api/auth/login`;
};

    const handleAuthenticate = async () => {
        await login()
   }
    useEffect(() => {
    const authStatus = localStorage.getItem("authenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

    return(
        <nav className="bg-gray-900">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" 
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="sr-only">Abrir menu principal</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                   
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start ">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="h-14 w-auto" src="images.png" alt="SUBTDCR"/>
                        </div>
                        
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <a href="/" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">Home</a>
                                {isAuthenticated && (
                                    <>
                                        
                                        <a onClick={() => router.push("/categoria")} className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer">Cadastro de Tipos</a>
                                        <a onClick={() => router.push("/demandante")} className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer">Cadastro Área Demandante</a>
                                    </>
                                )}
                                

                            </div>
                        </div>
                    </div>
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="material-icons text-white text-xl">person</span>
                                <span className="text-white text-sm font-medium">{localStorage.getItem("userName")}</span>
                                <button onClick={() => handleLogout()} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <a onClick={() => login()} className="text-gray-300 hover:bg-gray-700 hover:text-white border-2 rounded-md px-3 py-2 text-base font-medium cursor-pointer">
                                Área logada
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header;