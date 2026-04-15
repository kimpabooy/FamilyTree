namespace Backend.Core.Models
{
    public class Person : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public Gender Gender { get; set; }
        public string? ProfileImageUrl { get; set; }

        // Navigation properties
        public int FamilyTreeId { get; set; }
        public FamilyTree FamilyTree { get; set; }

        public ICollection<ParentChildRelation> AsParent { get; set; }
        public ICollection<ParentChildRelation> AsChild { get; set; }
        public ICollection<PartnerRelation> Partners { get; set; }
    }

    public enum Gender
    {
        Male,
        Female,
        Other
    }
}