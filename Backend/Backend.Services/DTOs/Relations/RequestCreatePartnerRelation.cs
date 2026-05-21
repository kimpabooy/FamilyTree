using Backend.Core.Models;

namespace Backend.Services.DTOs.Relations
{
    public class RequestCreatePartnerRelation
    {
        public int Person1Id { get; set; }
        public int Person2Id { get; set; }
        public PartnerType PartnerType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}