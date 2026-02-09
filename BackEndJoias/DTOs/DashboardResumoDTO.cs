namespace GemaGestor.DTOs {
    public class DashboardResumoDTO {
        public string NomeEmpresa { get; set; } = string.Empty;

        //1: Lotes
        public int TotalLotes { get; set; }
        public decimal ValorTotalInvestido { get; set; } // Soma dos Valores Iniciais dos Lotes

        //2: Pedras
        public int TotalPedras { get; set; }
        public decimal PesoTotalEstoque { get; set; } // Soma do peso das brutas

        // Opcional: Card de Ticket Médio (Custo por grama médio)
        public decimal PrecoMedioPorGrama { get; set; }
    }
}