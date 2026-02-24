using System.ComponentModel.DataAnnotations;

namespace GemaGestor.DTOs {
    public class CreateLoteDTO {
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataAquisicao { get; set; } = DateTime.UtcNow;

    }
}