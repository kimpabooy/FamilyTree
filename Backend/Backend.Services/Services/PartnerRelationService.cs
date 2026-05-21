using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.DTOs.Relations;
using Backend.Services.Interface;

namespace Backend.Services.Services
{
    public class PartnerRelationService : IPartnerRelationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PartnerRelationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ResponsePartnerRelation>> GetByPersonIdAsync(int personId, CancellationToken cancellationToken = default)
        {
            var relations = await _unitOfWork.PartnerRelationRepository.GetByPersonIdAsync(personId, cancellationToken);
            return relations.Select(r => MapToResponse(r, personId));
        }

        public async Task<ResponsePartnerRelation?> CreateAsync(RequestCreatePartnerRelation dto, CancellationToken cancellationToken = default)
        {
            var relation = new PartnerRelation
            {
                Person1Id = dto.Person1Id,
                Person2Id = dto.Person2Id,
                PartnerType = dto.PartnerType,
                FromDate = dto.FromDate,
                ToDate = dto.ToDate
            };

            var created = _unitOfWork.PartnerRelationRepository.Add(relation);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Hämta om med navigation properties (Person1, Person2) laddade
            var withNav = await _unitOfWork.PartnerRelationRepository.GetByIdAsync(created.Id, cancellationToken);
            return withNav is null ? null : MapToResponse(withNav, dto.Person1Id);
        }

        public async Task<ResponsePartnerRelation?> UpdateAsync(int id, RequestUpdatePartnerRelation dto, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PartnerRelationRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.PartnerType = dto.PartnerType;
            existing.FromDate = dto.FromDate;
            existing.ToDate = dto.ToDate;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.UtcNow);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return MapToResponse(existing, existing.Person1Id);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PartnerRelationRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            _unitOfWork.PartnerRelationRepository.Remove(existing);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        // Hjälpmetod för att mappa en PartnerRelation till en ResponsePartnerRelation, och avgöra vilken person som är "partner" baserat på partnerOfId
        // partnerOfId används för att avgöra vilken av de två personerna i relationen som är "partnern" i svaret, så att vi alltid returnerar den andra personen som partnern.
        // Mappar en PartnerRelation till ResponsePartnerRelation, och avgör vilken person som är "partner" baserat på partnerOfId
        private static ResponsePartnerRelation MapToResponse(PartnerRelation relation, int partnerOfId) => new()
        {
            Id = relation.Id,
            PartnerType = relation.PartnerType,
            FromDate = relation.FromDate,
            ToDate = relation.ToDate,
            CreatedDate = relation.CreatedDate,
            UpdatedDate = relation.UpdatedDate,
            Partner = PersonService.MapToResponse(
                relation.Person1Id == partnerOfId ? relation.Person2 : relation.Person1)
        };
    }
}