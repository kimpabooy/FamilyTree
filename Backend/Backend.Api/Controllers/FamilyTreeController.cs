using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interface;
using Backend.Services.DTOs.FamilyTree;

namespace Backend.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamilyTreeController : ControllerBase
    {
        private readonly IFamilyTreeService _familyTreeService;

        public FamilyTreeController(IFamilyTreeService familyTreeService)
        {
            _familyTreeService = familyTreeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ResponseFamilyTree>>> GetAll(CancellationToken cancellationToken)
        {
            var trees = await _familyTreeService.GetAllAsync(cancellationToken);
            return Ok(trees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseFamilyTree>> GetById(int id, CancellationToken cancellationToken)
        {
            var tree = await _familyTreeService.GetByIdAsync(id, cancellationToken);
            if (tree is null) return NotFound();
            return Ok(tree);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ResponseFamilyTree>> Create([FromBody] RequestCreateFamilyTree request, CancellationToken cancellationToken)
        {
            var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(ownerId)) return Unauthorized();

            try
            {
                var created = await _familyTreeService.CreateAsync(request, ownerId, cancellationToken);
                return CreatedAtAction(nameof(GetById), new { id = created!.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                // Clear, explicit error for client while you debug/update frontend
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ResponseFamilyTree>> Update(int id, [FromBody] RequestUpdateFamilyTree request, CancellationToken cancellationToken)
        {
            var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(ownerId)) return Unauthorized();

            var existing = await _familyTreeService.GetByIdAsync(id, cancellationToken);
            if (existing is null) return NotFound();

            if (!string.Equals(existing.OwnerId, ownerId, StringComparison.Ordinal))
                return Forbid();

            var updated = await _familyTreeService.UpdateAsync(id, request, cancellationToken);
            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(ownerId)) return Unauthorized();

            var existing = await _familyTreeService.GetByIdAsync(id, cancellationToken);
            if (existing is null) return NotFound();

            if (!string.Equals(existing.OwnerId, ownerId, StringComparison.Ordinal))
                return Forbid();

            var deleted = await _familyTreeService.DeleteAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }
}