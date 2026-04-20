using Backend.Core.Interface;
using Backend.Services.Interface;
namespace Backend.Services.Services
{
    public class PartnerRelationService : IPartnerRelationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PartnerRelationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}
