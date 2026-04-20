using Backend.Infrastructure.Data;
using Backend.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using DotNetEnv;
using Backend.Core.Interface;
using Backend.Infrastructure.Repositories;
using Backend.Services.DependencyInjection;

namespace Backend.WebApi
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Läser in miljövariabler från .env-filen i projektets rotkatalog
            Env.Load(".env");

            var builder = WebApplication.CreateBuilder(args);

            Console.WriteLine($"Configuration SeedData = '{builder.Configuration["SeedData"]}'");

            // Database connection.
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly("Backend.Infrastructure")));

            // Register Identity with roles so RoleManager is available
            builder.Services.AddIdentity<User, IdentityRole>(options =>
            {
                // Password settings - adjust as needed
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            // UnitofWork
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Service layer
            builder.Services.AddServiceLayer();

            // Controllers and API-documentation
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi(); // Exposes standard OpenAPI document
                app.MapScalarApiReference(); // Renders the Scalar UI
            }

            app.UseHttpsRedirection();

            // Authentication & Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // API endpoints
            app.MapControllers();

            // Seed the database with initial data if configured to do so.
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                try
                {
                    var config = services.GetRequiredService<IConfiguration>();
                    var shouldSeed = config.GetValue<bool>("SeedData");

                    if (shouldSeed)
                    {
                        await IdentitySeed.InitializeAsync(services);
                        await SeedData.InitializeAsync(services);
                    }
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }

            app.Run();
        }
    }
}
