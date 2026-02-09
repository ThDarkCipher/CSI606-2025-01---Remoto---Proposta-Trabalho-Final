using GemaGestor.Models.Users;

namespace GemaGestor.Models.Pedras
{
    public class Lapidada : Pedra{
        public Formato Formato { get; set; } = Formato.Indefinido;
        public List<User> Lapidarios { get; set; } = new List<User>();
        public float Largura { get; set; }
        public float Altura { get; set; }
        public float Profundidade { get; set; }

    }
}
