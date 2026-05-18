using Backend.Core.Models;

namespace Backend.Services.Interface
{
    public interface IPersonService
    {
        Task<IEnumerable<Person>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default);
        Task<Person?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<Person?> CreateAsync(Person person, CancellationToken cancellationToken = default);
        Task<Person?> UpdateAsync(int id, Person person, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}