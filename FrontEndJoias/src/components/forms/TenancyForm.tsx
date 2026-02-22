import { useState } from "react"
import { cnpj } from "cpf-cnpj-validator";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { Field ,FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { FaRegBuilding } from "react-icons/fa";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { HiOutlineIdentification } from "react-icons/hi";

export const TenancyForm = () => {
  const [tenancyName, setTenancyName] = useState<string>("");
  const [tenancyCnpj, setTenancyCnpj] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleTenancyCreate = () => {
    if (cnpj.isValid(tenancyCnpj)) {
      setLoading(true);
      const payload = {
        "tenancyName": tenancyName,
        "tenancyCnpj": tenancyCnpj
      }
      axios.post(`${import.meta.env.VITE_APP_API_HOST}/Tenancy`, payload)
        .then((response) => {
          alert(response.data?.message);
          navigate("/dashboard")
        })
        .catch((error) => {
          alert(error.response?.data?.message || "Erro ao cadastrar")
        })
    }
    else {
      alert("Cnpj invalido")
    }
  }
  return (
    <div className="w-full max-w-md dark:bg-gray-800 bg-gray-200 p-8 rounded-lg shadow-lg border border-gray-700">

      <h1 className="text-3xl font-bold text-center mb-6 dark:text-blue-400 text-blue-500">Registrando Empresa 💎</h1>
      <p className="dark:text-gray-400 text-gray-900 text-center mb-6 text-sm">Registre as empresas dos seus usuários</p>

      <form onSubmit={handleTenancyCreate} className="flex flex-col gap-4">

        {error && <p className="text-red-500 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

        <FieldGroup>
          <Field>
            {/*Campo Nome da Empresa */}
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
            {/* Campo Cnpj */}
            <FieldLabel className="dark:text-gray-400 text-gray-900 text-sm -mb-2" >
              Cnpj
            </FieldLabel>
            <InputGroup className="border border-gray-700">
              <InputGroupInput
                className="w-full  dark:text-white text-gray-900"
                placeholder="Cnpj da Empresa"
                value={tenancyCnpj}
                onChange={(e) => setTenancyCnpj(e.target.value)}
                type="text"
              />
              <InputGroupAddon>
                <HiOutlineIdentification />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
        {/* Botão Registrar */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
        >
          {loading ?
            <>
              <Spinner data-icon="inline-start" /> 
              Registrando...
            </> :
            "Registrar"
        }
        </Button>
      </form >
    </div >

  );
};