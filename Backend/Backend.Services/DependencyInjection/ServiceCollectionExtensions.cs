using Backend.Core.Interface;
using Backend.Infrastructure.Repositories;
using Backend.Services.Auth;
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

            // UnitOfWork
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Auth
            services.AddScoped<JwtTokenService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();

            // Services
            services.AddScoped<IFamilyTreeService, FamilyTreeService>();
            services.AddScoped<IPersonService, PersonService>();
            services.AddScoped<IParentChildRelationService, ParentChildRelationService>();
            services.AddScoped<IPartnerRelationService, PartnerRelationService>();
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}