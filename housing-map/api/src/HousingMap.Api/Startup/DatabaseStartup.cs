using HousingMap.Infrastructure.Persistence;
using HousingMap.Infrastructure.Seeding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace HousingMap.Api.Startup;

internal static class DatabaseStartup
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        var options = app.Services.GetRequiredService<IOptions<DatabaseStartupOptions>>().Value;
        if (options.SeedDevelopmentData && !app.Environment.IsDevelopment())
        {
            // AC-15: synthetic coordinates must never reach staging or production.
            throw new InvalidOperationException(
                $"Database:SeedDevelopmentData is only allowed in Development (current: {app.Environment.EnvironmentName}).");
        }

        if (!options.ApplyMigrationsOnStartup && !options.SeedDevelopmentData)
        {
            return;
        }

        await using var scope = app.Services.CreateAsyncScope();
        if (options.ApplyMigrationsOnStartup)
        {
            await scope.ServiceProvider.GetRequiredService<HousingMapDbContext>().Database.MigrateAsync();
        }

        if (options.SeedDevelopmentData)
        {
            var fixtureDirectory = Path.GetFullPath(
                Path.Combine(app.Environment.ContentRootPath, options.DevelopmentFixturePath));
            await scope.ServiceProvider.GetRequiredService<DevelopmentDataSeeder>()
                .SeedAsync(fixtureDirectory, CancellationToken.None);
        }
    }
}
