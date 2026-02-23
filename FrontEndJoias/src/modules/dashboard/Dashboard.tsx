//import { useAuth } from "@/providers/AuthContext";
//import { Link } from "react-router-dom";
import { SidebarOutlet } from "@/components/SidebarOutlet";
import ThemeSelector from "@/components/theme/ThemeSelector";


export const Dashboard = () => {
  //const { user } = useAuth();
  return (
    <>
      <SidebarOutlet />
      <div className="fixed top-4 right-4 z-50" >
        <ThemeSelector />
      </div>
    </>
  );
};