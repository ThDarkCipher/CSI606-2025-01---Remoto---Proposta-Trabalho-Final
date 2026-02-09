using GemaGestor.Models.Users;
using GemaGestor.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GemaGestor.Services
{
    public class JWTService {
        private readonly JWTConfiguration jwtConfig;
        public JWTService(IOptions<JWTConfiguration> configuration) {
            this.jwtConfig = configuration.Value;
        }
        public bool IsLongTermToken() {
            return jwtConfig.LongTermToken;
        }
        public string GenerateJWT(User user, IList<string> roles, double? expirationTime = null) {
            var securityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtConfig.SecretKey ?? throw new InvalidOperationException("JWT Secret not configured.")));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString())
            };
            foreach(var role in roles) {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            var token = new JwtSecurityToken(
                issuer: jwtConfig.Issuer,
                audience: jwtConfig.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(expirationTime ?? jwtConfig.Expiration)),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
