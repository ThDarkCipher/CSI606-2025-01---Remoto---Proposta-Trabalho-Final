import { useAuth } from "@/providers/AuthContext";
import { Link } from "react-router-dom";
import { DashboardComponents } from "@/components/DashboardComponents";
import ThemeSelector from "@/components/theme/ThemeSelector";


export const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen w-full items-center justify-center dark:bg-gray-900 bg-gray-100 text-white">
      <DashboardComponents />
      <div className="fixed top-4 right-4" >
        <ThemeSelector />
      </div>
    </div>
  );
};