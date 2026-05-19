using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Services.DTOs.FamilyTree
{
    public class ResponseFamilyTree
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsPublic { get; set; }
        public string OwnerId { get; set; }
        public DateOnly CreatedDate { get; set; }
        public DateOnly? UpdatedDate { get; set; }
    }
}
