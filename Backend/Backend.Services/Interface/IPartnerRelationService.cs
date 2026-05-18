using Backend.Core.Models;

namespace Backend.Services.Interface
{
    public interface IPartnerRelationService
    {
        Task<IEnumerable<PartnerRelation>> GetByPersonIdAsync(int personId, CancellationToken cancellationToken = default);
        Task<PartnerRelation?> CreateAsync(int person1Id, int person2Id, PartnerType partnerType, DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken = default);
        Task<PartnerRelation?> UpdateAsync(int id, PartnerType partnerType, DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}