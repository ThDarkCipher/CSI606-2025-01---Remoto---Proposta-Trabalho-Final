using GemaGestor.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace GemaGestor.Models.Pedras
{
    public class Lote
    {
        public long Id { get; set; }
        public string Descricao { get; set; } = string.Empty; 
        public DateTime DataAquisicao { get; set; } = DateTime.UtcNow;
        [Column(TypeName = "decimal(18,4)")]
        public decimal Peso { get; set; }
        public List<User> Donos { get; set; } = new List<User>();
        public List<Pedra> Pedras { get; set; } = new List<Pedra>();
        public int Quantidade { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorInicial { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDeTrabalho { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorFinal { get; set; }
        public Tenancy Tenancy { get; set; } = null!;

    }
}
