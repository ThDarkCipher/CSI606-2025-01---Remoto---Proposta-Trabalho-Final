import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/AuthContext";
import axios from "axios";
import { Gem, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PedraBruta {
  id: number;
  nome: string;
  peso: number;
  valorInicial: number
  dataAquisicao: string //Refatorar aqui e no back para receber uma data pelo usuario ao inves de definir
  regiao: string;
}

export function PedrasBrutas() {
  const { token } = useAuth();
  const [pedras, setPedras] = useState<PedraBruta[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    peso: "",
    valorInicial: "",
    descricao: "",
    regiao: "",
    dataAquisicao: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchPedras = () => {
      if (!token) return;

      axios.get(`${import.meta.env.VITE_APP_API_HOST}/Brutas`, {
        headers: { Authorization: `Bearer ${token}` }

      })
        .then((response) => {
          // Back-end pode devolver um array direto ou um objeto, ajustadado aqui
          setPedras(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar pedras brutas:", error);
          setLoading(false);
        });
    }
    fetchPedras();
  }, [token]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      peso: parseFloat(formData.peso),
      valorInicial: parseFloat(formData.valorInicial)
    };
    payload.dataAquisicao += "T00:00:00Z"

    axios.post(`${import.meta.env.VITE_APP_API_HOST}/Brutas`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setIsDialogOpen(false); // Fecha o Dialog ao invés da Gaveta
        setFormData({ nome: "", peso: "", valorInicial: "", descricao: "", regiao: "", dataAquisicao: new Date().toISOString().split('T')[0] });
      })
      .catch((error) => {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar pedra. Verifique se preencheu tudo corretamente.");
      });
  };


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatWeight = (value: number) =>
    `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} g`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="-space-y-6">
      {/* Cabeçalho da tela */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className=" text-2xl font-bold dark:text-white text-gray-900 flex items-center gap-2 mb-4">
            <Gem className="text-purple-500" /> Estoque de Pedras Brutas
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 cursor-pointer mr-18">
              <Plus size={18} /> Nova Pedra
            </Button>
          </DialogTrigger>

          {/* Conteúdo do Modal centralizado */}
          <DialogContent className="sm:max-w-md dark:bg-gray-900 border dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Cadastrar Nova Pedra</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Insira os detalhes da pedra bruta recém-adquirida.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="dark:text-gray-300">Nome da Pedra *</Label>
                <Input id="nome" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: Esmeralda Bruta" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peso" className="dark:text-gray-300">Peso (g) *</Label>
                  <Input id="peso" type="number" step="0.01" required value={formData.peso} onChange={(e) => setFormData({ ...formData, peso: e.target.value })} placeholder="0.00" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor" className="dark:text-gray-300">Valor Pago (R$) *</Label>
                  <Input id="valor" type="number" step="0.01" required value={formData.valorInicial} onChange={(e) => setFormData({ ...formData, valorInicial: e.target.value })} placeholder="0.00" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regiao" className="dark:text-gray-300">Região de Origem</Label>
                <Input id="regiao" value={formData.regiao} onChange={(e) => setFormData({ ...formData, regiao: e.target.value })} placeholder="Ex: Minas Gerais" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data" className="dark:text-gray-300">Data de Aquisição</Label>
                <Input id="data" type="date" value={formData.dataAquisicao} onChange={(e) => setFormData({ ...formData, dataAquisicao: e.target.value })} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="dark:text-gray-300">Descrição / Anotações</Label>
                <Input id="descricao" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} placeholder="Detalhes extras..." className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>

              <div className="pt-4 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:border-gray-700 dark:text-gray-300 cursor-pointer">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
                  Salvar Pedra
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden mt-8 ">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Região</th>
                <th className="px-6 py-4">Data Aquisição</th>
                <th className="px-6 py-4">Peso</th>
                <th className="px-6 py-4">Valor Pago</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-b dark:border-gray-700" >
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-6 rounded mx-auto" /></td>
                  </tr>

                ))
              ) : pedras.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma pedra bruta encontrada. Clique em "Nova Pedra" para cadastrar!
                  </td>
                </tr>
              ) : (
                // Linhas reais da tabela
                pedras.map((pedra) => (
                  <tr key={pedra.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {pedra.nome}
                    </td>
                    <td className="px-6 py-4">{pedra.regiao || "-"}</td>
                    <td className="px-6 py-4">{formatDate(pedra.dataAquisicao)}</td>
                    <td className="px-6 py-4 text-right font-medium text-blue-600 dark:text-blue-400">
                      {formatWeight(pedra.peso)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(pedra.valorInicial)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}