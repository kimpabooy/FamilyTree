using Backend.Core.Models;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Services.Interface
{
    public interface IFamilyTreeService
    {
        Task<FamilyTree?> GetFamilyTreeAsync(CancellationToken cancellationToken = default);
        Task<FamilyTree?> GetFamilyTreeByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<FamilyTree?> CreateFamilyTreeAsync(FamilyTree familyTree, CancellationToken cancellationToken = default);
    }
}
