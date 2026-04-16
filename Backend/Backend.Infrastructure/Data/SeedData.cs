using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var dbContext = serviceProvider.GetRequiredService<AppDbContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        await IdentitySeed.InitializeAsync(serviceProvider);

        // Avbryt om data redan finns
        if (await dbContext.FamilyTrees.AnyAsync())
            return;

        // --- FamilyTrees --- //
        var familyTrees = new List<FamilyTree>();
        var userIds = IdentitySeed.UserIds;

        for (int i = 0; i < 10; i++)
        {
            familyTrees.Add(new FamilyTree
            {
                Name = $"FamilyTree {i + 1}",
                IsPublic = i % 2 == 0,
                OwnerId = userIds[i % userIds.Length]
            });
        }

        dbContext.FamilyTrees.AddRange(familyTrees);
        await dbContext.SaveChangesAsync();

        // --- Persons --- //
        var persons = new List<Person>();
        var random = new Random();

        var firstNamesMale = new[] { "Erik", "Lars", "Johan", "Oskar" };
        var firstNamesFemale = new[] { "Anna", "Karin", "Sofia", "Lisa" };
        var lastNames = new[] { "Svensson", "Johansson", "Andersson", "Nilsson" };

        foreach (var tree in familyTrees)
        {
            var lastName = lastNames[random.Next(lastNames.Length)];

            var parent1 = new Person
            {
                FamilyTreeId = tree.Id,
                FirstName = firstNamesFemale[random.Next(firstNamesFemale.Length)],
                LastName = lastName,
                BirthDate = new DateTime(1975, 1, 1),
                Gender = Gender.Female
            };

            var parent2 = new Person
            {
                FamilyTreeId = tree.Id,
                FirstName = firstNamesMale[random.Next(firstNamesMale.Length)],
                LastName = lastName,
                BirthDate = new DateTime(1973, 1, 1),
                Gender = Gender.Male
            };

            var child1 = new Person
            {
                FamilyTreeId = tree.Id,
                FirstName = firstNamesFemale[random.Next(firstNamesFemale.Length)],
                LastName = lastName,
                BirthDate = new DateTime(2005, 1, 1),
                Gender = Gender.Female
            };

            var child2 = new Person
            {
                FamilyTreeId = tree.Id,
                FirstName = firstNamesMale[random.Next(firstNamesMale.Length)],
                LastName = lastName,
                BirthDate = new DateTime(2008, 1, 1),
                Gender = Gender.Male
            };

            persons.AddRange(new[] { parent1, parent2, child1, child2 });
        }

        dbContext.Persons.AddRange(persons);
        await dbContext.SaveChangesAsync();

        // --- Relationer --- //
        var partnerRelations = new List<PartnerRelation>();
        var parentChildRelations = new List<ParentChildRelation>();

        foreach (var tree in familyTrees)
        {
            var family = persons
                .Where(p => p.FamilyTreeId == tree.Id)
                .ToList();

            if (family.Count < 4)
                continue;

            var parent1 = family[0];
            var parent2 = family[1];
            var child1 = family[2];
            var child2 = family[3];

            // Partner
            partnerRelations.Add(new PartnerRelation
            {
                Person1Id = parent1.Id,
                Person2Id = parent2.Id,
                PartnerType = PartnerType.Current,
                FromDate = new DateTime(2000, 1, 1)
            });

            // Parent -> Child relationer
            var children = new[] { child1, child2 };

            foreach (var child in children)
            {
                parentChildRelations.Add(new ParentChildRelation
                {
                    ParentId = parent1.Id,
                    ChildId = child.Id
                });

                parentChildRelations.Add(new ParentChildRelation
                {
                    ParentId = parent2.Id,
                    ChildId = child.Id
                });
            }
        }

        dbContext.PartnerRelations.AddRange(partnerRelations);
        dbContext.ParentChildRelations.AddRange(parentChildRelations);

        await dbContext.SaveChangesAsync();
    }
}
