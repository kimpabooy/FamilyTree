using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.DTOs.Person;
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

        public async Task<IEnumerable<ResponsePerson>> GetAllByFamilyTreeIdAsync(int familyTreeId, CancellationToken cancellationToken = default)
        {
            var persons = await _unitOfWork.PersonRepository.GetAllByFamilyTreeIdAsync(familyTreeId, cancellationToken);
            return persons.Select(MapToResponse);
        }

        public async Task<ResponsePerson?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var person = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            return person is null ? null : MapToResponse(person);
        }

        public async Task<ResponsePerson?> CreateAsync(RequestCreatePerson dto, CancellationToken cancellationToken = default)
        {
            var toCreate = new Person
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                BirthDate = dto.BirthDate,
                DeathDate = dto.DeathDate,
                Gender = dto.Gender,
                ProfileImageUrl = dto.ProfileImageUrl,
                FamilyTreeId = dto.FamilyTreeId
            };

            var created = _unitOfWork.PersonRepository.Add(toCreate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return MapToResponse(created);
        }

        public async Task<ResponsePerson?> UpdateAsync(int id, RequestUpdatePerson dto, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.FirstName = dto.FirstName;
            existing.LastName = dto.LastName;
            existing.BirthDate = dto.BirthDate;
            existing.DeathDate = dto.DeathDate;
            existing.Gender = dto.Gender;
            existing.ProfileImageUrl = dto.ProfileImageUrl;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return MapToResponse(existing);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            _unitOfWork.PersonRepository.Remove(existing);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        // Helper method to map Person to ResponsePerson
        public static ResponsePerson MapToResponse(Person person) => new()
        {
            Id = person.Id,
            FirstName = person.FirstName,
            LastName = person.LastName,
            BirthDate = person.BirthDate,
            DeathDate = person.DeathDate,
            Gender = person.Gender,
            ProfileImageUrl = person.ProfileImageUrl,
            FamilyTreeId = person.FamilyTreeId,
            CreatedDate = person.CreatedDate,
            UpdatedDate = person.UpdatedDate
        };
    }
}