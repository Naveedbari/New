using NetTopologySuite.Geometries;

namespace HousingMap.Domain.Gis;

public class PointOfInterest : GisFeature
{
    public required string Name { get; set; }

    public PoiCategory Category { get; set; }

    public required Point Geometry { get; set; }
}
