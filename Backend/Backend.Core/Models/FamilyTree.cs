using System;

namespace Backend.Core.Models
{
    public class FamilyTree : BaseEntity
    {
        public string Name { get; set; }
        public bool IsPublic { get; set; }

        // Navigation properties
        public string OwnerId { get; set; }
        public User Owner { get; set; }

        public ICollection<Person> Persons { get; set; }
    }
}