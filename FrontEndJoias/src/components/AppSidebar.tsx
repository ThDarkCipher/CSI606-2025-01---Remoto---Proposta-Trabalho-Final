
import {
  Home,
  Gem,
  Layers,
  DollarSign,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/AuthContext"
import { Link } from "react-router-dom";

const items = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
  { title: "Pedras Brutas", url: "/dashboard/pedras-brutas", icon: Gem },
  { title: "Meus Lotes", url: "/dashboard/lotes", icon: Layers },
  { title: "Financeiro", url: "/dashboard/financeiro", icon: DollarSign },
]

export function AppSidebar() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("Admin");

  return (
    //Lembre-se ajustar o icone do sidebar depois, pelo amor de deus
    <Sidebar collapsible="icon">
      <SidebarHeader className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center gap-2 px-1">
            <SidebarTrigger className="shrink-0" />
            <span className="text-blue-500 font-bold text-lg truncate group-data-[collapsible=icon]:hidden">GemaGestor 💎</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* {isAdmin && (
                <SidebarMenuItem className="mt-4 border-t border-gray-700 pt-2">
                  <SidebarMenuButton asChild>
                    <a href="#" className="dark:text-gray-200 text-gray-900">
                      <Settings />
                      <span>Configurações (Admin)</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )} */}
              {isAdmin && user?.tenancy == null && (
                <SidebarMenuItem className="mt-4 border-t border-gray-700 pt-2">
                  <SidebarMenuButton asChild>
                    <Link to="/tenancy/create" className="dark:text-gray-200 text-gray-900">
                      <Settings />
                      <span>Criar Empresa</span>
                    </Link >
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    </Sidebar >
  )
}