using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Services.DTOs.FamilyTree
{
    public class RequestUpdateFamilyTree
    {
        public string Name { get; set; }
        public bool IsPublic { get; set; }
    }
}
