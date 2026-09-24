using HousingMap.Domain.Datasets;
using HousingMap.Domain.Gis;
using HousingMap.Infrastructure.Persistence;
using HousingMap.Infrastructure.Seeding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NetTopologySuite.Geometries;

namespace HousingMap.IntegrationTests;

[Collection(ApiTestGroup.Name)]
public class DatabaseTests(HousingMapApiFactory factory)
{
    [Fact]
    public async Task Seeding_twice_does_not_duplicate_the_dataset()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var seeder = scope.ServiceProvider.GetRequiredService<DevelopmentDataSeeder>();
        var db = scope.ServiceProvider.GetRequiredService<HousingMapDbContext>();
        var fixtureDirectory = Path.Combine(FindHousingMapRoot(), "gis", "fixtures", "dev-sample-scheme");

        await seeder.SeedAsync(fixtureDirectory, CancellationToken.None);

        Assert.Equal(1, await db.GisDatasets.CountAsync());
        Assert.Equal(120, await db.Plots.CountAsync());
    }

    [Fact]
    public async Task Spatial_query_finds_sector_containing_plot_centre()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<HousingMapDbContext>();
        var plot = await db.Plots.Include(p => p.Sector).FirstAsync(p => p.SourceId == "DEV-P-B-1");

        // Runs ST_Contains in PostGIS. A lon/lat swap would place the point outside every sector.
        var centre = plot.CenterPoint;
        var containing = await db.Sectors.Where(s => s.Geometry.Contains(centre)).Select(s => s.Code).ToListAsync();

        Assert.Equal(["B"], containing);
        Assert.Equal(SpatialReference.Wgs84Srid, centre.SRID);
    }

    [Fact]
    public async Task Only_one_dataset_can_be_active()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<HousingMapDbContext>();
        db.GisDatasets.Add(new GisDataset
        {
            Version = $"second-active-{Guid.NewGuid():N}",
            Name = "Second active dataset",
            Crs = SpatialReference.Wgs84Name,
            Status = DatasetStatus.Published,
            IsActive = true,
            IsDevelopmentData = true,
            CreatedAt = DateTimeOffset.UtcNow,
        });

        await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync());
    }

    [Fact]
    public async Task Geometry_columns_have_gist_indexes()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<HousingMapDbContext>();

        var indexed = await db.Database.SqlQuery<string>($"""
            SELECT tablename AS "Value" FROM pg_indexes
            WHERE indexdef ILIKE '%USING gist (geometry)%'
            """).ToListAsync();

        Assert.Equal(
            ["blocks", "plots", "points_of_interest", "roads", "sectors", "streets"],
            indexed.Order(StringComparer.Ordinal));
    }

    private static string FindHousingMapRoot()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            if (Directory.Exists(Path.Combine(dir.FullName, "gis", "fixtures")))
            {
                return dir.FullName;
            }
        }

        throw new DirectoryNotFoundException("housing-map root not found.");
    }
}
