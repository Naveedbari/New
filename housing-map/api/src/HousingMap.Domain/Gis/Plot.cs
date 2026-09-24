using NetTopologySuite.Geometries;

namespace HousingMap.Domain.Gis;

public class Plot : GisFeature
{
    /// <summary>Plot number as printed by the authority. Text, because numbers like "12-A" exist.</summary>
    public required string PlotNumber { get; set; }

    public Guid SectorId { get; set; }

    public Sector? Sector { get; set; }

    public Guid? BlockId { get; set; }

    public Block? Block { get; set; }

    public Guid? StreetId { get; set; }

    public Street? Street { get; set; }

    public Guid? RoadId { get; set; }

    public Road? Road { get; set; }

    public PlotType PlotType { get; set; }

    public PlotStatus Status { get; set; }

    public decimal? AreaSquareMetres { get; set; }

    public string? Dimensions { get; set; }

    public string? AuthorityReference { get; set; }

    public required MultiPolygon Geometry { get; set; }

    /// <summary>A point guaranteed to lie inside <see cref="Geometry"/>, used for labels and routing targets.</summary>
    public required Point CenterPoint { get; set; }
}
