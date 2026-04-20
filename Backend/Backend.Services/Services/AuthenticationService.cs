using Backend.Services.Auth;
using Backend.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Backend.Core.Models;

namespace Backend.Services.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly JwtTokenService _jwtTokenService;

        public AuthenticationService(UserManager<User> userManager, SignInManager<User> signInManager, JwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
        }

        public Task LoginAsync()
        {
            throw new NotImplementedException();
        }

        public Task LogoutAsync()
        {
            throw new NotImplementedException();
        }

        public Task RegisterAsync()
        {
            throw new NotImplementedException();
        }

        public Task RefreshTokenAsync()
        {
            throw new NotImplementedException();
        }
    }
}
