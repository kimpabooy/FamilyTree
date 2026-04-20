using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IParentChildRelationRepository
    {
        Task<IEnumerable<ParentChildRelation>> GetAllAsync();
    }
}
