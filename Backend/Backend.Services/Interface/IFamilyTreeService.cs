using Backend.Core.Models;
using Backend.Services.DTOs.FamilyTree;

namespace Backend.Services.Interface
{
    public interface IFamilyTreeService
    {
        Task<IEnumerable<ResponseFamilyTree>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<ResponseFamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<ResponseFamilyTree?> CreateAsync(RequestCreateFamilyTree request, CancellationToken cancellationToken = default);
        Task<ResponseFamilyTree?> UpdateAsync(int id, RequestUpdateFamilyTree request, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}