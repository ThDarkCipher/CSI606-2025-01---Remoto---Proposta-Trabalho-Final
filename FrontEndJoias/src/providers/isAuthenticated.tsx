import { Navigate, Outlet } from "react-router-dom";
import { GetMe } from "./GetMe";

export async function IsAuthenticated() {
  // if (!sessionStorage.getItem("token"))
  //   return <Navigate to="/" />
  const isAuthenticated = await GetMe();
    if(isAuthenticated) {
      if (window.location.pathname != "/") {
        return <Outlet/>
      }
      return <Navigate to="/dashboard"/>
    }
    return <Navigate to="/" />
}