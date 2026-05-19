namespace Backend.Services.DTOs.Relations
{
    public class ResponseParentChildRelation
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public int ChildId { get; set; }
        public DateOnly CreatedDate { get; set; }
    }
}
