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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ParentChildRequest request, CancellationToken cancellationToken)
        {
            var created = await _service.CreateAsync(request.ParentId, request.ChildId, cancellationToken);
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

    public record ParentChildRequest(int ParentId, int ChildId);
}