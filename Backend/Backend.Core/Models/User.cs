using Microsoft.AspNet.Identity.EntityFramework;

namespace Backend.Core.Models
{
    public class User : IdentityUser
    {
        public string DisplayName { get; set; }
        public ICollection<FamilyTree> Trees { get; set; }

    };
}
