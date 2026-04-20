using Backend.Core.Interface;
using Backend.Services.Interface;

namespace Backend.Services.Services
{
    public class FamilyTreeService : IFamilyTreeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public FamilyTreeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}
