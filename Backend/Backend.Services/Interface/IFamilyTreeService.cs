using Backend.Services.DTOs.FamilyTree;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Services.Interface
{
    public interface IFamilyTreeService
    {
        Task<IEnumerable<ResponseFamilyTree>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<ResponseFamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        // OwnerId is provided by caller (controller) from authenticated user
        Task<ResponseFamilyTree?> CreateAsync(RequestCreateFamilyTree request, string ownerId, CancellationToken cancellationToken = default);

        Task<ResponseFamilyTree?> UpdateAsync(int id, RequestUpdateFamilyTree request, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}