using Backend.Core.Models;
using Backend.Services.Auth;
using Backend.Services.DTOs.Auth;
using Backend.Services.Interface;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly JwtTokenService _jwtTokenService;

        public AuthenticationService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            JwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<ResponseAuth> RegisterAsync(RequestRegister request, CancellationToken cancellationToken = default)
        {
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                DisplayName = request.DisplayName
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException(errors);
            }

            var roles = await _userManager.GetRolesAsync(user);
            var (token, _) = _jwtTokenService.GenerateJwtToken(user, roles);
            var refreshToken = _jwtTokenService.GenerateRefreshToken();

            return new ResponseAuth
            {
                Token = token,
                RefreshToken = refreshToken,
                UserId = user.Id,
                Email = user.Email!,
                DisplayName = user.DisplayName
            };
        }

        public async Task<ResponseAuth> LoginAsync(RequestLogin request, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null)
                throw new UnauthorizedAccessException("Fel e-post eller lösenord.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
            if (!result.Succeeded)
                throw new UnauthorizedAccessException("Fel e-post eller lösenord.");

            var roles = await _userManager.GetRolesAsync(user);
            var (token, _) = _jwtTokenService.GenerateJwtToken(user, roles);
            var refreshToken = _jwtTokenService.GenerateRefreshToken();

            return new ResponseAuth
            {
                Token = token,
                RefreshToken = refreshToken,
                UserId = user.Id,
                Email = user.Email!,
                DisplayName = user.DisplayName
            };
        }

        public async Task LogoutAsync(CancellationToken cancellationToken = default)
        {
            await _signInManager.SignOutAsync();
        }

        public Task<ResponseAuth> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            // Implementeras när persistent refresh-token-lagring läggs till.
            throw new NotImplementedException();
        }
    }
}