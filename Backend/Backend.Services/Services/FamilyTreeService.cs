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
            var familyTrees = await _unitOfWork.FamilyTreeRepository.GetAllAsync(cancellationToken);
            var response = familyTrees.Select(ft => new ResponseFamilyTree
            {
                Id = ft.Id,
                Name = ft.Name,
                IsPublic = ft.IsPublic,
                OwnerId = ft.OwnerId,
                CreatedDate = ft.CreatedDate,
                UpdatedDate = ft.UpdatedDate
            });

            return response;
        }

        public async Task<ResponseFamilyTree?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var familyTree = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            if (familyTree is null) return null;

            return new ResponseFamilyTree
            {
                Id = familyTree.Id,
                Name = familyTree.Name,
                IsPublic = familyTree.IsPublic,
                OwnerId = familyTree.OwnerId,
                CreatedDate = familyTree.CreatedDate,
                UpdatedDate = familyTree.UpdatedDate
            };
        }

        public async Task<ResponseFamilyTree?> CreateAsync(RequestCreateFamilyTree requestDto, CancellationToken cancellationToken = default)
        {
            var toCreate = new FamilyTree
            {
                Name = requestDto.Name,
                IsPublic = requestDto.IsPublic,
                OwnerId = requestDto.OwnerId,
                CreatedDate = DateOnly.FromDateTime(DateTime.Now)
            };

            // Await the Add result (was missing)
            var response = await _unitOfWork.FamilyTreeRepository.Add(toCreate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return new ResponseFamilyTree
            {
                Id = response.Id,
                Name = response.Name,
                IsPublic = response.IsPublic,
                OwnerId = response.OwnerId,
                CreatedDate = response.CreatedDate,
                UpdatedDate = response.UpdatedDate
            };
        }

        public async Task<ResponseFamilyTree?> UpdateAsync(int id, RequestUpdateFamilyTree requestDto, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.Name = requestDto.Name;
            existing.IsPublic = requestDto.IsPublic;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return new ResponseFamilyTree
            {
                Id = existing.Id,
                Name = existing.Name,
                IsPublic = existing.IsPublic,
                OwnerId = existing.OwnerId,
                CreatedDate = existing.CreatedDate,
                UpdatedDate = existing.UpdatedDate
            };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.FamilyTreeRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

             await _unitOfWork.FamilyTreeRepository.DeleteAsync(existing.Id, cancellationToken);
             await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}