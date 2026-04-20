using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories
{
    public class ParentChildRelationRepository : IParentChildRelationRepository
    {
        private readonly AppDbContext _context;

        public ParentChildRelationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ParentChildRelation>> GetAllAsync()
        {
            return await _context.ParentChildRelations.ToListAsync();
        }
    }
}
