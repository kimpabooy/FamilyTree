using Backend.Core.Models;
using Backend.Services.Interface;
using Backend.Services.DTOs.FamilyTree;
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
           var response = await _familyTreeService.GetAllAsync(cancellationToken);
           return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseFamilyTree>> GetById(int id, CancellationToken cancellationToken)
        {
            var tree = await _familyTreeService.GetByIdAsync(id, cancellationToken);
            if (tree is null) return NotFound();
            
            return Ok(tree);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseFamilyTree>> Create([FromBody] RequestCreateFamilyTree requestDto, CancellationToken cancellationToken)
        {
            var createdTree = await _familyTreeService.CreateAsync(requestDto, cancellationToken);
            if (createdTree is null) return BadRequest();
            
            return CreatedAtAction(nameof(GetById), new { id = createdTree.Id }, createdTree);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseFamilyTree>> Update(int id, [FromBody] RequestUpdateFamilyTree requestDto, CancellationToken cancellationToken)
        {
            var updated = await _familyTreeService.UpdateAsync(id, requestDto, cancellationToken);
            if (updated is null) return NotFound();
            
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _familyTreeService.DeleteAsync(id, cancellationToken);
            if (!deleted) return NotFound();
            
            return Ok(deleted);
            //return deleted ? NoContent() : NotFound();
        }
    }
}