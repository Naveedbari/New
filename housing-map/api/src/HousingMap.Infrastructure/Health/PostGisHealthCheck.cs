using HousingMap.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HousingMap.Infrastructure.Health;

/// <summary>Readiness check: the database is reachable and the PostGIS extension is installed.</summary>
internal sealed class PostGisHealthCheck(HousingMapDbContext db) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var version = await db.Database
                .SqlQuery<string>($"SELECT postgis_lib_version() AS \"Value\"")
                .SingleAsync(cancellationToken);
            return HealthCheckResult.Healthy($"PostGIS {version}");
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            return HealthCheckResult.Unhealthy("Database or PostGIS unavailable.", ex);
        }
    }
}
