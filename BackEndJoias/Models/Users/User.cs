using Microsoft.AspNetCore.Identity;

namespace GemaGestor.Models.Users
{
    public class User : IdentityUser<long> {
        public string? SecretKey { get; set; }
        public virtual Tenancy? Tenancy { get; set; }
        public User() { }
        public User(string userName) : base(userName) { }
        public User(string userName, string Email) : base(userName) {
            this.Email = Email;
        }
    }
}
