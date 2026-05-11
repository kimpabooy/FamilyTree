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
        public async Task<IActionResult> GetFamilyTree(CancellationToken cancellationToken)
        {
            var familyTree = await _familyTreeService.GetFamilyTreeAsync(cancellationToken);
            if (familyTree is null) return NotFound();

            return Ok(familyTree);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var tree = await _familyTreeService.GetFamilyTreeByIdAsync(id, cancellationToken);
            if (tree is null) return NotFound();
            
            return Ok(tree);
        }

        //[HttpPost]
        // TODO: fix POST and Add validation and error handling

        //public async Task<IActionResult> CreateFamilyTree(FamilyTree familyTree, CancellationToken cancellationToken)
        //{
        //    var createdFamilyTree = await _familyTreeService.CreateFamilyTreeAsync(familyTree, cancellationToken);
        //    if (createdFamilyTree is null) return BadRequest();

        //    return CreatedAtAction(nameof(GetById), new { id = createdFamilyTree.Id }, createdFamilyTree);
        //}
    }
}