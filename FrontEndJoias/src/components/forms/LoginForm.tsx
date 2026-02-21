import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { Button } from "../ui/button";

export const LoginForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      "userName": userName,
      "password": password
    }
    axios.post(`${import.meta.env.VITE_APP_API_HOST}/Users/login`, payload)
      .then((response) => {
        sessionStorage.setItem("token", response.data?.longtermtoken);
        console.log(response)
        navigate("/dashboard");
      })
      .catch((response) => {
        alert(response.response?.data.message);
      })
  }

  return (

    <div className="w-full max-w-md dark:bg-gray-800 bg-gray-200 p-8 rounded-lg shadow-lg border border-gray-700">

      <h1 className="text-3xl font-bold text-center mb-6 dark:text-blue-400 text-blue-500">GemaGestor 💎</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">

        {error && <p className="text-red-500 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

        <FieldGroup>
          <Field>
            {/* Campo Usuário */}
            <FieldLabel className="dark:text-gray-400 text-gray-900 text-sm -mb-2" >
              Usuário
            </FieldLabel>
            <InputGroup className="border border-gray-700">
              <InputGroupInput
                className="w-full  dark:text-white text-gray-900"
                placeholder="Digite seu usuário"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
              />
              <InputGroupAddon>
                <FaRegUserCircle />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className="-mt-4">
            {/* Campo Senha */}
            <FieldLabel className="dark:text-gray-400 text-gray-900 text-sm -mb-2" >
              Senha
            </FieldLabel>
            <InputGroup className="border border-gray-700">
              <InputGroupInput
                className="w-full  dark:text-white text-gray-900"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}

              />
              <InputGroupButton
                className="dark:text-white text-gray-900 px-3 cursor-pointer "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroupButton>
              <InputGroupAddon>
                <RiLockPasswordLine />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>

        {/* Botão Entrar */}
        <Button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 cursor-pointer"
        >
          Entrar
        </Button>
      </form >

      {/* Link para voltar ao Register */}
      < p className="text-center dark:text-gray-400 text-gray-900 text-sm mt-6 font-normal" >
        Não tem uma conta ? {" "}
        < Link to="/register" className="dark:text-blue-400 text-blue-600 hover:underline font-bold" >
          Cadastre-se
        </Link>
      </p >

    </div >

  );
};