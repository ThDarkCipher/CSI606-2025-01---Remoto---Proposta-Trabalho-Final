using System.ComponentModel.DataAnnotations;

namespace GemaGestor.DTOs {
    public class CreateLoteDTO {
        [Required(ErrorMessage = "A descrição é obrigatória.")]
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataAquisicao { get; set; } = DateTime.UtcNow;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O custo deve ser maior que zero.")]
        public decimal CustoTotal { get; set; }


        [Required(ErrorMessage = "O peso total do lote é obrigatório.")]
        public decimal PesoTotal { get; set; }

        [Required(ErrorMessage = "A quantidade de pedras é obrigatória.")]
        public int QuantidadeDePedras { get; set; }
    }
}