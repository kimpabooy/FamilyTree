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

        public Task<FamilyTree> Add(FamilyTree familyTree)
        {
            var entry = _context.FamilyTrees.Add(familyTree);
            return Task.FromResult(entry.Entity);
        }

        public Task UpdateAsync(int id, FamilyTree familyTree)
        {
            var updateEntity = _context.FamilyTrees.Find(id);
            if (updateEntity != null)
            {
                updateEntity.Name = familyTree.Name;
                updateEntity.IsPublic = familyTree.IsPublic;
                updateEntity.OwnerId = familyTree.OwnerId;
            }
            return Task.CompletedTask;
        }

        public Task DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var deleteEntity = _context.FamilyTrees.Find(id);
            if (deleteEntity != null)
            {
                _context.FamilyTrees.Remove(deleteEntity);
            }
            return Task.CompletedTask;
        }
    }
}
