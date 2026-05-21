using Backend.Core.Models;
namespace Backend.Core.Interface
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    }
}
