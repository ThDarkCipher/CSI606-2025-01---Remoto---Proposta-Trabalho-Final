import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // O useEffect roda assim que a tela abre
  useEffect(() => {
    const buscarDados = async () => {
      // 1. Pega o crachá do bolso (LocalStorage)
      const token = localStorage.getItem("token");

      // Se não tiver crachá, expulsa pro Login
      if (!token) {
        navigate("/");
        return;
      }

      try {
        // 2. Bate na API do C# enviando o Token no Cabeçalho (Header)
        const response = await axios.get("http://localhost:5059/api/Dashboard/Resumo", {
          headers: {
            Authorization: `Bearer ${token}`, // ⚠️ É AQUI QUE A MÁGICA DO [Authorize] ACONTECE
          },
        });

        // 3. Salva os dados para mostrar na tela
        setResumo(response.data);
      } catch (err) {
        console.error("Erro ao buscar resumo:", err);
        setErro("Sessão expirada ou erro de conexão. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    buscarDados();
  }, [navigate]);

  // Função para formatar dinheiro (R$)
  const formatarDinheiro = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Se ainda estiver carregando, mostra uma mensagem
  if (!resumo) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Carregando painel...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">GemaGestor</h1>
          <p className="text-gray-400">Visão Geral - Empresa: <span className="text-white font-semibold">{resumo.nomeEmpresa}</span></p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
        >
          Sair
        </button>
      </div>

      {/* Grid de Cards (Os quadradinhos com os números) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Lotes */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">Total de Lotes</h3>
          <p className="text-4xl font-bold">{resumo.totalLotes}</p>
        </div>

        {/* Card 2: Valor Investido */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Investido</h3>
          <p className="text-3xl font-bold text-green-400">{formatarDinheiro(resumo.valorTotalInvestido)}</p>
        </div>

        {/* Card 3: Pedras Cadastradas */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">Pedras no Estoque</h3>
          <p className="text-4xl font-bold">{resumo.totalPedras}</p>
          <p className="text-sm text-gray-500 mt-2">Peso: {resumo.pesoTotalEstoque}g</p>
        </div>

        {/* Card 4: Ticket Médio */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">Preço Médio / Grama</h3>
          <p className="text-3xl font-bold text-yellow-400">{formatarDinheiro(resumo.precoMedioPorGrama)}</p>
        </div>

      </div>

      {/* Área de Ações (Botões grandes para o futuro) */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold shadow-lg transition">
            + Novo Lote
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold shadow-lg transition text-gray-300">
            Ver Estoque
          </button>
        </div>
      </div>

    </div>
  );
};