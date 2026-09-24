using NetTopologySuite.Geometries;

namespace HousingMap.Domain.Gis;

/// <summary>A street or lane inside a block.</summary>
public class Street : GisFeature
{
    public Guid BlockId { get; set; }

    public Block? Block { get; set; }

    public required string Code { get; set; }

    public required string Name { get; set; }

    public required MultiLineString Geometry { get; set; }
}
