using Backend.Core.Models;
using Backend.Services.DTOs.Person;
using Backend.Services.DTOs.Relations;

namespace Backend.Services.Interface
{
    public interface IParentChildRelationService
    {
        Task<IEnumerable<ResponseParentChildRelation>> GetByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default);
        Task<ResponseParentChildRelation?> CreateAsync(RequestCreateParentChildRelation dto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
        Task<IEnumerable<ResponsePerson>> GetParentsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<ResponsePerson>> GetChildrenAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<ResponsePerson>> GetSiblingsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<ResponsePerson>> GetGrandparentsAsync(int personId, CancellationToken cancellationToken = default);
    }
}   