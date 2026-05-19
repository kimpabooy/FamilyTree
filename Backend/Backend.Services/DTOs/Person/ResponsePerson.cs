using Backend.Core.Models;

namespace Backend.Services.DTOs.Person
{
    public class ResponsePerson
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public Gender Gender { get; set; } = Gender.Other; // Default to Other if not specified
        public string? ProfileImageUrl { get; set; }
        public int FamilyTreeId { get; set; }
        public DateOnly CreatedDate { get; set; }
        public DateOnly? UpdatedDate { get; set; }
    }
}
