using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories
{
    public class FamilyTreeRepository : IFamilyTreeRepository
    {
        private readonly AppDbContext _context;

        public FamilyTreeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FamilyTree>> GetAllAsync()
        {
            return await _context.FamilyTrees.ToListAsync();
        }
    }
}
