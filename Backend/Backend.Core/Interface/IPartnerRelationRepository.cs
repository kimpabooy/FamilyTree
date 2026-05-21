using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IPartnerRelationRepository
    {
        Task<PartnerRelation?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<IEnumerable<PartnerRelation>> GetByPersonIdAsync(int personId, CancellationToken cancellationToken = default);
        PartnerRelation Add(PartnerRelation relation);
        void Remove(PartnerRelation relation);
    }
}