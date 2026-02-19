import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarregar a tela
    setError("");

    try {
      // Tenta logar na API
      const response = await axios.post("http://localhost:5059/api/Auth/Login", {
        email: email,
        password: password
      });

      // Se deu certo, salva o token e entra
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      // Manda o usuário para o Dashboard apos logar com sucesso
      navigate("/dashboard");

    } catch (err) {
      setError("Email ou senha incorretos.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">GemaGestor 💎</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Mensagem de Erro */}
          {error && <p className="text-red-500 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

          {/* Campo Email */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">E-mail</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
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

      </div>
    </div>
  );
};