using Backend.Core.Interface;
using Backend.Infrastructure.Data;

namespace Backend.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IFamilyTreeRepository FamilyTreeRepository { get; }
        public IPersonRepository PersonRepository { get; }
        public IParentChildRelationRepository ParentChildRelationRepository { get; }
        public IPartnerRelationRepository PartnerRelationRepository { get; }
        public IUserRepository UserRepository { get; }

        public UnitOfWork(
            AppDbContext context,
            IFamilyTreeRepository familyTreeRepository,
            IPersonRepository personRepository,
            IParentChildRelationRepository parentChildRelationRepository,
            IPartnerRelationRepository partnerRelationRepository,
            IUserRepository userRepository)
        {
            _context = context;
            FamilyTreeRepository = familyTreeRepository;
            PersonRepository = personRepository;
            ParentChildRelationRepository = parentChildRelationRepository;
            PartnerRelationRepository = partnerRelationRepository;
            UserRepository = userRepository;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
    }
}