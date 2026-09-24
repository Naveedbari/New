using HousingMap.Infrastructure;
using HousingMap.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;

namespace HousingMap.IntegrationTests;

/// <summary>
/// Runs the API against a real PostgreSQL + PostGIS database. The database named in
/// HOUSINGMAP_TEST_CONNECTION (default: local housingmap_test) is dropped and recreated
/// for every factory, then migrated and seeded with the synthetic development dataset.
/// </summary>
public class HousingMapApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private const string DefaultConnection =
        "Host=localhost;Port=5432;Database=housingmap_test;Username=housingmap;Password=housingmap_dev";

    public static string ConnectionString { get; } =
        Environment.GetEnvironmentVariable("HOUSINGMAP_TEST_CONNECTION") ?? DefaultConnection;

    protected virtual string EnvironmentName => "Development";

    protected virtual IDictionary<string, string?> Settings => new Dictionary<string, string?>
    {
        [$"ConnectionStrings:{DependencyInjection.ConnectionStringName}"] = ConnectionString,
        ["Database:ApplyMigrationsOnStartup"] = "true",
        ["Database:SeedDevelopmentData"] = "true",
    };

    public async Task InitializeAsync()
    {
        var options = new DbContextOptionsBuilder<HousingMapDbContext>()
            .UseNpgsql(ConnectionString, npgsql => npgsql.UseNetTopologySuite())
            .UseSnakeCaseNamingConvention()
            .Options;
        await using var db = new HousingMapDbContext(options);
        await db.Database.EnsureDeletedAsync();
    }

    Task IAsyncLifetime.DisposeAsync() => base.DisposeAsync().AsTask();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment(EnvironmentName);

        // UseSetting (not ConfigureAppConfiguration) so values are visible while Program.cs
        // registers services, and override appsettings.{Environment}.json.
        foreach (var (key, value) in Settings)
        {
            builder.UseSetting(key, value);
        }
    }
}
