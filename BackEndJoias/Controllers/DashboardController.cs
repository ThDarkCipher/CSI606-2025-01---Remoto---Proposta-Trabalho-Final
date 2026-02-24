using GemaGestor.Data;
using GemaGestor.DTOs;
using GemaGestor.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GemaGestor.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase {
        private readonly WhitelabelContext _context;
        private readonly UserManager<User> _userManager;
        public DashboardController(WhitelabelContext context, UserManager<User> userManager) {
            _context = context;
            _userManager = userManager;
        }
        [HttpGet("resumo")]
        public async Task<ActionResult<DashboardResumoDTO>> GetResumo() {
            //1.Buscando o usuário logado e sua empresa (tenancy)
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                          .FindFirst(ClaimTypes.Name).Value)
                                          .Include(u => u.Tenancy).First<User>();
            //Validando se o usuário tem empresa vinculada
            if (loggedUser.Tenancy == null) {
                return BadRequest("Usuário sem empresa vinculada.");
            }
            var tenancyId = loggedUser.Tenancy.Id;

            //2. Busca dados dos LOTES (Agrupando no Banco para perfomance)
            var dadosLotes = await _context.Lotes
                                            .Where(l => l.Tenancy.Id == tenancyId)
                                            .GroupBy(l => 1)
                                            .Select(g => new {
                                                Qtd = g.Count(),
                                                TotalInvestido = g.Sum(l => l.ValorInicial)
                                            })
                                            .FirstOrDefaultAsync();
            // 3. Busca dados das PEDRAS BRUTAS
            var dadosPedras = await _context.Bruta
                                            .Where(b => b.Tenancy.Id == tenancyId)
                                            .GroupBy(b => 1)
                                            .Select(g => new {
                                                Qtd = g.Count(),
                                                PesoTotal = g.Sum(b => b.Peso),
                                                ValorTotal = g.Sum(b => b.ValorInicial)
                                            })
                                            .FirstOrDefaultAsync();
            // 4. Monta e Retorna o DTO
            var dashboard = new DashboardResumoDTO {
                NomeEmpresa = loggedUser.Tenancy.Name,

                // Se dadosLotes for null (banco vazio), usa 0
                TotalLotes = dadosLotes?.Qtd ?? 0,
                ValorTotalInvestido = (dadosLotes?.TotalInvestido ?? 0) + (dadosPedras?.ValorTotal ?? 0),

                // Se dadosPedras for null, usa 0
                TotalPedras = dadosPedras?.Qtd ?? 0,
                PesoTotalEstoque = dadosPedras?.PesoTotal ?? 0
            };
            if (dashboard.PesoTotalEstoque > 0) {
                dashboard.PrecoMedioPorGrama = dashboard.ValorTotalInvestido / dashboard.PesoTotalEstoque;
            } else {
                dashboard.PrecoMedioPorGrama = 0;
            }
            return Ok(dashboard);

        }
    }
}
