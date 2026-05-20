namespace Backend.Services.DTOs.Auth
{
    public class RequestRegister
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}