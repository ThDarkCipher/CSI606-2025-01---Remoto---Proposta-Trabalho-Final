import { Navigate, Outlet } from "react-router-dom";
import { GetMe } from "./GetMe";

export async function IsNotAuthenticated() {
  return (
    await GetMe() ? <Navigate to="/" /> : <Outlet />
  );
}