using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.DTOs.FamilyTree;
using Backend.Services.Interface;
using Microsoft.Extensions.Logging;

namespace Backend.Services.Services
{
    public class FamilyTreeService : IFamilyTreeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<FamilyTreeService> _logger;

        public FamilyTreeService(IUnitOfWork unitOfWork, ILogger<FamilyTreeService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
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

        public async Task<ResponseFamilyTree?> CreateAsync(RequestCreateFamilyTree request, string ownerId, CancellationToken cancellationToken = default)
        {
            var owner = await _unitOfWork.UserRepository.GetByIdAsync(ownerId, cancellationToken);
            if (owner == null)
            {
                _logger.LogWarning("CreateAsync: no user found with id {OwnerId}", ownerId);
                throw new InvalidOperationException($"Owner not found: {ownerId}");
            }

            var toCreate = new FamilyTree
            {
                Name = request.Name,
                IsPublic = request.IsPublic,
                OwnerId = ownerId
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

            // Hämta alla personer i trädet
            var persons = await _unitOfWork.PersonRepository
                .GetAllByFamilyTreeIdAsync(id, cancellationToken);

            foreach (var person in persons)
            {
                // Ta bort alla förälder-barn-relationer för varje person
                var allPersonConnections = await _unitOfWork.ParentChildRelationRepository
                    .GetByFamilyTreeIdAsync(id, cancellationToken);

                var personPcRelations = allPersonConnections
                    .Where(personConnection => personConnection.ParentId == person.Id || personConnection.ChildId == person.Id)
                    .ToList();

                foreach (var relation in personPcRelations)
                    _unitOfWork.ParentChildRelationRepository.Remove(relation);

                // Ta bort alla partnerrelationer för varje person
                var partnerRelations = await _unitOfWork.PartnerRelationRepository
                    .GetByPersonIdAsync(person.Id, cancellationToken);

                foreach (var relation in partnerRelations)
                    _unitOfWork.PartnerRelationRepository.Remove(relation);

                _unitOfWork.PersonRepository.Remove(person);
            }

            // Slutligen ta bort trädet
            _unitOfWork.FamilyTreeRepository.Remove(existing);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

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