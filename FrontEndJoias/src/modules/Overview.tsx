import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Gem, Layers, TrendingUp } from "lucide-react";

interface DashboardResumo {
  nomeEmpresa: string;
  totalLotes: number;
  valorTotalInvestido: number;
  totalPedras: number;
  pesoTotalEstoque: number;
  precoMedioPorGrama: number;
}

export function Overview() {
  const [resumo, setResumo] = useState<DashboardResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_HOST}/Dashboard/resumo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setResumo(response.data);
        setLoading(false);

      })
      .catch((err) => {
        console.error("Erro ao buscar dashboard:", err);
        setError("Não foi possível carregar os dados. Você está autenticado?");
        setLoading(false);
      });
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(value);

  const formatWeight = (value: number) =>
    `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} g`;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white text-gray-900">
        Visão Geral - {resumo?.nomeEmpresa}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Investimento total */}
        <div className="p-6 bh-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Investido</span>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(resumo?.valorTotalInvestido || 0)}
            </span>
          </div>
        </div>
        {/* Lotes */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Meus Lotes</span>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {resumo?.totalLotes} <span className="text-sm font-normal text-gray-500">cadastrados</span>
            </span>
          </div>
        </div>
        {/* Pedras Brutas */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedras Brutas</span>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Gem className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {resumo?.totalPedras} <span className="text-sm font-normal text-gray-500">pedras</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Peso Total: {formatWeight(resumo?.pesoTotalEstoque || 0)}
            </span>
          </div>
        </div>
        {/* Preço Medio */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Preço Médio (g)</span>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(resumo?.precoMedioPorGrama || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}