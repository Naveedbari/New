namespace HousingMap.Application.Datasets;

public sealed record ActiveDatasetDto(
    string Version,
    string Name,
    string Crs,
    bool IsDevelopmentData,
    DateTimeOffset? PublishedAt,
    DatasetFeatureCounts FeatureCounts);

public sealed record DatasetFeatureCounts(
    int Sectors,
    int Blocks,
    int Streets,
    int Roads,
    int Plots,
    int PointsOfInterest);
