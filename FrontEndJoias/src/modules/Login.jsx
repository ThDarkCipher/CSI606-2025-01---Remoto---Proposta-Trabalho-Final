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
    e.preventDefault(); //Evita o recarregamento da página
    setError(""); //Limpa mensagens de erro anteriores
    try {
      //Tenta fazer login
      const response = await axios.post("http://localhost:5173/api/auth/login", {
        email: email,
        password: password,
      });
      //Salva o token
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard"); //Redireciona para a homepage após login bem-sucedido
    } catch (err) {
      setError("Login falhou. Verifique suas credenciais e tente novamente."); //Exibe mensagem de 
      console.error("Erro ao fazer login:", err);
    }
  };

    return (
    <div className="w-screen flex flex-col items-center justify-center h-screen bg-gray-700 text-white">
      <h1 className="text-2xl font-bold mb-4 ">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        {/* Email Input */}
        <input
          className="border rounded-sm px-2 w-80 my-2"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        {/* Password Input */}
        <div className="inline">
          <input
            className="border rounded-sm px-2 w-full bg-gray-700 text-white outline-none focus:border-blue-700"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
          />
          {/*esconder senha */}
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            <FaEyeSlash
              className="inline mr-2"
              style={{
                transform: "translateX(-150%) translateY(-10%)",
              }}
            />
          </button>
        </div>
      </form>
    </div>
  );
};
