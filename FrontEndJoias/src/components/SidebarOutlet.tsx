import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/providers/AuthContext";
import { AppSidebar } from "./AppSidebar";
import { Outlet, useNavigate } from "react-router-dom"; // Importamos o useNavigate!
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import ThemeSelector from "./theme/ThemeSelector"; // Assumindo que o seu seletor de tema fica aqui

export const SidebarOutlet = () => {
  // Puxamos também a função logout do contexto
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Função que executa ao clicar em sair
  const handleLogout = () => {
    logout(); // Limpa o token e o user
    navigate("/"); // Manda direto pra página de login
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* Flex-col para separar o cabeçalho do conteúdo */}
      <main className="flex-1 flex flex-col min-h-screen dark:bg-gray-900 bg-gray-100 text-gray-900 dark:text-white transition-colors duration-300">

        {/* Barra Superior Elegante */}
        <header className="flex h-16 shrink-0 items-center justify-end px-6 border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Olá, {user?.userName || "Joalheiro"}
            </span>

            <ThemeSelector />

            {/* Divisória visual */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {/* O Botão de Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 gap-2 cursor-pointer transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </header>

        {/* Área de Conteúdo */}
        <div className="p-6 flex-1 overflow-x-hidden">
          <Outlet />
        </div>

      </main>
    </SidebarProvider>
  )
}