using NetTopologySuite.Geometries;

namespace HousingMap.Domain.Gis;

public class Road : GisFeature
{
    public required string Code { get; set; }

    public required string Name { get; set; }

    public RoadType RoadType { get; set; }

    public required MultiLineString Geometry { get; set; }
}
