using Backend.Services.DTOs.Auth;
using Backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<ResponseAuth>> Register([FromBody] RequestRegister request, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _authService.RegisterAsync(request, cancellationToken);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<ResponseAuth>> Login([FromBody] RequestLogin request, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _authService.LoginAsync(request, cancellationToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout(CancellationToken cancellationToken)
        {
            await _authService.LogoutAsync(cancellationToken);
            return NoContent();
        }
    }
}