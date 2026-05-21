using Backend.Services.DTOs.FamilyTree;
using Backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<ResponseFamilyTree>> Create([FromBody] RequestCreateFamilyTree request, CancellationToken cancellationToken)
        {
            var created = await _familyTreeService.CreateAsync(request, cancellationToken);
            if (created is null) return BadRequest();
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseFamilyTree>> Update(int id, [FromBody] RequestUpdateFamilyTree request, CancellationToken cancellationToken)
        {
            var updated = await _familyTreeService.UpdateAsync(id, request, cancellationToken);
            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _familyTreeService.DeleteAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }
}