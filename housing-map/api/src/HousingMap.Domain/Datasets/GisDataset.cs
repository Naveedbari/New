namespace HousingMap.Domain.Datasets;

/// <summary>
/// A versioned, published set of GIS features. Only one dataset may be active at a time
/// (enforced by a unique partial index in the database).
/// </summary>
public class GisDataset
{
    public Guid Id { get; set; }

    /// <summary>Human-readable version label, e.g. "2026-09-01" or "dev-sample-0.1".</summary>
    public required string Version { get; set; }

    public required string Name { get; set; }

    /// <summary>CRS the geometries are stored in, e.g. "EPSG:4326".</summary>
    public required string Crs { get; set; }

    public DatasetStatus Status { get; set; }

    public bool IsActive { get; set; }

    /// <summary>True for synthetic fixtures. Such datasets must never exist outside Development.</summary>
    public bool IsDevelopmentData { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? PublishedAt { get; set; }
}
