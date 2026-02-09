namespace GemaGestor.DTOs {
    public class UserDTO {
        public UserDTO(long id, string userName, string email) {
            Id = id;
            UserName = userName;
            Email = email;
            Roles = new List<string>();
        }
        public long? Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public List<string>? Roles { get; set; }
    }
}
