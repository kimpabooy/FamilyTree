using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IFamilyTreeRepository
    {
        Task<IEnumerable<FamilyTree>> GetAllAsync();
    }
}
