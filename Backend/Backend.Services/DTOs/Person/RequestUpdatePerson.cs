using Backend.Core.Models;

namespace Backend.Services.DTOs.Person
{
    // FamilyTreeId ingår inte — man byter inte träd via en person-uppdatering.
    public class RequestUpdatePerson
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public Gender Gender { get; set; }
        public string? ProfileImageUrl { get; set; }
    }
}