using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.DTOs.Relations;
using Backend.Services.Interface;

namespace Backend.Services.Services
{
    public class ParentChildRelationService : IParentChildRelationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ParentChildRelationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ResponseParentChildRelation?> CreateAsync(RequestCreateParentChildRelation parentIdDto, RequestCreateParentChildRelation childIdDto, CancellationToken cancellationToken)
        {
            var exists = await _unitOfWork.ParentChildRelationRepository.ExistsAsync(parentIdDto.ParentId, childIdDto.ChildId, cancellationToken);
            if (exists) return null;

            var relation = new ParentChildRelation
            {
                ParentId = parentIdDto.ParentId,
                ChildId = childIdDto.ChildId
            };

            var created = _unitOfWork.ParentChildRelationRepository.Add(relation);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return new ResponseParentChildRelation
            {
                Id = created.Id,
                ParentId = created.ParentId,
                ChildId = created.ChildId
            };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.ParentChildRelationRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            _unitOfWork.ParentChildRelationRepository.Remove(existing);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<IEnumerable<Person>> GetParentsAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.ParentChildRelationRepository.GetParentsAsync(personId, cancellationToken);
        }

        public async Task<IEnumerable<Person>> GetChildrenAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.ParentChildRelationRepository.GetChildrenAsync(personId, cancellationToken);
        }

        public async Task<IEnumerable<Person>> GetSiblingsAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.ParentChildRelationRepository.GetSiblingsAsync(personId, cancellationToken);
        }

        public async Task<IEnumerable<Person>> GetGrandparentsAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.ParentChildRelationRepository.GetGrandparentsAsync(personId, cancellationToken);
        }
    }
}