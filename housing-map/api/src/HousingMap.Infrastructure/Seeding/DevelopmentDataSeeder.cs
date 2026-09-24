using HousingMap.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HousingMap.Infrastructure.Seeding;

/// <summary>
/// Loads the synthetic development dataset. Idempotent: does nothing when a dataset with the
/// same version already exists, and refuses to replace an active non-development dataset.
/// Callers are responsible for only invoking this in the Development environment.
/// </summary>
public sealed partial class DevelopmentDataSeeder(HousingMapDbContext db, ILogger<DevelopmentDataSeeder> logger)
{
    public async Task SeedAsync(string fixtureDirectory, CancellationToken cancellationToken)
    {
        var fixture = DevelopmentFixtureReader.Read(fixtureDirectory);

        if (await db.GisDatasets.AnyAsync(d => d.Version == fixture.Dataset.Version, cancellationToken))
        {
            LogAlreadySeeded(fixture.Dataset.Version);
            return;
        }

        var active = await db.GisDatasets.SingleOrDefaultAsync(d => d.IsActive, cancellationToken);
        if (active is { IsDevelopmentData: false })
        {
            throw new InvalidOperationException(
                $"Refusing to seed development data: real dataset {active.Version} is active.");
        }

        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);
        if (active is not null)
        {
            active.IsActive = false;
            await db.SaveChangesAsync(cancellationToken);
        }

        db.GisDatasets.Add(fixture.Dataset);
        db.Sectors.AddRange(fixture.Sectors);
        db.Blocks.AddRange(fixture.Blocks);
        db.Streets.AddRange(fixture.Streets);
        db.Roads.AddRange(fixture.Roads);
        db.Plots.AddRange(fixture.Plots);
        db.PointsOfInterest.AddRange(fixture.PointsOfInterest);
        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        LogSeeded(fixture.Dataset.Version, fixture.Plots.Count);
    }

    [LoggerMessage(Level = LogLevel.Information, Message = "Development dataset {Version} already present; skipping seed.")]
    private partial void LogAlreadySeeded(string version);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Seeded SYNTHETIC development dataset {Version} ({PlotCount} plots). Not real data.")]
    private partial void LogSeeded(string version, int plotCount);
}
