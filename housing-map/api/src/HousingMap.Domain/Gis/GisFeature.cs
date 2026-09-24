using HousingMap.Domain.Datasets;

namespace HousingMap.Domain.Gis;

/// <summary>
/// Base type for every spatial feature. Features belong to exactly one dataset version.
/// Geometry CRS is the dataset's <see cref="GisDataset.Crs"/> (EPSG:4326 for now,
/// X = longitude, Y = latitude).
/// </summary>
public abstract class GisFeature
{
    public Guid Id { get; set; }

    public Guid DatasetId { get; set; }

    public GisDataset? Dataset { get; set; }

    /// <summary>Stable feature identifier from the source data; unique within a dataset.</summary>
    public required string SourceId { get; set; }
}
