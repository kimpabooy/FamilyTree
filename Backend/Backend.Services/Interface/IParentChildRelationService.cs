using Backend.Core.Models;

namespace Backend.Services.Interface
{
    public interface IParentChildRelationService
    {
        Task<ParentChildRelation?> CreateAsync(int parentId, int childId, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetParentsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetChildrenAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetSiblingsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetGrandparentsAsync(int personId, CancellationToken cancellationToken = default);
    }
}   