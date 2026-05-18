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

        public async Task<Person> AddAsync(Person person, CancellationToken cancellationToken = default)
        {
            var entry = await _context.Persons.AddAsync(person, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return entry.Entity;
        }

        public async Task RemoveAsync(Person person, CancellationToken cancellationToken = default)
        {
            _context.Persons.Remove(person);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}