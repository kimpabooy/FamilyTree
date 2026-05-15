using Backend.Core.Models;
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
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var trees = await _familyTreeService.GetAllAsync(cancellationToken);
            return Ok(trees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var tree = await _familyTreeService.GetByIdAsync(id, cancellationToken);
            if (tree is null) return NotFound();
            return Ok(tree);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FamilyTree familyTree, CancellationToken cancellationToken)
        {
            var created = await _familyTreeService.CreateAsync(familyTree, cancellationToken);
            if (created is null) return BadRequest();
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] FamilyTree familyTree, CancellationToken cancellationToken)
        {
            var updated = await _familyTreeService.UpdateAsync(id, familyTree, cancellationToken);
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