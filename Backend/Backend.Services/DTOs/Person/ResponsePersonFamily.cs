using Backend.Services.DTOs.Relations;

namespace Backend.Services.DTOs.Person
{
    public class ResponsePersonFamily
    {
        public ResponsePerson? Person { get; set; }
        public IEnumerable<ResponsePerson>? Parents { get; set; }
        public IEnumerable<ResponsePerson>? Children { get; set; }
        public IEnumerable<ResponsePerson>? Siblings { get; set; }
        public IEnumerable<ResponsePerson>? Grandparents { get; set; }
        public IEnumerable<ResponsePartnerRelation>? Partners { get; set; }
    }
}
