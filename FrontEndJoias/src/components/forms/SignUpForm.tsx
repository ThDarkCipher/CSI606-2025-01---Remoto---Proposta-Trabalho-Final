import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/AuthContext";
import { FaRegBuilding } from "react-icons/fa6";
import { Spinner } from "../ui/spinner";

export const SignUpForm = () => {
  const [tenancyName, setTenancyName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = () => {
    if (password === passwordConfirm) {
      setLoading(true);
      const payload = {
        "tenancyName": tenancyName,
        "userName": userName,
        "email": email,
        "password": password
      }
      axios.post(`${import.meta.env.VITE_APP_API_HOST}/Users/create`, payload)
        .then((response) => {
          alert(response.data?.message);
          navigate("/"); //Joga o usuário de volta pro Login
        })
        .catch((error) => {
          alert(error.response?.data?.message || "Erro ao cadastrar");
        })
    }
    else {
      alert("As senhas não coincidem")
    }
  }


  return (
    <div className="w-full max-w-md dark:bg-gray-800 bg-gray-200 p-8 rounded-lg shadow-lg border border-gray-700">

      <h1 className="text-3xl font-bold text-center mb-6 dark:text-blue-400 text-blue-500">Criar Conta 💎</h1>
      <p className="dark:text-gray-400 text-gray-900 text-center mb-6 text-sm">Cadastre-se para gerencia suas gemas</p>

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">

        {error && <p className="text-red-500 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

        <FieldGroup>
          <Field>
            {/*Campo Tenancy */}
            <FieldLabel className="dark:text-gray-400 text-gray-900 text-sm -mb-2">
              Empresa
            </FieldLabel>
            <InputGroup className="border border-gray-700">
              <InputGroupInput
                className="w-full  dark:text-white text-gray-900"
                placeholder="Nome da sua Empresa"
                value={tenancyName}
                onChange={(e) => setTenancyName(e.target.value)}
                type="text"
              />
              <InputGroupAddon>
                <FaRegBuilding />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className="-mt-4">
            {/* Campo Usuário */}
            <FieldLabel className="dark:text-gray-400 text-gray-900 text-sm -mb-2" >
              Usuário
            </FieldLabel>
            <InputGroup className="border border-gray-700">
              <InputGroupInput
                className="w-full  dark:text-white text-gray-900"
                placeholder="Nome de usuário"
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
                placeholder="Senha"
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
          <Field className="-mt-4">
            {/* Campo ConfirmarSenha */}
            <FieldLabel className="dark:text-gray-400 text-gray-900 text-sm -mb-2" >
              Confimar Senha
            </FieldLabel>
            <InputGroup className="border border-gray-700">
              <InputGroupInput
                className="w-full  dark:text-white text-gray-900"
                placeholder="Senha"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <InputGroupAddon>
                <RiLockPasswordLine />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>

        {/* Botão Cadastrar */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
        >
          {loading ?
            <>
              <Spinner data-icon="inline-start" /> 
              Cadastrando...
            </> :
            "Cadastrar"
        }
        </Button>
      </form >

      {/* Link para voltar ao Register */}
      < p className="text-center dark:text-gray-400 text-gray-900 text-sm mt-6 font-normal" >
        Já tem uma conta ? {" "}
        < Link to="/" className="dark:text-blue-400 text-blue-600 hover:underline font-bold" >
          Faça login aqui
        </Link>
      </p >

    </div >

  );
};