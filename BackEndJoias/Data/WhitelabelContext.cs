using GemaGestor.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using GemaGestor.Models.Pedras;

namespace GemaGestor.Data
{
    public class WhitelabelContext : IdentityDbContext<User, Role, long, IdentityUserClaim<long>, IdentityUserRole<long>, IdentityUserLogin<long>, IdentityRoleClaim<long>, IdentityUserToken<long>> {
        public WhitelabelContext(DbContextOptions<WhitelabelContext> options)
            : base(options) {
        }

        public DbSet<User> User { get; set; } = default!;
        public DbSet<Tenancy> Tenancy { get; set; } = default!;
        public DbSet<Lote> Lotes { get; set; } = default!;
        public DbSet<Bruta> Bruta { get; set; } = default!;

    }
}
