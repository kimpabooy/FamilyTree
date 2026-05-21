using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IPersonRepository
    {
        Task<IEnumerable<Person>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default);
        Task<Person?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Person Add(Person person);
        void Remove(Person person);
    }
}