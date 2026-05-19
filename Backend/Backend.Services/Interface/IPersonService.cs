using Backend.Core.Models;
using Backend.Services.DTOs.Person;

namespace Backend.Services.Interface
{
    public interface IPersonService
    {
        Task<IEnumerable<ResponsePerson>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default);
        Task<ResponsePerson?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<ResponsePerson?> CreateAsync(RequestCreatePerson requestDto, CancellationToken cancellationToken = default);
        Task<ResponsePerson?> UpdateAsync(int id, RequestUpdatePerson requestDto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}