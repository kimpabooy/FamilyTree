using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.Interface;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Services.Services
{
    public class FamilyTreeService : IFamilyTreeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public FamilyTreeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<FamilyTree?> GetFamilyTreeAsync(CancellationToken cancellationToken = default)
        {
            var list = await _unitOfWork.FamilyTreeRepository.GetAllAsync(cancellationToken);
            return list.FirstOrDefault();
        }

        public async Task<FamilyTree?> GetFamilyTreeByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<FamilyTree?> CreateFamilyTreeAsync(FamilyTree familyTree, CancellationToken cancellationToken = default)
        {
            var treeToCreate = new FamilyTree
            {
                Name = familyTree.Name,
                IsPublic = familyTree.IsPublic,
                OwnerId = familyTree.OwnerId
            };

            var createdFamilyTree = _unitOfWork.FamilyTreeRepository.Add(treeToCreate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return createdFamilyTree;
        }
    }
}
