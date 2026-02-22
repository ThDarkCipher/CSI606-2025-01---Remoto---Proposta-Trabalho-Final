import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { PrivateRouteType } from "@/types/PrivateRouteType";

export default function PrivateRoute(props: PrivateRouteType) {
    const { user } = useAuth();
    console.log (user)
    if (!props.hasRoles) {
        return user ? <Outlet /> : <Navigate to="/" replace/>
    }
    const itemComum = props.hasRoles.some(role => user?.roles.includes(role));
    return itemComum  ? <Outlet /> : <Navigate to="/dashboard" replace/>
}