using Backend.Core.Models;
namespace Backend.Core.Interface
{
    public interface IPartnerRelationRepository
    {
        Task<IEnumerable<PartnerRelation>> GetAllAsync();
    }
}
