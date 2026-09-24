using HousingMap.Domain.Datasets;
using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;

namespace HousingMap.Infrastructure.Persistence;

public class HousingMapDbContext(DbContextOptions<HousingMapDbContext> options) : DbContext(options)
{
    public DbSet<GisDataset> GisDatasets => Set<GisDataset>();

    public DbSet<Sector> Sectors => Set<Sector>();

    public DbSet<Block> Blocks => Set<Block>();

    public DbSet<Street> Streets => Set<Street>();

    public DbSet<Road> Roads => Set<Road>();

    public DbSet<Plot> Plots => Set<Plot>();

    public DbSet<PointOfInterest> PointsOfInterest => Set<PointOfInterest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("postgis");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(HousingMapDbContext).Assembly);
    }
}
