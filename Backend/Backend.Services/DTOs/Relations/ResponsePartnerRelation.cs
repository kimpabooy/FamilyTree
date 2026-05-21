using Backend.Core.Models;
using Backend.Services.DTOs.Person;

namespace Backend.Services.DTOs.Relations
{
    public class ResponsePartnerRelation
    {
        public int Id { get; set; }
        public PartnerType PartnerType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public DateOnly CreatedDate { get; set; }
        public DateOnly? UpdatedDate { get; set; }

        /// <summary>
        /// Den andra parten i relationen, alltså inte den person som man hämtar.
        /// </summary>
        public ResponsePerson Partner { get; set; }
    }
}
