using Backend.Core.Models;

namespace Backend.Services.Interface
{
    public interface IFamilyTreeService
    {
        Task<IEnumerable<FamilyTree>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<FamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<FamilyTree?> CreateAsync(FamilyTree familyTree, CancellationToken cancellationToken = default);
        Task<FamilyTree?> UpdateAsync(int id, FamilyTree familyTree, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}