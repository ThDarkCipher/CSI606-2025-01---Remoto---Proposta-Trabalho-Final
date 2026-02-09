using GemaGestor.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace GemaGestor.Models.Pedras
{
    public class Pedra{
        public long Id { get; set; }
        public  Lote? Lote { get; set; }
        public string Nome { get; set; } = String.Empty;
        [Column(TypeName = "decimal(18,4)")]
        public decimal Peso { get; set; }
        public List<User> Donos { get; set; } = new List<User>();
        public byte[]? Foto { get; set; }
        public string? Regiao { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorInicial { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDeTrabalho { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorFinal { get; set; }
        public string? Descricao { get; set; } 
        public DateTime DataAquisicao { get; set; } = DateTime.UtcNow;
        public Tenancy Tenancy { get; set; } = null!;
    }
}
