using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.DTOs.FamilyTree;
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

        public async Task<IEnumerable<ResponseFamilyTree>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var trees = await _unitOfWork.FamilyTreeRepository.GetAllAsync(cancellationToken);
            return trees.Select(MapToResponse);
        }

        public async Task<ResponseFamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var tree = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            return tree is null ? null : MapToResponse(tree);
        }

        public async Task<ResponseFamilyTree?> CreateAsync(RequestCreateFamilyTree request, CancellationToken cancellationToken = default)
        {
            var toCreate = new FamilyTree
            {
                Name = request.Name,
                IsPublic = request.IsPublic,
                OwnerId = request.OwnerId
            };

            var created = _unitOfWork.FamilyTreeRepository.Add(toCreate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return MapToResponse(created);
        }

        public async Task<ResponseFamilyTree?> UpdateAsync(int id, RequestUpdateFamilyTree request, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.Name = request.Name;
            existing.IsPublic = request.IsPublic;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return MapToResponse(existing);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            _unitOfWork.FamilyTreeRepository.Remove(existing);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        // En hjälpfunktion för att mappa FamilyTree-modellen till ResponseFamilyTree DTO:n
        private static ResponseFamilyTree MapToResponse(FamilyTree tree) => new()
        {
            Id = tree.Id,
            Name = tree.Name,
            IsPublic = tree.IsPublic,
            OwnerId = tree.OwnerId,
            CreatedDate = tree.CreatedDate,
            UpdatedDate = tree.UpdatedDate
        };
    }
}