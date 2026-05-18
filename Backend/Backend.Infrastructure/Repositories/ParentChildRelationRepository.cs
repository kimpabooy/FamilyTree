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

        public async Task<ParentChildRelation?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.ParentChildRelations
                .FirstOrDefaultAsync(pc => pc.Id == id, cancellationToken);
        }

        public async Task<bool> ExistsAsync(int parentId, int childId, CancellationToken cancellationToken = default)
        {
            return await _context.ParentChildRelations
                .AnyAsync(pc => pc.ParentId == parentId && pc.ChildId == childId, cancellationToken);
        }

        public async Task<IEnumerable<Person>> GetParentsAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _context.ParentChildRelations
                .Where(pc => pc.ChildId == personId)
                .Select(pc => pc.Parent)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Person>> GetChildrenAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _context.ParentChildRelations
                .Where(pc => pc.ParentId == personId)
                .Select(pc => pc.Child)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Person>> GetSiblingsAsync(int personId, CancellationToken cancellationToken = default)
        {
            // Hämta alla föräldra-ID:n för personen
            var parentIds = await _context.ParentChildRelations
                .Where(pc => pc.ChildId == personId)
                .Select(pc => pc.ParentId)
                .ToListAsync(cancellationToken);

            // Hitta alla barn till dessa föräldrar, exkludera personen själv
            return await _context.ParentChildRelations
                .Where(pc => parentIds.Contains(pc.ParentId) && pc.ChildId != personId)
                .Select(pc => pc.Child)
                .Distinct()
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Person>> GetGrandparentsAsync(int personId, CancellationToken cancellationToken = default)
        {
            // Hämta föräldrarnas föräldrar
            var parentIds = await _context.ParentChildRelations
                .Where(pc => pc.ChildId == personId)
                .Select(pc => pc.ParentId)
                .ToListAsync(cancellationToken);

            return await _context.ParentChildRelations
                .Where(pc => parentIds.Contains(pc.ChildId))
                .Select(pc => pc.Parent)
                .Distinct()
                .ToListAsync(cancellationToken);
        }

        public ParentChildRelation Add(ParentChildRelation relation)
        {
            var entry = _context.ParentChildRelations.Add(relation);
            return entry.Entity;
        }

        public void Remove(ParentChildRelation relation)
        {
            _context.ParentChildRelations.Remove(relation);
        }
    }
}