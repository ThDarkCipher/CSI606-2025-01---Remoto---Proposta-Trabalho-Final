using GemaGestor.Data;
using GemaGestor.DTOs;
using GemaGestor.Models.Pedras;
using GemaGestor.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GemaGestor.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BrutasController : ControllerBase {
        private readonly WhitelabelContext _context;
        private readonly UserManager<User> _userManager;

        public BrutasController(WhitelabelContext context, UserManager<User> userManager) {
            _context = context;
            _userManager = userManager;
        }

        //1- Criar a Pedra Bruta (post
        [HttpPost]
        public async Task<ActionResult<Bruta>> CreateBruta(CreateBrutaDTO dto) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                           .FindFirst(ClaimTypes.Name).Value)
                                            .Include(u => u.Tenancy).First<User>();
            
            //Verificar se o usuário tem empresa
            if (loggedUser.Tenancy == null) {
                return BadRequest(new { message = "Usuário sem empresa vinculada" });
            }

            //1. Buscando o lote
            Lote? LoteParaVincular = null;
            if (dto.LoteId.HasValue) {
                LoteParaVincular = await _context.Lotes
                                                .FindAsync(dto.LoteId.Value);
                if (LoteParaVincular != null && LoteParaVincular.Tenancy != loggedUser.Tenancy) {
                    return BadRequest(new { message = "Lote não encontrado" });
                    //Conferir a necessidade do LoteParaVincular != null
                }
            }
            //2. Criar a pedra bruta
            var NovaBruta = new Bruta {
                Nome = dto.Nome,
                Peso = dto.Peso,
                ValorInicial = dto.ValorInicial,
                ValorFinal = dto.ValorInicial,
                ValorDeTrabalho = 0,
                Regiao = dto.Regiao,
                Descricao = dto.Descricao,
                DataAquisicao = dto.DataAquisicao ?? DateTime.UtcNow,
                //Definir a empresar e dono da nova pedra
                Tenancy = loggedUser.Tenancy!,
                Donos = new List<User> { loggedUser },
                Lote = LoteParaVincular
            };
            _context.Bruta.Add(NovaBruta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBruta), new { id = NovaBruta.Id }, new { message = "Pedra bruta criada com sucesso", NovaBruta });
        }

        //2- Listar (get) - Listar apenas as pedras brutas da empresa do 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bruta>>> GetBruta() {
            //Refatorar (tirando IEnumerable)
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                                      .FindFirst(ClaimTypes.Name).Value)
                                                      .Include(u => u.Tenancy).First<User>(); 
            if (loggedUser?.Tenancy == null) {
                return await _context.Bruta.ToListAsync();
            }
            return await _context.Bruta
                                .Include(b => b.Tenancy) // Traz dados da empresa 
                                .Include(b => b.Lote) // Traz o lote vinculado se tiver
                                .Where(b => b.Tenancy.Id == loggedUser.Tenancy.Id)
                                .ToListAsync();
        }

        //3- Buscar por ID (get) - Confirmando se é a minha empresa
        [HttpGet("{id}")]
        public async Task<ActionResult<Bruta>> GetBruta(long id) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                                  .FindFirst(ClaimTypes.Name).Value)
                                                  .Include(u => u.Tenancy).First<User>();
            var bruta = _context.Bruta.Where(b => b.Id == id).Include(b => b.Tenancy);

            if(!bruta.Any()) {
                return NotFound(new { message = "Pedra bruta não encontrada" });
            }

            if(bruta.First().Tenancy.Id != loggedUser.Tenancy.Id) {
                return NotFound(new { message = "Pedra não encontrada" });
            }

            return Ok(new { message = "Pedra bruta encontrada", bruta = bruta });

        }

        // DELETE: api/Brutas/5
        [HttpDelete("{id}")]
        //Conferir se o first retorna null ou se é necessário usar o Any() para verificar a existência da pedra bruta
        public async Task<IActionResult> DeleteBruta(long id) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User
                                                  .FindFirst(ClaimTypes.Name).Value)
                                                  .Include(u => u.Tenancy).First<User>();

            var bruta = _context.Bruta
                                            .Where(b => b.Id == id).Include(b => b.Tenancy);
            if (!bruta.Any()) {
                return NotFound();
            }

            if (bruta.First().Tenancy.Id != loggedUser.Tenancy!.Id) {
                return Forbid();
            }
            _context.Bruta.Remove(bruta.First());
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
