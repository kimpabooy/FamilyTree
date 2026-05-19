using Backend.Core.Interface;
using Backend.Core.Models;
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

        public async Task<IEnumerable<PartnerRelation>> GetByPersonIdAsync(int personId, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.PartnerRelationRepository.GetByPersonIdAsync(personId, cancellationToken);
        }

        public async Task<PartnerRelation?> CreateAsync(int person1Id, int person2Id, PartnerType partnerType, DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken = default)
        {
            var relation = new PartnerRelation
            {
                Person1Id = person1Id,
                Person2Id = person2Id,
                PartnerType = partnerType,
                FromDate = fromDate,
                ToDate = toDate
            };

            var created = _unitOfWork.PartnerRelationRepository.Add(relation);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return created;
        }

        public async Task<PartnerRelation?> UpdateAsync(int id, PartnerType partnerType, DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PartnerRelationRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.PartnerType = partnerType;
            existing.FromDate = fromDate;
            existing.ToDate = toDate;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return existing;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PartnerRelationRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            _unitOfWork.PartnerRelationRepository.Remove(existing);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        public Task<IEnumerable<PartnerRelation>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var allPartners = _unitOfWork.PartnerRelationRepository.GetAllAsync(cancellationToken);
            return allPartners;
        }
    }
}