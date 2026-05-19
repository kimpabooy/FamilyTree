using Backend.Core.Models;

namespace Backend.Services.DTOs.Relations
{
    public class RequestUpdatePartnerRelation
    {
        public PartnerType PartnerType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
