using HousingMap.Application.Datasets;
using HousingMap.Infrastructure.Health;
using HousingMap.Infrastructure.Persistence;
using HousingMap.Infrastructure.Seeding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HousingMap.Infrastructure;

public static class DependencyInjection
{
    public const string ConnectionStringName = "HousingMap";
    public const string ReadyHealthCheckTag = "ready";

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString(ConnectionStringName)
            ?? throw new InvalidOperationException(
                $"Connection string '{ConnectionStringName}' is not configured. " +
                $"Set ConnectionStrings__{ConnectionStringName} or use user-secrets.");

        services.AddDbContext<HousingMapDbContext>(options => options
            .UseNpgsql(connectionString, npgsql => npgsql.UseNetTopologySuite())
            .UseSnakeCaseNamingConvention());

        services.AddScoped<IDatasetQueries, DatasetQueries>();
        services.AddScoped<DevelopmentDataSeeder>();
        services.AddHealthChecks().AddCheck<PostGisHealthCheck>("postgis", tags: [ReadyHealthCheckTag]);
        return services;
    }
}
