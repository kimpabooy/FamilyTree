using Backend.Services.DTOs.Relations;
using Backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers
{
    [Route("api/relations/partner")]
    [ApiController]
    public class PartnerRelationController : ControllerBase
    {
        private readonly IPartnerRelationService _service;

        public PartnerRelationController(IPartnerRelationService service)
        {
            _service = service;
        }

        [HttpGet("{personId}")]
        public async Task<ActionResult<IEnumerable<ResponsePartnerRelation>>> GetByPerson(int personId, CancellationToken cancellationToken)
        {
            var partners = await _service.GetByPersonIdAsync(personId, cancellationToken);
            return Ok(partners);
        }

        [HttpPost]
        public async Task<ActionResult<ResponsePartnerRelation>> Create([FromBody] RequestCreatePartnerRelation request, CancellationToken cancellationToken)
        {
            var created = await _service.CreateAsync(request, cancellationToken);
            if (created is null) return BadRequest();
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponsePartnerRelation>> Update(int id, [FromBody] RequestUpdatePartnerRelation request, CancellationToken cancellationToken)
        {
            var updated = await _service.UpdateAsync(id, request, cancellationToken);
            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _service.DeleteAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }
}