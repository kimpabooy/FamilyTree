using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories
{
    public class PartnerRelationRepository : IPartnerRelationRepository
    {
        private readonly AppDbContext _context;

        public PartnerRelationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PartnerRelation?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.PartnerRelations
                .Include(pr => pr.Person1)
                .Include(pr => pr.Person2)
                .FirstOrDefaultAsync(pr => pr.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<PartnerRelation>> GetByPersonIdAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _context.PartnerRelations
                .Include(pr => pr.Person1)
                .Include(pr => pr.Person2)
                .Where(pr => pr.Person1Id == personId || pr.Person2Id == personId)
                .ToListAsync(cancellationToken);
        }

        public PartnerRelation Add(PartnerRelation relation)
        {
            var entry = _context.PartnerRelations.Add(relation);
            return entry.Entity;
        }

        public void Remove(PartnerRelation relation)
        {
            _context.PartnerRelations.Remove(relation);
        }
    }
}