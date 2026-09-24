using NetTopologySuite.Geometries;

namespace HousingMap.Domain.Gis;

public class Sector : GisFeature
{
    public required string Code { get; set; }

    public required string Name { get; set; }

    public required MultiPolygon Geometry { get; set; }
}
