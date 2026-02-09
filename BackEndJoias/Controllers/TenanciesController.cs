using GemaGestor.Data;
using GemaGestor.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GemaGestor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenanciesController : ControllerBase {
        private readonly WhitelabelContext _context;

        public TenanciesController(WhitelabelContext context) {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tenancy>>> GetTenancy() {
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if (loggedUser.Tenancy != null) {
                return Unauthorized(new { message = "Apenas usuários sem tenancy podem acessar essa rota" });
            }
            return Ok(new { message = "Tenancies recuperadas", tenancies = _context.Tenancy.ToListAsync() });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Tenancy>> GetTenancy(long id) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(loggedUser.Tenancy != null) {
                return Unauthorized(new { message = "Apenas usuários sem tenancy podem acessar essa rota" });
            }
            var tenancy = await _context.Tenancy.FindAsync(id);

            if(tenancy == null) {
                return NotFound(new { message = "Tenancy não encontrada" });
            }

            return tenancy;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Tenancy>> PostTenancy(Tenancy tenancy) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(loggedUser.Tenancy != null) {
                return Unauthorized(new { message = "Apenas usuários sem tenancy podem acessar essa rota" });
            }
            var tenancyExists = _context.Tenancy.Where(t => t.Name == tenancy.Name).Any();
            if(tenancyExists) {
                return Conflict(new { message = "Tenancy já existe" });
            }
            _context.Tenancy.Add(tenancy);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tenancy criada" });
        }

        // DELETE: api/Tenancies/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTenancy(long id) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(loggedUser.Tenancy != null) {
                return Unauthorized(new { message = "Apenas usuários sem tenancy podem acessar essa rota" });
            }
            var tenancy = await _context.Tenancy.FindAsync(id);
            if(tenancy == null) {
                return NotFound(new { message = "Tenancy não encontrada"});
            }

            _context.Tenancy.Remove(tenancy);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tenancy removida" });
        }
    }
}
