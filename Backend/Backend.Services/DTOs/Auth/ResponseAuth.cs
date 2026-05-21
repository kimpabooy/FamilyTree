namespace Backend.Services.DTOs.Auth
{
    public class ResponseAuth
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
    }
}