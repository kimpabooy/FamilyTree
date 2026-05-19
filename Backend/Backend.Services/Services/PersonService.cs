using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Services.DTOs.FamilyTree;
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
            var people = await _unitOfWork.PersonRepository.GetAllByFamilyTreeIdAsync(familyTreeId, cancellationToken);
            var response = people.Select(person => new ResponsePerson
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
            }).ToList();
            
            return response;
        }

        public async Task<ResponsePerson?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var person = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (person is null) return null;
            return new ResponsePerson
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

        public async Task<ResponsePerson?> CreateAsync(RequestCreatePerson requestDto, CancellationToken cancellationToken = default)
        {
            var toCreate = new Person
            {
                FirstName = requestDto.FirstName,
                LastName = requestDto.LastName,
                BirthDate = requestDto.BirthDate,
                DeathDate = requestDto.DeathDate,
                Gender = requestDto.Gender,
                ProfileImageUrl = requestDto.ProfileImageUrl,
                FamilyTreeId = requestDto.FamilyTreeId,
            };

            var response = await _unitOfWork.PersonRepository.AddAsync(toCreate, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new ResponsePerson
            {
                Id = response.Id,
                FirstName = response.FirstName,
                LastName = response.LastName,
                BirthDate = response.BirthDate,
                DeathDate = response.DeathDate,
                Gender = response.Gender,
                ProfileImageUrl = response.ProfileImageUrl,
                FamilyTreeId = response.FamilyTreeId,
                CreatedDate = response.CreatedDate,
                UpdatedDate = response.UpdatedDate
            };
        }

        public async Task<ResponsePerson?> UpdateAsync(int id, RequestUpdatePerson requestDto, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return null;

            existing.FirstName = requestDto.FirstName ?? existing.FirstName;
            existing.LastName = requestDto.LastName ?? existing.LastName;
            existing.BirthDate = requestDto.BirthDate ?? existing.BirthDate;
            existing.DeathDate = requestDto.DeathDate ?? existing.DeathDate;
            existing.Gender = requestDto.Gender;
            existing.ProfileImageUrl = requestDto.ProfileImageUrl ?? existing.ProfileImageUrl;
            existing.FamilyTreeId = requestDto.FamilyTreeId ?? existing.FamilyTreeId;
            existing.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return new ResponsePerson
            {
                Id = existing.Id,
                FirstName = existing.FirstName,
                LastName = existing.LastName,
                BirthDate = existing.BirthDate,
                DeathDate = existing.DeathDate,
                Gender = existing.Gender,
                ProfileImageUrl = existing.ProfileImageUrl,
                FamilyTreeId = existing.FamilyTreeId,
                CreatedDate = existing.CreatedDate,
                UpdatedDate = existing.UpdatedDate
            };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _unitOfWork.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            await _unitOfWork.PersonRepository.DeleteAsync(existing.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}