import axios from "axios";

export async function GetMe(): Promise<boolean> {
  const header = {
    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    "Content-Type": "application/json"
  }
  
  return axios.get<boolean>(`${import.meta.env.VITE_APP_API_HOST}/Users/me`, { headers: header })

    .then((response) => {
      console.log(response);
      console.log("Token válido");
      return true;
    })
    .catch((response) => {
      console.log(response);
      console.log("Token inválido ou ausente");
      return false;
    });
  }