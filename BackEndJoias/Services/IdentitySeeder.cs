using GemaGestor.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace GemaGestor.Services
{
    public class IdentitySeeder {
        public static async Task SeedRolesAndAdminAsync(RoleManager<Role> roleManager, UserManager<User> userManager) {
            Console.WriteLine("Começando a criação de roles e usuário admin...");
            string[] roleNames = { "Admin", "User" };
            foreach(var roleName in roleNames) {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if(!roleExist) {
                    Console.WriteLine($"Criando role {roleName}...");
                    await roleManager.CreateAsync(new Role(roleName));
                }
            }
            var adminUser = await userManager.FindByNameAsync("admin");
            if(adminUser == null) {
                var admin = new User("admin");
                Console.WriteLine("Criando usuário admin...");
                var createAdmin = await userManager.CreateAsync(admin, "Admin@123");
                if(createAdmin.Succeeded) {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}
