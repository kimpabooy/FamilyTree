namespace Backend.Core.Models
{
    public class PartnerRelation : BaseEntity
    {
        public int Person1Id { get; set; }
        public Person Person1 { get; set; }
        public int Person2Id { get; set; }
        public Person Person2 { get; set; }
        public PartnerType PartnerType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public enum PartnerType
    {
        Current,
        Ex,
        Unknown
    }
}