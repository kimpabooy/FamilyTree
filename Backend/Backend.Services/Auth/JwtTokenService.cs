using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Core.Models;
using Microsoft.Extensions.Options;

namespace Backend.Services.Auth
{
    public class JwtTokenService
    {
        private readonly JwtSettings _jwtSettings;

        public JwtTokenService(IOptions<JwtSettings> options)
        {
            _jwtSettings = options.Value;
        }

        public (string Token, DateTime Expiration) GenerateJwtToken(User user, IList<string>? roles = null)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
            };

            if (roles != null)
            {
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            }

            var keyString = _jwtSettings.Key;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours);
            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }

        // Generates a secure refresh token.
        public string GenerateRefreshToken() => Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
}