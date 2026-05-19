using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IPersonRepository
    {
        Task<IEnumerable<Person>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default);
        Task<Person?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<Person> AddAsync(Person person, CancellationToken cancellationToken = default);
        Task DeleteAsync(int id, CancellationToken cancellationToken);
    }
}