using Backend.Services.Auth;
using Backend.Services.DependencyInjection;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using System.Text;
using System.Text.Json.Serialization;

namespace Backend.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            Env.Load("../.env");

            var builder = WebApplication.CreateBuilder(args);

            Console.WriteLine($"Configuration SeedData = '{builder.Configuration["SeedData"]}'");

            // Database connection
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly("Backend.Infrastructure")));

            // Identity
            builder.Services.AddIdentity<User, IdentityRole>(options =>
            {
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

            var jwtSettings = jwtSection.Get<JwtSettings>()
                ?? throw new InvalidOperationException("Missing Jwt configuration");

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

            // Alla repositories, services och JwtTokenService
            builder.Services.AddServiceLayer();

            // Controllers
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("DevPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // OpenAPI med Bearer-säkerhetsdefinition för Scalar
            builder.Services.AddOpenApi(options =>
            {
                options.AddDocumentTransformer((document, context, ct) =>
                {
                    document.Components ??= new();
                    document.Components.SecuritySchemes = new Dictionary<string, OpenApiSecurityScheme>
                    {
                        ["Bearer"] = new OpenApiSecurityScheme
                        {
                            Type = SecuritySchemeType.Http,
                            Scheme = "bearer",
                            BearerFormat = "JWT",
                            Description = "Klistra in din JWT-token här. Den gäller för alla låsta endpoints."
                        }
                    };

                    document.SecurityRequirements =
                    [
                        new OpenApiSecurityRequirement
                        {
                            [new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id   = "Bearer"
                                }
                            }] = []
                        }
                    ];

                    return Task.CompletedTask;
                });
            });

            builder.Services.AddEndpointsApiExplorer();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference(options =>
                {
                    options.AddPreferredSecuritySchemes("Bearer")
                           .AddHttpAuthentication("Bearer", bearer =>
                           {
                               bearer.Token = string.Empty;
                           });
                });
            }

            //app.UseHttpsRedirection(); // utkommenterad för enklare lokal utveckling utan att behöva hantera certifikat
            app.UseCors("DevPolicy");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            // Seed
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