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

        public async Task<IEnumerable<PartnerRelation>> GetAllAsync()
        {
            return await _context.PartnerRelations.ToListAsync();
        }
    }
}
