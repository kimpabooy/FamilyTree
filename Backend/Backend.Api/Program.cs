using Backend.Core.Interface;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Backend.Infrastructure.Repositories;
using Backend.Services.Auth;
using Backend.Services.DependencyInjection;
using Backend.Services.Interface;
using Backend.Services.Services;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using System.Text.Json.Serialization;

namespace Backend.WebApi
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Läser in miljövariabler från .env-filen i projektets rotkatalog
            Env.Load("../.env");
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

            // JWT Authentication
            var jwtSection = builder.Configuration.GetSection("Jwt");
            builder.Services.AddOptions<JwtSettings>()
                   .Bind(jwtSection)
                   .ValidateDataAnnotations()
                   .Validate(s => !string.IsNullOrWhiteSpace(s.Key) && s.Key.Length >= 32, 
                   "Jwt:Key must be set and at least 32 chars.");
            var jwtSettings = jwtSection.Get<JwtSettings>() ?? throw new InvalidOperationException("Missing Jwt configuration");

            // Debugging output to verify JWT configuration presence
            Console.WriteLine($"Env Jwt__Key present: {Environment.GetEnvironmentVariable("Jwt__Key") != null}");

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
                    ValidateIssuer = !string.IsNullOrEmpty(jwtSettings.Issuer),
                    ValidIssuer = jwtSettings.Issuer,
                    ValidateAudience = !string.IsNullOrEmpty(jwtSettings.Audience),
                    ValidAudience = jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            // UnitOfWork
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Register JWT/token services
            builder.Services.AddScoped<JwtTokenService>();
            builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

            // Service layer
            builder.Services.AddServiceLayer();

            // Controllers and API-documentation
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            }); 

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
