using Backend.Core.Interface;
using Backend.Infrastructure.Repositories;
using Backend.Services.Interface;
using Backend.Services.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Services.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServiceLayer(this IServiceCollection services)
        {
            // Repositories
            services.AddScoped<IFamilyTreeRepository, FamilyTreeRepository>();
            services.AddScoped<IPersonRepository, PersonRepository>();
            services.AddScoped<IParentChildRelationRepository, ParentChildRelationRepository>();
            services.AddScoped<IPartnerRelationRepository, PartnerRelationRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Services
            services.AddScoped<IFamilyTreeService, FamilyTreeService>();
            services.AddScoped<IPersonService, PersonService>();
            services.AddScoped<IParentChildRelationService, ParentChildRelationService>();
            services.AddScoped<IPartnerRelationService, PartnerRelationService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}