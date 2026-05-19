using Backend.Core.Models;
using Backend.Services.DTOs.Relations;

namespace Backend.Services.Interface
{
    public interface IParentChildRelationService
    {
        Task<ResponseParentChildRelation> CreateAsync(RequestCreateParentChildRelation parentIdDto,
            RequestCreateParentChildRelation childIdDto, 
            CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetParentsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetChildrenAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetSiblingsAsync(int personId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Person>> GetGrandparentsAsync(int personId, CancellationToken cancellationToken = default);
    }
}   