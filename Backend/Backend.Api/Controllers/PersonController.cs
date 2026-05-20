using Backend.Services.DTOs.Person;
using Backend.Services.Interface;
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
        public async Task<ActionResult<IEnumerable<ResponsePerson>>> GetAllByTree(int familyTreeId, CancellationToken cancellationToken)
        {
            var persons = await _personService.GetAllByFamilyTreeIdAsync(familyTreeId, cancellationToken);
            return Ok(persons);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponsePerson>> GetById(int id, CancellationToken cancellationToken)
        {
            var person = await _personService.GetByIdAsync(id, cancellationToken);
            if (person is null) return NotFound();
            return Ok(person);
        }

        [HttpGet("{id}/family")]
        public async Task<ActionResult<ResponsePersonFamily>> GetFamily(int id, CancellationToken cancellationToken)
        {
            var person = await _personService.GetByIdAsync(id, cancellationToken);
            if (person is null) return NotFound();

            var response = new ResponsePersonFamily
            {
                Person = person,
                Parents = await _parentChildService.GetParentsAsync(id, cancellationToken),
                Children = await _parentChildService.GetChildrenAsync(id, cancellationToken),
                Siblings = await _parentChildService.GetSiblingsAsync(id, cancellationToken),
                Grandparents = await _parentChildService.GetGrandparentsAsync(id, cancellationToken),
                Partners = await _partnerService.GetByPersonIdAsync(id, cancellationToken)
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponsePerson>> Create([FromBody] RequestCreatePerson request, CancellationToken cancellationToken)
        {
            var created = await _personService.CreateAsync(request, cancellationToken);
            if (created is null) return BadRequest();
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponsePerson>> Update(int id, [FromBody] RequestUpdatePerson request, CancellationToken cancellationToken)
        {
            var updated = await _personService.UpdateAsync(id, request, cancellationToken);
            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _personService.DeleteAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }
    }
}