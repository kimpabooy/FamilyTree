using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

namespace Backend.WebApi
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Database connection.
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly("Backend.Infrastructure")));

            // Configure ASP.NET Core Identity for Web API
            builder.Services.AddIdentityApiEndpoints<User>()
                .AddEntityFrameworkStores<AppDbContext>();

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
            app.MapIdentityApi<User>();

            // Create a temporary scope to run DI services before Run()
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    // Run the database seeding
                    await IdentitySeed.InitializeAsync(services);
                    await SeedData.InitializeAsync(services);
                }
                catch (Exception ex)
                {
                    // Logging potential errors during seeding
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }

            app.Run();
        }
    }
}
