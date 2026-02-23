import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/providers/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Layers, Trash2 } from "lucide-react";
// Importações corretas do nosso UI
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoLink } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

interface PedraBruta {
  id: number;
  nome: string;
  peso: number;
  valorInicial: number;
  dataAquisicao: string;
  regiao: string;
}

interface Lote {
  id: number;
  descricao: string;
  dataAquisicao: string;
}

export function Lotes() {
  const { token } = useAuth();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  // Controle do Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isPedraDialogOpen, setIsPedraDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    descricao: "",
    //custoTotal: "",
    dataAquisicao: new Date().toISOString().split('T')[0]
  });
  const [pedraId, setPedraId] = useState<string>("")
  const [pedras, setPedras] = useState<PedraBruta[]>([])

  const fetchLotes = () => {
    if (!token) return;

    axios.get(`${import.meta.env.VITE_APP_API_HOST}/Lotes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setLotes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar lotes:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLotes();
  }, [token]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      descricao: formData.descricao,
      dataAquisicao: formData.dataAquisicao
    };
    payload.dataAquisicao += "T00:00:00Z"


    axios.post(`${import.meta.env.VITE_APP_API_HOST}/Lotes`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setIsDialogOpen(false);
        fetchLotes();
        setFormData({ descricao: "", dataAquisicao: new Date().toISOString().split('T')[0] });
      })
      .catch((error) => {
        console.error("Erro ao cadastrar lote:", error);
        alert("Erro ao cadastrar lote. Tente novamente.");
      });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este lote? Todas as pedras vinculadas a ele ficarão sem lote.")) {
      return;
    }

    axios.delete(`${import.meta.env.VITE_APP_API_HOST}/Lotes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchLotes();
      })
      .catch((error) => {
        console.error("Erro ao excluir lote:", error);
        alert("Não foi possível excluir o lote.");
      });
  };

  const handleLink = (id: number) => {
    axios.post(`${import.meta.env.VITE_APP_API_HOST}/Lotes/adicionar-pedra/${id}?pedraId=${pedraId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const handlePedra = (id: number) => {
    axios.get(`${import.meta.env.VITE_APP_API_HOST}/Lotes/pedras/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        console.log(response.data.lotePedras)
        setPedras(response.data.lotePedras)
        setIsPedraDialogOpen(true)
      })

  }

  // const formatCurrency = (value: number) =>
  //   new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="-space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900 flex items-center gap-2 mb-4">
            <Layers className="text-blue-500" /> Gerenciamento de Lotes
          </h2>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer mr-18">
              <Plus size={18} /> Novo Lote
            </Button>
          </DialogTrigger>

          {/* Modal */}
          <DialogContent className="sm:max-w-md dark:bg-gray-900 border dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Cadastrar Novo Lote</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Agrupe compras de múltiplas pedras em um único lote.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="dark:text-gray-300">Identificação do Lote *</Label>
                <Input id="nome" required value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} placeholder="Ex: Lote Malange 01/26" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="custo" className="dark:text-gray-300">Custo Total (R$) *</Label>
                <Input id="custo" type="number" step="0.01" required value={formData.custoTotal} onChange={(e) => setFormData({ ...formData, custoTotal: e.target.value })} placeholder="0.00" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="data" className="dark:text-gray-300">Data da Compra</Label>
                <Input id="data" type="date" required value={formData.dataAquisicao} onChange={(e) => setFormData({ ...formData, dataAquisicao: e.target.value })} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>

              <div className="pt-4 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:border-gray-700 dark:text-gray-300 cursor-pointer">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Salvar Lote
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Lotes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Nome do Lote</th>
                <th className="px-6 py-4">Data da Compra</th>
                {/* <th className="px-6 py-4 text-right">Custo Total</th> */}
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2].map((i) => (
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-6 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : lotes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhum lote encontrado. Clique em "Novo Lote" para cadastrar!
                  </td>
                </tr>
              ) : (
                lotes.map((lote) => (
                  <tr key={lote.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lote.descricao}</td>
                    <td className="px-6 py-4">{formatDate(lote.dataAquisicao)}</td>
                    {/* <td className="px-6 py-4 text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(lote.custoTotal)}</td> */}
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(lote.id)} className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer">
                        <Trash2 size={18} />
                      </Button>
                      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 cursor-pointer">
                            <IoLink size={18} />
                          </Button>
                        </DialogTrigger>

                        {/* Modal */}
                        <DialogContent className="sm:max-w-md dark:bg-gray-900 border dark:border-gray-800">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">Atribuir Pedra a Lote</DialogTitle>
                            <DialogDescription className="dark:text-gray-400">
                              Atribua suas pedras em um único lote.
                            </DialogDescription>
                          </DialogHeader>



                          <form onSubmit={() => handleLink(lote.id)} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="pedraid" className="dark:text-gray-300">ID da Pedra</Label>
                              <Input id="pedraid" type="number" step="1" required value={pedraId} onChange={(e) => setPedraId(e.target.value)} placeholder="0" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                            </div>

                            <div className="pt-4 flex gap-2 justify-end">
                              <Button type="button" variant="outline" onClick={() => setIsLinkDialogOpen(false)} className="dark:border-gray-700 dark:text-gray-300 cursor-pointer">
                                Cancelar
                              </Button>
                              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                Salvar Lote
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isPedraDialogOpen} onOpenChange={() => handlePedra(lote.id)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer">
                            <FaEye size={18} />
                          </Button>
                        </DialogTrigger>

                        {/* Modal */}
                        <DialogContent className="sm:max-w-md dark:bg-gray-900 border dark:border-gray-800">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">Pedras no lote</DialogTitle>
                            <DialogDescription className="dark:text-gray-400">
                              Pedras presentes no lote {lote.descricao}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                              <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                                <tr>
                                  <th className="px-6 py-4">Nome</th>
                                  <th className="px-6 py-4 text-right">Peso</th>
                                  <th className="px-6 py-4 text-right">Valor Pago</th>
                                </tr>
                              </thead>
                              <tbody>{
                                pedras.map((pedra) => {
                                  return (
                                    <tr>
                                      <td className="px-6 py-4">{pedra.nome}</td>
                                      <td className="px-6 py-4 text-right">{pedra.peso}</td>
                                      <td className="px-6 py-4 text-right">{pedra.valorInicial}</td>
                                    </tr>
                                  )
                                })
                              }
                              </tbody>
                            </table>
                          </div>
                          <div className="pt-4 flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsPedraDialogOpen(false)} className="dark:border-gray-700 dark:text-gray-300 cursor-pointer">
                              Cancelar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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