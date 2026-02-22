import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import ThemeSelector from "../components/theme/ThemeSelector";
import { useAuth } from "@/providers/AuthContext";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

export const DashboardComponents = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen dark:bg-gray-900 bg-gray-100 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Área onde o conteúdo vai mudar depois */}
        <div className="p-6">
          <Outlet /> 
        </div>

      </main>
    </SidebarProvider>
  )
}