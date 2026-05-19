using Backend.Services.DTOs.Relations;
using Backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers
{
    [Route("api/relations/parent-child")]
    [ApiController]
    public class ParentChildRelationController : ControllerBase
    {
        private readonly IParentChildRelationService _parentChildRelationService;

        public ParentChildRelationController(IParentChildRelationService parentChildRelationService)
        {
            _parentChildRelationService = parentChildRelationService;
        }

        [HttpPost]
        public async Task<ActionResult<ResponseParentChildRelation>> Create(
            [FromBody] RequestCreateParentChildRelation parentIdDto, [FromQuery] RequestCreateParentChildRelation childIdDto, CancellationToken cancellationToken)
        {
            var createRelation = await _parentChildRelationService.CreateAsync(parentIdDto, childIdDto, cancellationToken);
            if (createRelation is null) return Conflict("Relationen finns redan.");
            
            return Ok(createRelation);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _parentChildRelationService.DeleteAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }

    public record ParentChildRequest(int ParentId, int ChildId);
}