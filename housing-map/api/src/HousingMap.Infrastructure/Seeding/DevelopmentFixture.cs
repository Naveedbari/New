using HousingMap.Domain.Datasets;
using HousingMap.Domain.Gis;

namespace HousingMap.Infrastructure.Seeding;

/// <summary>A fully resolved development dataset, ready to be persisted.</summary>
public sealed record DevelopmentFixture(
    GisDataset Dataset,
    IReadOnlyList<Sector> Sectors,
    IReadOnlyList<Block> Blocks,
    IReadOnlyList<Street> Streets,
    IReadOnlyList<Road> Roads,
    IReadOnlyList<Plot> Plots,
    IReadOnlyList<PointOfInterest> PointsOfInterest);
