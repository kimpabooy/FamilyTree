using Backend.Core.Models;
namespace Backend.Core.Interface
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
    }
}
