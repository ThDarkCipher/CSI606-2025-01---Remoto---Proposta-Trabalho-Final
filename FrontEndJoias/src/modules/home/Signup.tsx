import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import axios from "axios";
import { useState } from "react";
import { CiAt, CiUser } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoKeyOutline, IoPersonAddOutline } from "react-icons/io5";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    if (password === passwordConfirm) {
      const payload = {
        "email": email,
        "name": name,
        "password": password
      }
      axios.post(`${import.meta.env.VITE_APP_API_HOST}/users/register`, payload)
        .then((response) => {
          alert(response.data?.message);
        })
        .catch((response) => {
          alert(response.response?.data?.message);
        })
    }
    else {
      alert("As senhas não coincidem");
    }
  }

  return (
    <div className="w-screen max-w-3xl mt-5">
      <FieldGroup>
        <Field>
          <InputGroup>
            <InputGroupInput 
              placeholder="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <InputGroupAddon align="inline-start">
              <CiUser />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field className="-mt-4">
          <InputGroup>
            <InputGroupInput 
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <InputGroupAddon align="inline-start">
              <CiAt />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field className="-mt-4">
          <InputGroup>
            <InputGroupInput 
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <InputGroupAddon align="inline-start">
              <IoKeyOutline />
            </InputGroupAddon>
            <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </InputGroupButton>
          </InputGroup>
        </Field>
        <Field className="-mt-4">
          <InputGroup>
            <InputGroupInput 
              placeholder="Confirmar Senha"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
            />
            <InputGroupAddon align="inline-start">
              <IoKeyOutline />
            </InputGroupAddon>
            <InputGroupButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </InputGroupButton>
          </InputGroup>
        </Field>
        <Button
          className="bg-green-300 dark:bg-green-400 cursor-pointer w-52 self-center"
        >
          Cadastrar
        </Button>
      </FieldGroup>
    </div>
  );
}