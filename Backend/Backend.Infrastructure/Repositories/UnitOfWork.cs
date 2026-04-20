using Backend.Core.Interface;
using Backend.Infrastructure.Data;

namespace Backend.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IUserRepository _userRepository;
        private IPersonRepository _personRepository;
        private IParentChildRelationRepository _parentChildRelationRepository;
        private IPartnerRelationRepository _partnerRelationRepository;
        private IFamilyTreeRepository _familyTreeRepository;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public IUserRepository UserRepository => _userRepository ??= new UserRepository(_context);
        public IPersonRepository PersonRepository => _personRepository ??= new PersonRepository(_context);
        public IParentChildRelationRepository ParentChildRelationRepository => _parentChildRelationRepository ??= new ParentChildRelationRepository(_context);
        public IPartnerRelationRepository PartnerRelationRepository => _partnerRelationRepository ??= new PartnerRelationRepository(_context);
        public IFamilyTreeRepository FamilyTreeRepository => _familyTreeRepository ??= new FamilyTreeRepository(_context);

        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
