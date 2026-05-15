using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.Interface;

namespace Backend.Services.Services
{
    public class FamilyTreeService : IFamilyTreeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public FamilyTreeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<FamilyTree>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.FamilyTreeRepository.GetAllAsync(cancellationToken);
        }

        public async Task<FamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<FamilyTree?> CreateAsync(FamilyTree familyTree, CancellationToken cancellationToken = default)
        {
            var toCreate = new FamilyTree
            {
                Name = familyTree.Name,
                IsPublic = familyTree.IsPublic,
                OwnerId = familyTree.OwnerId
            };

            var created = _unitOfWork.FamilyTreeRepository.Add(toCreate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return created.Result;
        }

        public async Task<FamilyTree?> UpdateAsync(int id, FamilyTree familyTree, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.Name = familyTree.Name;
            existing.IsPublic = familyTree.IsPublic;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return existing;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            // OBS: FamilyTreeRepository saknar Remove() ännu — lägg till den om du vill ha delete
            // _unitOfWork.FamilyTreeRepository.Remove(existing);
            // await _unitOfWork.SaveChangesAsync(cancellationToken);
            return false; // placeholder tills Remove läggs till
        }
    }
}