using Backend.Core.Models;
using Backend.Services.Interface;
using Backend.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers
{
    public record CreatePartnerRequest(int Person1Id, int Person2Id, PartnerType PartnerType, DateTime? FromDate, DateTime? ToDate);
    public record UpdatePartnerRequest(PartnerType PartnerType, DateTime? FromDate, DateTime? ToDate);

    [Route("api/relations/partner")]
    [ApiController]
    public class PartnerRelationController : ControllerBase
    {
        private readonly IPartnerRelationService _partnerService;

        public PartnerRelationController(IPartnerRelationService partnerService)
        {
            _partnerService = partnerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var partners = await _partnerService.GetAllAsync(cancellationToken);
            return Ok(partners);
        }

        [HttpGet("{personId}")]
        public async Task<IActionResult> GetByPerson(int personId, CancellationToken cancellationToken)
        {
            var partners = await _partnerService.GetByPersonIdAsync(personId, cancellationToken);
            return Ok(partners);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePartnerRequest request, CancellationToken cancellationToken)
        {
            var created = await _partnerService.CreateAsync(
                request.Person1Id,
                request.Person2Id,
                request.PartnerType,
                request.FromDate,
                request.ToDate,
                cancellationToken);

            if (created is null) return BadRequest();
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePartnerRequest request, CancellationToken cancellationToken)
        {
            var updated = await _partnerService.UpdateAsync(
                id,
                request.PartnerType,
                request.FromDate,
                request.ToDate,
                cancellationToken);

            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _partnerService.DeleteAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }


}