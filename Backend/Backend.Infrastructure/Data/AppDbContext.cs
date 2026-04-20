using Backend.Core.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<FamilyTree> FamilyTrees { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<ParentChildRelation> ParentChildRelations { get; set; }
        public DbSet<PartnerRelation> PartnerRelations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Parent-child as Parent relationship configuration
            modelBuilder.Entity<ParentChildRelation>()
                .HasOne(pc => pc.Parent)
                .WithMany(p => p.AsParent)
                .HasForeignKey(pc => pc.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Parent-child as Child relationship configuration
            modelBuilder.Entity<ParentChildRelation>()
                .HasOne(pc => pc.Child)
                .WithMany(p => p.AsChild)
                .HasForeignKey(pc => pc.ChildId)
                .OnDelete(DeleteBehavior.Restrict);

            // Partner1 relationship configuration
            modelBuilder.Entity<PartnerRelation>()
                .HasOne(p => p.Person1)
                .WithMany(p => p.Partners)
                .HasForeignKey(p => p.Person1Id)
                .OnDelete(DeleteBehavior.Restrict);

            // Partner2 relationship configuration
            modelBuilder.Entity<PartnerRelation>()
                .HasOne(p => p.Person2)
                .WithMany()
                .HasForeignKey(p => p.Person2Id)
                .OnDelete(DeleteBehavior.Restrict);

            // FamilyTree relationship configuration
            modelBuilder.Entity<FamilyTree>()
                .HasOne(t => t.Owner)
                .WithMany(u => u.Trees)
                .HasForeignKey(t => t.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
