using GemaGestor.Data;
using GemaGestor.DTOs;
using GemaGestor.Models.Pedras;
using GemaGestor.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GemaGestor.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LotesController : ControllerBase {
        private readonly WhitelabelContext _context;
        private readonly UserManager<User> _userManager;

        public LotesController(WhitelabelContext context, UserManager<User> userManager) {
            _context = context;
            _userManager = userManager;
        }

        // 1- Criar o Lote (POST)
        [HttpPost]
        public async Task<ActionResult<Lote>> CreateLote(CreateLoteDTO dto) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                           .FindFirst(ClaimTypes.Name).Value)
                                           .Include(u => u.Tenancy).First<User>();

            //Verificar se o usuário tem empresa
            if (loggedUser.Tenancy == null) {
                return BadRequest(new { message = "Usuário sem empresa vinculada" });
            }

            // Mapeando DTO para a Model Lote
            var novoLote = new Lote {
                Descricao = dto.Descricao,
                DataAquisicao = dto.DataAquisicao,

                // Financeiro
                ValorDeTrabalho = 0,



                // Vínculos (Segurança)
                Tenancy = loggedUser.Tenancy!,
                Donos = new List<User> { loggedUser }
            };

            _context.Lotes.Add(novoLote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLote), new { id = novoLote.Id }, new { message = "Lote criado com sucesso", novoLote });
        }

        // 2- Listar (GET) - Apenas lotes da empresa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lote>>> GetLotes() {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                           .FindFirst(ClaimTypes.Name).Value)
                                           .Include(u => u.Tenancy).First<User>();

            if (loggedUser?.Tenancy == null) {
                // Se não tiver empresa, retorna vazio ou erro (segurança)
                return NotFound(new { message = "Usuário sem empresa." });
            }

            return await _context.Lotes
                                 .Include(l => l.Tenancy)
                                 .Include(l => l.Pedras)
                                 .Where(l => l.Tenancy.Id == loggedUser.Tenancy.Id)
                                 .ToListAsync();
        }

        // 3- Buscar por ID (GET)
        [HttpGet("{id}")]
        public async Task<ActionResult<Lote>> GetLote(long id) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                           .FindFirst(ClaimTypes.Name).Value)
                                           .Include(u => u.Tenancy).First<User>();

            var loteQuery = _context.Lotes.Where(l => l.Id == id).Include(l => l.Tenancy);

            // Verificação de existência
            if (!loteQuery.Any()) {
                return NotFound(new { message = "Lote não encontrado" });
            }

            var lote = loteQuery.First();

            // Verificação de Segurança (Tenancy)
            if (lote.Tenancy.Id != loggedUser.Tenancy.Id) {
                return NotFound(new { message = "Lote não encontrado" }); // Finge que não existe pra quem não é dono
            }

            return Ok(new { message = "Lote encontrado", lote = lote });
        }

        [HttpGet("pedras/{id}")]
        public async Task<IActionResult> GetPedras(long id) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                          .FindFirst(ClaimTypes.Name).Value)
                                          .Include(u => u.Tenancy).First<User>();

            var loteQuery = _context.Lotes.Where(l => l.Id == id)
                                          .Include(l => l.Tenancy)
                                          .Include(l =>l.Pedras);

            // Verificação de existência
            if (!loteQuery.Any()) {
                return NotFound(new { message = "Lote não encontrado" });
            }

            var lote = loteQuery.First();

            // Verificação de Segurança (Tenancy)
            if (lote.Tenancy.Id != loggedUser.Tenancy.Id) {
                return NotFound(new { message = "Lote não encontrada" }); // Finge que não existe pra quem não é dono
            }
            return Ok(new { message = "Lote encontrado", lotePedras = lote.Pedras });

        }

        // 4- Deletar (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLote(long id) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                           .FindFirst(ClaimTypes.Name).Value)
                                           .Include(u => u.Tenancy).First<User>();

            var loteQuery = _context.Lotes.Where(l => l.Id == id).Include(l => l.Tenancy);

            if (!loteQuery.Any()) {
                return NotFound();
            }

            var lote = loteQuery.First();

            if (lote.Tenancy.Id != loggedUser.Tenancy!.Id) {
                return Forbid();
            }

            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("adicionar-pedra/{id}")]
        //trocar pra id
        public async Task<IActionResult> AdicionarPedraAoLote(long id, long pedraId) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User //trocar pra id
                                           .FindFirst(ClaimTypes.Name).Value)
                                           .Include(u => u.Tenancy).First<User>();
            var loteQuery = _context.Lotes.Where(l => l.Id == id).Include(l => l.Tenancy);
            if (!loteQuery.Any()) {
                return NotFound(new { message = "Lote não encontrado" });
            }
            var lote = loteQuery.First();
            if (lote.Tenancy.Id != loggedUser.Tenancy!.Id) {
                return Forbid();
            }
            //ferificar depois se vai funcionar pros outros estagios da pedra, se não tiver problema, pode ser só isso mesmo
            var pedraQuery = _context.Bruta.Where(p => p.Id == pedraId).Include(p => p.Tenancy);
            if (!pedraQuery.Any()) {
                return NotFound(new { message = "Pedra não encontrada" });
            }
            var pedra = pedraQuery.First();
            if (pedra.Tenancy.Id != loggedUser.Tenancy.Id) {
                return Forbid();
            }
            // Vincular a pedra ao lote
            lote.Pedras.Add(pedra);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Pedra adicionada ao lote com sucesso", lote });

        }
    }
}