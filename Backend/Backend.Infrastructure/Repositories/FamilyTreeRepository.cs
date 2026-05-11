using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Repositories
{
    public class FamilyTreeRepository : IFamilyTreeRepository
    {
        private readonly AppDbContext _context;

        public FamilyTreeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FamilyTree>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.FamilyTrees.ToListAsync(cancellationToken);
        }

        public async Task<FamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.FamilyTrees.FirstOrDefaultAsync(ft => ft.Id == id, cancellationToken);
        }

        public FamilyTree Add(FamilyTree familyTree)
        {
            var entry = _context.FamilyTrees.Add(familyTree);
            return entry.Entity;
        }

    }
}
