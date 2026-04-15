namespace Backend.Core.Models
{
    public class ParentChildRelation : BaseEntity
    {
        public int ParentId { get; set; }
        public Person Parent { get; set; }
        public int ChildId { get; set; }
        public Person Child { get; set; }
    }
}