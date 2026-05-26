using Backend.Services.DTOs.Relations;
using Backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers
{
    [Route("api/relations/parent-child")]
    [ApiController]
    public class ParentChildRelationController : ControllerBase
    {
        private readonly IParentChildRelationService _service;

        public ParentChildRelationController(IParentChildRelationService service)
        {
            _service = service;
        }

        [HttpGet("tree/{familyTreeId}")]
        public async Task<ActionResult<IEnumerable<ResponseParentChildRelation>>> GetByFamilyTree(int familyTreeId, CancellationToken cancellationToken)
        {
            var relations = await _service.GetByFamilyTreeIdAsync(familyTreeId, cancellationToken);
            return Ok(relations);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseParentChildRelation>> Create([FromBody] RequestCreateParentChildRelation request, CancellationToken cancellationToken)
        {
            var created = await _service.CreateAsync(request, cancellationToken);
            if (created is null) return Conflict("Relationen finns redan.");
            return Ok(created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _service.DeleteAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }
}