import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const [userName, setUserName] = useState("");
  const [tenancy, setTenancy] = useState(""); // O nome da joalheria/empresa
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validação rápida para ver se o usuário não digitou a senha errado
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      // ⚠️ A rota e as variáveis baseadas exatamente no seu C#
      await axios.post("http://localhost:5059/api/Users/create", {
        userName: userName,
        password: password,
        tenancy: tenancy
      });

      alert("Conta criada com sucesso! Faça login para entrar no sistema.");
      navigate("/login"); // Manda de volta pro login

    } catch (err) {
      setError("Erro ao criar usuário. Verifique se a API está rodando.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-400">Criar Conta 💎</h1>
        <p className="text-gray-400 text-center mb-6 text-sm">Cadastre-se para gerenciar seus lotes</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {error && <p className="text-red-500 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

          {/* Campo Usuário */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Nome de Usuário</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              placeholder="Usuário"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              required
            />
          </div>

          {/* Campo Tenancy (Empresa) */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Nome da Empresa</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              placeholder="Sua Empresa"
              value={tenancy}
              onChange={(e) => setTenancy(e.target.value)}
              type="text"
              required
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
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Campo Confirmar Senha */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Confirmar Senha</label>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 text-white"
              placeholder="******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
            />
          </div>

          {/* Botão Cadastrar */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {/* Link para voltar ao Login */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Faça login aqui
          </Link>
        </p>

      </div>
    </div>
  );
};