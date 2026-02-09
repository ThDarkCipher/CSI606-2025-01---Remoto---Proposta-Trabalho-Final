using System.ComponentModel.DataAnnotations;

namespace GemaGestor.DTOs {
    public class CreateBrutaDTO {
        [Required(ErrorMessage = "O campo 'Nome' é obrigatório.")]
        public string Nome { get; set; } = string.Empty;
        [Required(ErrorMessage = "O peso é obrigatório.")]
        [Range(0.0001, double.MaxValue, ErrorMessage = "O peso dever maior que 0.0001 ")]
        public decimal Peso { get; set; }
        [Required(ErrorMessage = "O valor da compra é obrigatório.")]
        public string? Descricao { get; set; } 
        public DateTime? DataAquisicao { get; set; }
        public decimal ValorInicial { get; set; }
        public string? Regiao { get; set; }
        public long? LoteId { get; set; }   
    }
}
