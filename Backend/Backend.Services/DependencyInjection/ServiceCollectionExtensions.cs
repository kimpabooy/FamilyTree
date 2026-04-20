using Microsoft.Extensions.DependencyInjection;
using Backend.Services.Interface;
using Backend.Services.Services;

namespace Backend.Services.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServiceLayer(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPersonService, PersonService>();
            services.AddScoped<IParentChildRelationService, ParentChildRelationService>();
            services.AddScoped<IPartnerRelationService, PartnerRelationService>();
            services.AddScoped<IFamilyTreeService, FamilyTreeService>();

            return services;
        }
    }
}
