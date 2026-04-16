using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Backend.Core.Models;

namespace Backend.Infrastructure.Data
{
    public static class IdentitySeed
    {
        // Fixed user IDs - must match OwnerId values used in AppDbContext.HasData
        public static readonly string[] UserIds = new[]
        {
            "11111111-1111-1111-1111-111111111111",
            "22222222-2222-2222-2222-222222222222",
            "33333333-3333-3333-3333-333333333333",
            "44444444-4444-4444-4444-444444444444",
            "55555555-5555-5555-5555-555555555555",
            "66666666-6666-6666-6666-666666666666",
            "77777777-7777-7777-7777-777777777777",
            "88888888-8888-8888-8888-888888888888",
            "99999999-9999-9999-9999-999999999999",
            "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        };

        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            // Use GetService so we don't throw if RoleManager isn't registered (extra guard)
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            // Create roles if RoleManager is available
            if (roleManager != null)
            {
                var roles = new[] { "Admin", "User" };
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }

            // Create users deterministically
            for (int i = 1; i <= 10; i++)
            {
                var id = UserIds[i - 1];
                var email = $"user{i}@test.com";

                var existing = await userManager.FindByEmailAsync(email);
                if (existing != null) continue;

                var user = new User
                {
                    Id = id,
                    UserName = email,
                    Email = email,
                    DisplayName = $"Test User {i}",
                    EmailConfirmed = true
                };

                // Use a test password that meets Identity's defaults
                var result = await userManager.CreateAsync(user, "Useruser1!");
                if (!result.Succeeded)
                {
                    var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                    Console.WriteLine($"Failed to create user {email}: {errors}");
                    continue;
                }

                // Assign roles when supported
                if (roleManager != null)
                {
                    // Give every user the 'User' role
                    await userManager.AddToRoleAsync(user, "User");

                    // For the first user, also add 'Admin'
                    if (i == 1)
                    {
                        await userManager.AddToRoleAsync(user, "Admin");
                    }
                }
            }
        }
    }
}
