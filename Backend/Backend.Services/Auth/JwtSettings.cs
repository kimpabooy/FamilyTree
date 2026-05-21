using System.ComponentModel.DataAnnotations;

namespace Backend.Services.Auth
{
    public class JwtSettings
    {
        [Required]
        [MinLength(32)]
        public string Key { get; set; } = string.Empty;

        public string? Issuer { get; set; }
        public string? Audience { get; set; }
        public int ExpiryHours { get; set; } = 2;
    }
}