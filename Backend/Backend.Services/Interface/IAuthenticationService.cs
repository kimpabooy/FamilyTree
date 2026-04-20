namespace Backend.Services.Interface
{
    public interface IAuthenticationService
    {
        Task LoginAsync();
        Task LogoutAsync();
        Task RegisterAsync();
        Task RefreshTokenAsync();
    }
}
