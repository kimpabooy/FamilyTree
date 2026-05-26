using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IParentChildRelationRepository
    {
        Task<IEnumerable<ParentChildRelation>> GetByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default);
        Task<ParentChildRelation?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<bool> ExistsAsync(int parentId, int childId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetParentsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetChildrenAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetSiblingsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetGrandparentsAsync(int personId, CancellationToken cancellationToken = default);
        ParentChildRelation Add(ParentChildRelation relation);
        void Remove(ParentChildRelation relation);
    }
}