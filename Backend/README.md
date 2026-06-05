# Backend (FamilyTree)

The backend is an ASP.NET Core Web API targeting .NET 9 and implements data access with Entity Framework Core and authentication with ASP.NET Core Identity + JWT.

## Quick overview

- Project root (backend): `Backend/`.
- API project: `Backend/Backend.Api` (controllers, Program startup).
- Services: `Backend/Backend.Services` (business logic, DTOs).
- Infrastructure: `Backend/Backend.Infrastructure` (EF Core `AppDbContext`, repositories, migrations, seeding).
- Core: `Backend/Backend.Core` (domain models and interfaces).

## Tech stack

- .NET 9 / C# 13
- ASP.NET Core Web API
- Entity Framework Core (SQL Server by default)
- ASP.NET Core Identity
- JWT authentication
- Layered architecture: Core / Infrastructure / Services / Api

## Prerequisites

- .NET 9 SDK
- SQL Server (local or hosted) or compatible provider
- Optional: `dotnet-ef` tool for migrations: `dotnet tool install --global dotnet-ef`

## Configuration

Configure via `appsettings.json` / `appsettings.Development.json` or environment variables.

Important keys:

- `ConnectionStrings:DefaultConnection` - SQL Server connection string.
- `JwtSettings:Key` - secret used to sign JWTs (use a long, random value in production).
- `JwtSettings:Issuer` and `JwtSettings:Audience`.
- `JwtSettings:ExpiryHours` - token lifetime in hours.

Recommended environment variables (example):

- `ConnectionStrings__DefaultConnection`
- `JwtSettings__Key`
- `JwtSettings__Issuer`
- `JwtSettings__Audience`
- `JwtSettings__ExpiryHours`

## Database: migrations & seeding

From repository root run:

1. Restore packages:
   - `dotnet restore`

2. Apply migrations:
   - `dotnet ef database update --project Backend/Backend.Infrastructure --startup-project Backend/Backend.Api`

Notes:
- `Backend.Infrastructure` contains EF Core migrations located under `Backend/Backend.Infrastructure/Migrations`.
- The project includes seeding helpers:
  - `IdentitySeed` creates deterministic test users with fixed IDs used in seeded data.
  - `SeedData.InitializeAsync` seeds example family trees, persons and relations.
- Seeding is typically invoked at application startup; if not, call `SeedData.InitializeAsync` manually or wire it into `Program.cs`.

## Running the backend

From `Backend/Backend.Api`:

- `dotnet run` (uses application URL(s) configured in launch settings).

If Swagger is enabled in development, open `https://localhost:5001/swagger` (or `http://localhost:5000/swagger`) to explore endpoints.

## Authentication

- Endpoints:
  - `POST /api/auth/register` - register a user.
  - `POST /api/auth/login` - login (returns JWT and refresh token).
  - `POST /api/auth/logout` - logout (requires Authorization).

- Seeded-/Dummydata users (created by `IdentitySeed`): `user1@test.com` .. `user10@test.com` with password `Useruser1!`.

Protected endpoints require `Authorization: Bearer <token>` header. JWT uses the DB user Id as the NameIdentifier claim (`ClaimTypes.NameIdentifier`).

## API summary (key endpoints)

- FamilyTree (`Backend.Api.Controllers.FamilyTreeController`):
  - `GET /api/familytree` - list all family trees
  - `GET /api/familytree/{id}` - get by id
  - `POST /api/familytree` - create (requires auth)
  - `PUT /api/familytree/{id}` - update (owner only)
  - `DELETE /api/familytree/{id}` - delete (owner only)

- Person (`Backend.Api.Controllers.PersonController`):
  - `GET /api/person/tree/{familyTreeId}` - list persons for a tree
  - `GET /api/person/{id}` - get person
  - `GET /api/person/{id}/family` - person + relatives (parents, children, siblings, grandparents, partners)
  - `POST /api/person` - create
  - `PUT /api/person/{id}` - update
  - `DELETE /api/person/{id}` - delete

- Parent-child relations (`ParentChildRelationController`):
  - `GET /api/relations/parent-child/tree/{familyTreeId}`
  - `POST /api/relations/parent-child` - create (returns Conflict if exists)
  - `DELETE /api/relations/parent-child/{id}`

- Partner relations (`PartnerRelationController`):
  - `GET /api/relations/partner/{personId}`
  - `POST /api/relations/partner` - create
  - `PUT /api/relations/partner/{id}` - update
  - `DELETE /api/relations/partner/{id}` - delete

## Troubleshooting

- Migration errors: verify connection string and that SQL Server is reachable. Run migrations with `--verbose` to get detailed output.
- Missing seeded users/data: ensure `SeedData.InitializeAsync` and `IdentitySeed.InitializeAsync` are invoked at startup, or run them manually.
- JWT issues: ensure `JwtSettings:Key` is configured and matches the key used by token generation. Tokens are signed with HmacSha256.

## Development notes

- Mapping between entities and DTOs is manual inside service classes (e.g., `PersonService.MapToResponse`).
- Repositories and UnitOfWork are used for data access (see `Backend.Core.Interface` and `Backend.Infrastructure.Repositories`).

---