namespace GemaGestor.Settings
{
    public class JWTConfiguration {
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public long Expiration { get; set; } = 0;
        public bool LongTermToken { get; set; } = false;
    }
}
