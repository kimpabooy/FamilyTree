using Backend.Core.Models;

namespace Backend.Core.Interface
{
    public interface IPersonRepository
    {
        Task<IEnumerable<Person>> GetAllAsync();
    }
}
