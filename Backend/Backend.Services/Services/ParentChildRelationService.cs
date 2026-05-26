using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.DTOs.Person;
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

        public async Task<IEnumerable<ResponseParentChildRelation>> GetByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default)
        {
            var relations = await _unitOfWork.ParentChildRelationRepository.GetByFamilyTreeIdAsync(familyTreeId, cancellationToken);
            return relations.Select(MapToResponse);
        }
        public async Task<ResponseParentChildRelation?> CreateAsync(RequestCreateParentChildRelation dto, CancellationToken cancellationToken = default)
        {
            var exists = await _unitOfWork.ParentChildRelationRepository.ExistsAsync(dto.ParentId, dto.ChildId, cancellationToken);
            if (exists) return null;

            var relation = new ParentChildRelation
            {
                ParentId = dto.ParentId,
                ChildId = dto.ChildId
            };

            var created = _unitOfWork.ParentChildRelationRepository.Add(relation);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return MapToResponse(created);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.ParentChildRelationRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            _unitOfWork.ParentChildRelationRepository.Remove(existing);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<IEnumerable<ResponsePerson>> GetParentsAsync(int personId, CancellationToken cancellationToken = default)
        {
            var persons = await _unitOfWork.ParentChildRelationRepository.GetParentsAsync(personId, cancellationToken);
            return persons.Select(PersonService.MapToResponse);
        }

        public async Task<IEnumerable<ResponsePerson>> GetChildrenAsync(int personId, CancellationToken cancellationToken = default)
        {
            var persons = await _unitOfWork.ParentChildRelationRepository.GetChildrenAsync(personId, cancellationToken);
            return persons.Select(PersonService.MapToResponse);
        }

        public async Task<IEnumerable<ResponsePerson>> GetSiblingsAsync(int personId, CancellationToken cancellationToken = default)
        {
            var persons = await _unitOfWork.ParentChildRelationRepository.GetSiblingsAsync(personId, cancellationToken);
            return persons.Select(PersonService.MapToResponse);
        }

        public async Task<IEnumerable<ResponsePerson>> GetGrandparentsAsync(int personId, CancellationToken cancellationToken = default)
        {
            var persons = await _unitOfWork.ParentChildRelationRepository.GetGrandparentsAsync(personId, cancellationToken);
            return persons.Select(PersonService.MapToResponse);
        }

        // Helper method to map ParentChildRelation to ResponseParentChildRelation
        private static ResponseParentChildRelation MapToResponse(ParentChildRelation relation) => new()
        {
            Id = relation.Id,
            ParentId = relation.ParentId,
            ChildId = relation.ChildId,
            CreatedDate = relation.CreatedDate
        };
    }
}