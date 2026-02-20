namespace GemaGestor.DTOs
{
    public class RegisterTenancyDTO
    {
        public string TenancyName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty; 
        public string Password { get; set; } = string.Empty;
    }
}