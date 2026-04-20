using Microsoft.EntityFrameworkCore;

namespace Backend.Core.Interface
{
    public interface IUnitOfWork
    {
            IUserRepository UserRepository { get; }
            IPersonRepository PersonRepository { get; }
            IParentChildRelationRepository ParentChildRelationRepository { get; }
            IPartnerRelationRepository PartnerRelationRepository { get; }
            IFamilyTreeRepository FamilyTreeRepository { get; }

            Task<int> SaveChangesAsync();
    }
}
