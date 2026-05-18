using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.Interface;

namespace Backend.Services.Services
{
    public class PersonService : IPersonService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PersonService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Person>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.PersonRepository.GetAllByFamilyTreeIdAsync(familyTreeId, cancellationToken);
        }

        public async Task<Person?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<Person?> CreateAsync(Person person, CancellationToken cancellationToken = default)
        {
            var toCreate = new Person
            {
                FirstName = person.FirstName,
                LastName = person.LastName,
                BirthDate = person.BirthDate,
                DeathDate = person.DeathDate,
                Gender = person.Gender,
                ProfileImageUrl = person.ProfileImageUrl,
                FamilyTreeId = person.FamilyTreeId
            };

            var created = await _unitOfWork.PersonRepository.AddAsync(toCreate, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return created;
        }

        public async Task<Person?> UpdateAsync(int id, Person person, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.FirstName = person.FirstName;
            existing.LastName = person.LastName;
            existing.BirthDate = person.BirthDate;
            existing.DeathDate = person.DeathDate;
            existing.Gender = person.Gender;
            existing.ProfileImageUrl = person.ProfileImageUrl;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return existing;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            await _unitOfWork.PersonRepository.RemoveAsync(existing, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}