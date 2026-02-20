import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  // Mudamos de email para userName
  const [userName, setUserName] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");

    try {
      const response = await axios.post("http://localhost:5059/api/Users/login", {
        userName: userName,
        password: password
      });

      // Se deu certo, salva o token e entra
      const token = response.data.token || response.data; // Pega o token dependendo de como sua API devolve
      localStorage.setItem("token", token);
      
      navigate("/dashboard");

    } catch (err) {
      setError("Usuário ou senha incorretos.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">GemaGestor 💎</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {error && <p className="text-red-500 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

          {/* Campo Usuário */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Usuário</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              placeholder="Digite seu usuário"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text" 
            />
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col relative">
            <label className="text-gray-400 text-sm mb-1">Senha</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 pr-10 focus:outline-none focus:border-blue-500 text-white"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Botão Entrar */}
          <button 
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Entrar
          </button>
        </form>

        {/* Link para voltar ao Register */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Cadastre-se
          </Link>
        </p>

      </div>
    </div>
  );
};