using Backend.Core.Interface;
using Backend.Services.Interface;

namespace Backend.Services.Services
{
    public class ParentChildRelationService : IParentChildRelationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ParentChildRelationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}
