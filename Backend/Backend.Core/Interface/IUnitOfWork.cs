using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Core.Interface
{
    public interface IUnitOfWork
    {
        IFamilyTreeRepository FamilyTreeRepository { get; }
        IPersonRepository PersonRepository { get; }
        IParentChildRelationRepository ParentChildRelationRepository { get; }
        IPartnerRelationRepository PartnerRelationRepository { get; }
        IUserRepository UserRepository { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}