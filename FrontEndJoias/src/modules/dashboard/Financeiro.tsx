import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/providers/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ArrowDownRight, Wallet, Receipt } from "lucide-react";

// Interfaces baseadas no que já construímos
interface PedraBruta {
  id: number;
  nome: string;
  valorInicial: number;
  dataAquisicao: string;
}

interface Lote {
  id: number;
  nome: string;
  custoTotal: number;
  dataCompra: string;
}

// Uma interface nova que criámos só para a nossa tabela misturada
interface Transacao {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
}

export function Financeiro() {
  const { token } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Totais calculados
  const [totalLotes, setTotalLotes] = useState(0);
  const [totalPedras, setTotalPedras] = useState(0);

  useEffect(() => {
    if (!token) return;

    // Buscamos os Lotes e as Pedras Brutas ao MESMO TEMPO usando Promise.all
    const fetchFinanceiro = async () => {
      try {
        const [lotesRes, brutasRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_API_HOST}/Lotes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_APP_API_HOST}/Brutas`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const lotes: Lote[] = lotesRes.data;
        const brutas: PedraBruta[] = brutasRes.data;

        // 1. Calcular os totais
        const somaLotes = lotes.reduce((acc, lote) => acc + lote.custoTotal, 0);
        const somaPedras = brutas.reduce((acc, pedra) => acc + pedra.valorInicial, 0);
        setTotalLotes(somaLotes);
        setTotalPedras(somaPedras);

        // 2. Transformar tudo no formato padrão de "Transação" para a nossa tabela
        const historico: Transacao[] = [
          ...lotes.map(l => ({
            id: `LOTE-${l.id}`,
            descricao: `Compra de Lote: ${l.nome}`,
            categoria: "Lote",
            valor: l.custoTotal,
            data: l.dataCompra
          })),
          ...brutas.map(p => ({
            id: `PEDRA-${p.id}`,
            descricao: `Compra de Pedra Bruta: ${p.nome}`,
            categoria: "Pedra Bruta (Avulsa)",
            valor: p.valorInicial,
            data: p.dataAquisicao
          }))
        ];

        // 3. Ordenar da mais recente para a mais antiga
        historico.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        setTransacoes(historico);
        setLoading(false);

      } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error);
        setLoading(false);
      }
    };

    fetchFinanceiro();
  }, [token]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 flex items-center gap-2">
          <DollarSign className="text-emerald-500" /> Fluxo de Caixa e Despesas
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Acompanhe todos os investimentos feitos em aquisição de gemas.
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Geral Investido */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Wallet size={18} /> <span className="text-sm font-medium uppercase">Investimento Total</span>
          </div>
          {loading ? <Skeleton className="h-8 w-32" /> : (
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalLotes + totalPedras)}
            </span>
          )}
        </div>

        {/* Card 2: Lotes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-2">
            <ArrowDownRight size={18} /> <span className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">Gasto com Lotes</span>
          </div>
          {loading ? <Skeleton className="h-8 w-32" /> : (
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totalLotes)}
            </span>
          )}
        </div>

        {/* Card 3: Pedras Brutas Avulsas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-2">
            <ArrowDownRight size={18} /> <span className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">Gasto com Pedras (Avulsas)</span>
          </div>
          {loading ? <Skeleton className="h-8 w-32" /> : (
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totalPedras)}
            </span>
          )}
        </div>
      </div>

      {/* Tabela de Histórico */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex items-center gap-2">
          <Receipt className="text-gray-500" size={18} />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Histórico de Aquisições</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">Valor da Despesa</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : transacoes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma despesa registada. As suas compras de Lotes e Pedras aparecerão aqui.
                  </td>
                </tr>
              ) : (
                transacoes.map((t) => (
                  <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(t.data)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.descricao}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.categoria === 'Lote'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                        {t.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600 dark:text-red-400">
                      - {formatCurrency(t.valor)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}