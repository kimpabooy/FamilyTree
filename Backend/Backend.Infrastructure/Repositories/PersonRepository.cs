using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories
{
    public class PersonRepository : IPersonRepository
    {
        private readonly AppDbContext _context;

        public PersonRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Person>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default)
        {
            return await _context.Persons
                .Where(p => p.FamilyTreeId == familyTreeId)
                .ToListAsync(cancellationToken);
        }

        public async Task<Person?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Persons.FirstOrDefaultAsync(person => person.Id == id, cancellationToken);
        }

        public Person Add(Person person)
        {
            var entry = _context.Persons.Add(person);
            return entry.Entity;
        }

        public void Remove(Person person)
        {
            _context.Persons.Remove(person);
        }
    }
}