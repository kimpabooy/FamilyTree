using Backend.Core.Models;
using Backend.Services.DTOs.Relations;

namespace Backend.Services.Interface
{
    public interface IPartnerRelationService
    {
        Task<IEnumerable<ResponsePartnerRelation>> GetByPersonIdAsync(int personId, CancellationToken cancellationToken = default);
        Task<ResponsePartnerRelation?> CreateAsync(RequestCreatePartnerRelation dto, CancellationToken cancellationToken = default);
        Task<ResponsePartnerRelation?> UpdateAsync(int id, RequestUpdatePartnerRelation dto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}