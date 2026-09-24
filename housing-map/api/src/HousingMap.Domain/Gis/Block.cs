using NetTopologySuite.Geometries;

namespace HousingMap.Domain.Gis;

public class Block : GisFeature
{
    public Guid SectorId { get; set; }

    public Sector? Sector { get; set; }

    public required string Code { get; set; }

    public required string Name { get; set; }

    public required MultiPolygon Geometry { get; set; }
}
