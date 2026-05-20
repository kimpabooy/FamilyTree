using Backend.Services.DTOs.Person;

namespace Backend.Services.Interface
{
    public interface IPersonService
    {
        Task<IEnumerable<ResponsePerson>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default);
        Task<ResponsePerson?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<ResponsePerson?> CreateAsync(RequestCreatePerson dto, CancellationToken cancellationToken = default);
        Task<ResponsePerson?> UpdateAsync(int id, RequestUpdatePerson dto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}