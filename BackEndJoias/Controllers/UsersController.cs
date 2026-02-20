using GemaGestor.Data;
using GemaGestor.DTOs;
using GemaGestor.Models.Users;
using GemaGestor.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace GemaGestor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly WhitelabelContext _context;
        private readonly SignInManager<User> SignInManager;
        private readonly UserManager<User> UserManager;
        private readonly JWTService JwtService;
        private readonly OTPService OtpService;

        public UsersController(WhitelabelContext context, SignInManager<User> signInManager, IConfiguration configuration, UserManager<User> userManager, JWTService jwtService, OTPService otpService) {
            _context = context;
            this.SignInManager = signInManager;
            this.UserManager = userManager;
            this.JwtService = jwtService;
            this.OtpService = otpService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [SwaggerOperation(Summary = "Retrieves a list of all users, including their roles, for administrative purposes.")]
        [SwaggerResponse(200, "Returns the list of users with their roles.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not a Admin.")]
        public async Task<IActionResult> GetUsers() {
            var loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            List<UserDTO> users = new List<UserDTO>();
            List<User> usersList;
            if(loggedUser.Tenancy != null) {
                var tenancy = _context.Tenancy.Find(loggedUser.Tenancy.Id);
                usersList = tenancy.Users.ToList();
            }
            else {
                usersList = await _context.User.ToListAsync();
            }
            foreach(var user in usersList) {
                UserDTO tempUser = new UserDTO(user.Id, user.UserName, user.Email);
                tempUser.Roles = new List<string>(await UserManager.GetRolesAsync(user));
                users.Add(tempUser);
            }
            return Ok(new { message = "Usuários retornados", usuarios = users, loggedUser = loggedUser });
        }

        [Authorize]
        [HttpPut]
        [SwaggerOperation(Summary = "Update user data")]
        [SwaggerResponse(200, "Returns the list of users with their roles.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not a Admin.")]
        public async Task<IActionResult> UpdateUser(UserDTO newUserData) {
            var user = await UserManager.FindByNameAsync(this.User.FindFirst(ClaimTypes.Name).Value);
            user.Email = newUserData.Email ?? user.Email;
            _context.SaveChanges();
            return Ok(new { message = "Usuário atualizado" });
        }
        [HttpPost("create")]
        [SwaggerOperation(Summary = "Creates a new user with the User role.")]
        [SwaggerResponse(200, "Create the basic user in database.")]
        [SwaggerResponse(400, "Missing mandatory data or weak password.")]
        [SwaggerResponse(409, "User already exists.")]
        public async Task<IActionResult> CreateUser(CreateUserDTO user) {
            if(String.IsNullOrEmpty(user.Tenancy)) {
                return BadRequest(new { message = "Tenancy é requerida" });
            }
            var tenancy = _context.Tenancy.Where<Tenancy>(t => t.Name == user.Tenancy);
            if(!tenancy.Any()) {
                return BadRequest(new { message = "Tenancy não encontrada" });
            }
            if(user != null && !string.IsNullOrEmpty(user.UserName) && !string.IsNullOrEmpty(user.Password)) {
                var userExists = await UserManager.FindByNameAsync(user.UserName);
                if(userExists != null) {
                    return Conflict(new { message = "Usuário já existe" });
                }
                var result = await UserManager.CreateAsync(new User(user.UserName, user.Email), user.Password);
                if(!result.Succeeded) {
                    return BadRequest(new { message = "Senha não corresponde aos requisitos" });
                }
                var userCreated = await UserManager.FindByNameAsync(user.UserName);
                await UserManager.AddToRoleAsync(userCreated, "User");
                userCreated.Tenancy = tenancy.First();
                _context.SaveChanges();
                return Ok(new { message = "Usuário criado com sucesso" });
            }
            return BadRequest(new { message = "Usuário ou senha vazios" });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{userName}")]
        [SwaggerOperation(Summary = "Retrieves the informations about the userName.")]
        [SwaggerResponse(200, "Returns the user data.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not a Admin.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> GetUser(string userName) {
            var userFound = await UserManager.FindByNameAsync(userName);
            var loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();

            if(userFound == null) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            if (loggedUser.Tenancy != null && userFound.Tenancy?.Id != loggedUser.Tenancy.Id) {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            var user = new UserDTO(userFound.Id, userFound.UserName, userFound.Email);
            if(this.User.FindFirst(ClaimTypes.Role).Value.Contains("Admin")) {
                user.Roles = new List<string>(await UserManager.GetRolesAsync(userFound));
            }

            return Ok(new { message = "Usuário encontrado com sucesso", usuario = user });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{userName}")]
        [SwaggerOperation(Summary = "Delete a user by the userName.")]
        [SwaggerResponse(200, "Delete the given user.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not a Admin.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> DeleteUser(string userName) {
            var user = await UserManager.FindByNameAsync(userName);
            var loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(user == null) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            if (loggedUser.Tenancy != null && user.Tenancy?.Id != loggedUser.Tenancy.Id) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            await UserManager.DeleteAsync(user);

            return Ok(new { message = "Usuário removido com sucesso" });
        }

        [HttpPost("login")]
        [SwaggerOperation(Summary = "Authenticates a user with userName and password retrieving JWT token.")]
        [SwaggerResponse(200, "Returns the JWT token.")]
        [SwaggerResponse(401, "Incorrect password.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> Login(LoginDTO login) {
            var user = await UserManager.FindByNameAsync(login.UserName);
            if(user == null) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            var result = await SignInManager.CheckPasswordSignInAsync(user, login.Password, false);
            if(!result.Succeeded) {
                return Unauthorized(new { message = "Senha incorreta" });
            }
            if(user.TwoFactorEnabled) {
                return Accepted(new { message = "Necessária confirmação 2FA" });
            }
            return Ok(JwtService.IsLongTermToken() ?
                new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)), longtermtoken = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user), 1440) } :
                new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)) }
            );
        }

        [HttpPost("otp-code-login")]
        [SwaggerOperation(Summary = "Authenticates a user with userName, password and 2FA Code retrieving JWT token.")]
        [SwaggerResponse(200, "Returns the JWT token.")]
        [SwaggerResponse(401, "Incorrect password or 2FA Code.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> OtpCode(LoginDTO login) {
            var user = await UserManager.FindByNameAsync(login.UserName);
            if(user == null) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            var result = await SignInManager.CheckPasswordSignInAsync(user, login.Password, false);
            if(!result.Succeeded) {
                return Unauthorized(new { message = "Senha incorreta" });
            }
            if(OtpService.ValidateCode(user.SecretKey, login.Code)) {
                return Ok(JwtService.IsLongTermToken() ?
                    new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)), longtermtoken = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user), 1440) } :
                    new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)) }
                );
            }
            return Unauthorized(new { message = "2FA Code incorreto" });
        }
        [HttpPost("register-tenancy")]
        [AllowAnonymous] // Libera a rota para quem não está logado!
        [SwaggerOperation(Summary = "Registers a new Tenancy and its Admin user at the same time.")]
        public async Task<IActionResult> RegisterTenancy(RegisterTenancyDTO request)
        {
            if (string.IsNullOrEmpty(request.TenancyName) || string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Nome da empresa, usuário e senha são obrigatórios" });
            }

            // 1. Verifica se a Joalheria já existe
            var tenancyExists = await _context.Tenancy.AnyAsync(t => t.Name == request.TenancyName);
            if (tenancyExists)
            {
                return Conflict(new { message = "Já existe uma joalheria com este nome" });
            }

            // 2. Verifica se o Usuário já existe
            var userExists = await UserManager.FindByNameAsync(request.UserName);
            if (userExists != null)
            {
                return Conflict(new { message = "Nome de usuário já está em uso" });
            }

            // 3. Cria a Joalheria
            var newTenancy = new Tenancy { Name = request.TenancyName };
            _context.Tenancy.Add(newTenancy);
            await _context.SaveChangesAsync(); // Salva para gerar o ID da empresa no banco

            // 4. Cria o Usuário
            var newUser = new User(request.UserName, request.Email);
            var result = await UserManager.CreateAsync(newUser, request.Password);

            if (!result.Succeeded)
            {
                // Se a senha for fraca e der erro, a gente apaga a joalheria que acabou de criar pra não sujar o banco!
                _context.Tenancy.Remove(newTenancy);
                await _context.SaveChangesAsync();
                return BadRequest(new { message = "Senha não corresponde aos requisitos de segurança (Use maiúsculas, números e símbolos)" });
            }

            // 5. Amarra o Usuário na Joalheria e dá o cargo de Chefe (Admin)
            newUser.Tenancy = newTenancy;
            await UserManager.AddToRoleAsync(newUser, "Admin");
            await _context.SaveChangesAsync();

            return Ok(new { message = "Joalheria e Conta Admin criadas com sucesso!" });
        }

        [Authorize]
        [HttpGet("refresh-token")]
        [SwaggerOperation(Summary = "Refreshes the JWT token.")]
        [SwaggerResponse(200, "Returns a new JWT token.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        public async Task<IActionResult> RefreshToken() {
            var user = await UserManager.FindByNameAsync(this.User.FindFirst(ClaimTypes.Name).Value);
            UserDTO userResponse = new UserDTO(user.Id, user.UserName, user.Email);
            userResponse.Roles = new List<string>(await UserManager.GetRolesAsync(user));
            return Ok(JwtService.IsLongTermToken() ?
                new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)), longtermtoken = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user), 1440) } :
                new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)) }
            );
        }

        [Authorize]
        [HttpGet("me")]
        [SwaggerOperation(Summary = "Retrieves informations about the logged user and the time till token expiration.")]
        [SwaggerResponse(200, "Returns the user data and time till token expiration.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        public async Task<IActionResult> Me() {
            var user = await UserManager.FindByNameAsync(this.User.FindFirst(ClaimTypes.Name).Value);
            TimeSpan timeTillExpire = DateTimeOffset.FromUnixTimeSeconds(Convert.ToInt64(this.User.FindFirst("exp").Value)).LocalDateTime - DateTime.Now;
            UserDTO userResponse = new UserDTO(user.Id, user.UserName, user.Email);
            userResponse.Roles = new List<string>(await UserManager.GetRolesAsync(user));
            return Ok(new { message = "Usuário recuperado", usuario = userResponse, timeTillExpire = timeTillExpire.TotalSeconds });
        }

        [Authorize]
        [HttpGet("enable-otp")]
        [SwaggerOperation(Summary = "Enable 2FA for the logged user.")]
        [SwaggerResponse(200, "Returns the base64 QR Code to enable 2FA.")]
        [SwaggerResponse(409, "User has enabled 2FA already.")]
        public async Task<IActionResult> EnableOtp() {
            User loggedUser = await UserManager.FindByNameAsync(this.User.FindFirst(ClaimTypes.Name).Value);
            if(!loggedUser.TwoFactorEnabled) {
                loggedUser.SecretKey = OtpService.GenerateKey();
                _context.SaveChanges();
                string qrCode = OtpService.GenerateCode(loggedUser);
                return Ok(new { message = "QRCode gerado com sucesso", qrCode });
            }
            return Conflict(new { message = "Usuário já possui 2FA habilitado" });
        }

        [HttpPost("verify-otp")]
        [SwaggerOperation(Summary = "Authenticates a user with userName, password and 2FA Code validating 2FA in DB and retrieving JWT token.")]
        [SwaggerResponse(200, "Returns the JWT token.")]
        [SwaggerResponse(401, "Incorrect password or 2FA Code.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> VerifyOtp(LoginDTO login) {
            var user = await UserManager.FindByNameAsync(login.UserName);
            if(user == null) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            var result = await SignInManager.CheckPasswordSignInAsync(user, login.Password, false);
            if(!result.Succeeded) {
                return Unauthorized(new { message = "Senha incorreta" });
            }
            if(OtpService.ValidateCode(user.SecretKey, login.Code)) {
                user.TwoFactorEnabled = true;
                _context.SaveChanges();
                return Ok(JwtService.IsLongTermToken() ?
                    new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)), longtermtoken = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user), 1440) } :
                    new { message = "Usuário logado com sucesso", token = JwtService.GenerateJWT(user, await UserManager.GetRolesAsync(user)) }
                );
            }
            return Unauthorized(new { message = "2FA Code incorreto" });
        }

        [Authorize]
        [HttpPost("change-password")]
        [SwaggerOperation(Summary = "Changes the logged user's password using the old and new passwords")]
        [SwaggerResponse(200, "Changes user's password")]
        [SwaggerResponse(400, "Invalid new password or incorrect old password.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO userDTO) {
            User loggedUser = await UserManager.FindByNameAsync(this.User.FindFirst(ClaimTypes.Name).Value);
            var result = await UserManager.ChangePasswordAsync(loggedUser, userDTO.OldPassword, userDTO.NewPassword);
            if(!result.Succeeded) {
                return BadRequest(new { message = "Senha não corresponde aos requisitos" });
            }
            return Ok(new { message = "Senha alterada com sucesso" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("reset-password/{userName}")]
        [SwaggerOperation(Summary = "Changes a given userName's password.")]
        [SwaggerResponse(200, "Changes user's password.")]
        [SwaggerResponse(400, "Invalid new password.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not Admin.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordDTO, [FromRoute] string userName) {
            var user = await UserManager.FindByNameAsync(userName);
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(user == null) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            if(loggedUser.Tenancy != null && user.Tenancy?.Id != loggedUser.Tenancy.Id) {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            var token = await UserManager.GeneratePasswordResetTokenAsync(user);
            var result = await UserManager.ResetPasswordAsync(user, token, resetPasswordDTO.NewPassword);
            if(!result.Succeeded) {
                return BadRequest(new { message = "Senha não corresponde aos requisitos" });
            }
            return Ok(new { message = "Senha resetada com sucesso" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("role/{userName}")]
        [SwaggerOperation(Summary = "Adds a given userName to a role.")]
        [SwaggerResponse(200, "Adds user to role.")]
        [SwaggerResponse(400, "Missing mandatory data.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not a Admin.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> AddRole([FromRoute] string userName, RoleDTO roleName) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(roleName != null) {
                var user = await UserManager.FindByNameAsync(userName);
                if(user == null) {
                    return NotFound(new { message = "Usuário não encontrado" });
                }
                if(loggedUser.Tenancy != null && user.Tenancy?.Id != loggedUser.Tenancy.Id) {
                    return NotFound(new { message = "Usuário não encontrado" });
                }
                var result = await UserManager.AddToRoleAsync(user, roleName.Name);
                if(!result.Succeeded) {
                    return NotFound(new { message = "Role não existe" });
                }
                return Ok(new { message = "Role adicionada com sucesso" });
            }
            return BadRequest(new { message = "Role é requerida" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("role/{userName}")]
        [SwaggerOperation(Summary = "Removes a given userName from a role.")]
        [SwaggerResponse(200, "Removes user to role.")]
        [SwaggerResponse(400, "Missing mandatory data.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not a Admin.")]
        [SwaggerResponse(404, "User not found.")]
        public async Task<IActionResult> RemoveRole([FromRoute] string userName, RoleDTO roleName) {
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(roleName != null) {
                var user = await UserManager.FindByNameAsync(userName);
                if(user == null) {
                    return NotFound(new { message = "Usuário não encontrado" });
                }
                if(loggedUser.Tenancy != null && user.Tenancy?.Id != loggedUser.Tenancy.Id) {
                    return NotFound(new { message = "Usuário não encontrado" });
                }
                var result = await UserManager.RemoveFromRoleAsync(user, roleName.Name);
                if(!result.Succeeded) {
                    return NotFound(new { message = "Erro ao remover role do usuário" });
                }
                return Ok(new { message = "Role removida com sucesso" });
            }
            return BadRequest(new { message = "Role é requerida" });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("searchbyname")]
        [SwaggerOperation(Summary = "Retrieves informations about all users that matches part of name with the given userName query parameter.")]
        [SwaggerResponse(200, "Retrieve search result.")]
        [SwaggerResponse(401, "Unauthorized Access.")]
        [SwaggerResponse(403, "User is not a Admin.")]
        public async Task<IActionResult> SearchByName([FromQuery] string userName) {
            List<User> tenancyUsers;
            User loggedUser = _context.User.Where(u => u.UserName == this.User.FindFirst(ClaimTypes.Name).Value).Include(u => u.Tenancy).First<User>();
            if(loggedUser.Tenancy != null) {
                tenancyUsers = UserManager.Users.Where(u => EF.Functions.ILike(u.UserName, $"%{userName}%") && u.Tenancy == loggedUser.Tenancy).ToList<User>();
            }
            else {
                tenancyUsers = UserManager.Users.Where(u => EF.Functions.ILike(u.UserName, $"%{userName}%")).ToList<User>();
            }
            //var usersTmp = from u in _context.Users where EF.Functions.ILike(u.UserName, $"%{userName}%") select u;
            List<UserDTO> users = new List<UserDTO>();
            foreach(var user in tenancyUsers) {
                UserDTO tempUser = new UserDTO(user.Id, user.UserName, user.Email);
                tempUser.Roles = new List<string>(await UserManager.GetRolesAsync(user));
                users.Add(tempUser);
            }
            return Ok(new { message = "Usuários retornados", users = users });
        }
    }
}
