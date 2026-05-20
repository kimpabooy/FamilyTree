using Backend.Services.DTOs.Auth;

namespace Backend.Services.Interface
{
    public interface IAuthenticationService
    {
        Task<ResponseAuth> LoginAsync(RequestLogin request, CancellationToken cancellationToken = default);
        Task LogoutAsync(CancellationToken cancellationToken = default);
        Task<ResponseAuth> RegisterAsync(RequestRegister request, CancellationToken cancellationToken = default);
        Task<ResponseAuth> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    }
}
