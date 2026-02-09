using GemaGestor.Models.Pedras;

namespace GemaGestor.Models.Users
{
    public class Tenancy {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Cnpj { get; set; }
        public List<User> Users { get; set; } = new List<User>();
        public List<Lote> Lotes { get; set; } = new List<Lote>();
        public List<Bruta> PedrasBrutas { get; set; } = new List<Bruta>();
        public List<Formada> PedrasFormadas { get; set; } = new List<Formada>();
        public List<Lapidada> PedrasLapidadas { get; set; } = new List<Lapidada>();
    }
}
