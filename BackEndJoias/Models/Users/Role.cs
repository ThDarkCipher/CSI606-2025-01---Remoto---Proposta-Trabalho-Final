using Microsoft.AspNetCore.Identity;

namespace GemaGestor.Models.Users
{
    public class Role : IdentityRole<long> {
        public Role() { }
        public Role(string roleName) : base(roleName) { }
    }
}
