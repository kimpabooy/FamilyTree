using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IFamilyTreeRepository
    {
        Task<IEnumerable<FamilyTree>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<FamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<FamilyTree> Add(FamilyTree familyTree);
        Task UpdateAsync(int id, FamilyTree familyTree);
        Task DeleteAsync(int id);

    }
}
