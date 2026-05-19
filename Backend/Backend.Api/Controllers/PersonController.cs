using Backend.Core.Models;
using Backend.Services.DTOs.Person;
using Backend.Services.Interface;
using Backend.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly IParentChildRelationService _parentChildService;
        private readonly IPartnerRelationService _partnerService;

        public PersonController(
            IPersonService personService,
            IParentChildRelationService parentChildService,
            IPartnerRelationService partnerService)
        {
            _personService = personService;
            _parentChildService = parentChildService;
            _partnerService = partnerService;
        }

        [HttpGet("tree/{familyTreeId}")]
        public async Task<IEnumerable<ResponsePerson>> GetAllByTree(int familyTreeId, CancellationToken cancellationToken)
        {
            var persons = await _personService.GetAllByFamilyTreeIdAsync(familyTreeId, cancellationToken);
            return persons;

            //return Ok(persons);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var person = await _personService.GetByIdAsync(id, cancellationToken);
            if (person is null) return NotFound();
            return Ok(person);
        }

        [HttpGet("{id}/family")]
        public async Task<IActionResult> GetFamily(int id, CancellationToken cancellationToken)
        {
            var person = await _personService.GetByIdAsync(id, cancellationToken);
            if (person is null) return NotFound();

            var parents = await _parentChildService.GetParentsAsync(id, cancellationToken);
            var children = await _parentChildService.GetChildrenAsync(id, cancellationToken);
            var siblings = await _parentChildService.GetSiblingsAsync(id, cancellationToken);
            var grandparents = await _parentChildService.GetGrandparentsAsync(id, cancellationToken);
            var partners = await _partnerService.GetByPersonIdAsync(id, cancellationToken);

            return Ok(new
            {
                person,
                parents,
                children,
                siblings,
                grandparents,
                partners
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RequestCreatePerson requestCreatePersonDto, CancellationToken cancellationToken)
        {
            var created = await _personService.CreateAsync(requestCreatePersonDto, cancellationToken);
            if (created is null) return BadRequest();
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RequestUpdatePerson requestUpdatePersonDto, CancellationToken cancellationToken)
        {
            var updated = await _personService.UpdateAsync(id, requestUpdatePersonDto, cancellationToken);
            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _personService.DeleteAsync(id, cancellationToken);
            if (!deleted) return NotFound();

            return Ok(deleted);
        }
    }
}