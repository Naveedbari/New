using System.Text.Json;
using HousingMap.Domain.Datasets;
using HousingMap.Domain.Gis;
using NetTopologySuite;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO.Converters;

namespace HousingMap.Infrastructure.Seeding;

/// <summary>
/// Reads the synthetic development dataset produced by gis/scripts/generate-dev-fixture.mjs.
/// Input: one GeoJSON FeatureCollection per layer, EPSG:4326, [longitude, latitude] order.
/// Output: domain entities with SRID 4326 geometries (X = longitude, Y = latitude) and all
/// code references (sector/block/street) resolved to ids.
/// </summary>
public static class DevelopmentFixtureReader
{
    private static readonly GeometryFactory Factory =
        NtsGeometryServices.Instance.CreateGeometryFactory(SpatialReference.Wgs84Srid);

    private static readonly JsonSerializerOptions JsonOptions = CreateJsonOptions();

    public static DevelopmentFixture Read(string directory)
    {
        var manifest = ReadManifest(directory);
        if (!manifest.IsDevelopmentData)
        {
            throw new FixtureFormatException("Fixture manifest must set isDevelopmentData=true.");
        }

        if (manifest.Crs != SpatialReference.Wgs84Name)
        {
            throw new FixtureFormatException($"Unsupported fixture CRS '{manifest.Crs}'; expected {SpatialReference.Wgs84Name}.");
        }

        var dataset = new GisDataset
        {
            Id = Guid.NewGuid(),
            Version = manifest.Version,
            Name = manifest.Name,
            Crs = manifest.Crs,
            Status = DatasetStatus.Published,
            IsActive = true,
            IsDevelopmentData = true,
            CreatedAt = DateTimeOffset.UtcNow,
            PublishedAt = DateTimeOffset.UtcNow,
        };

        var sectors = ReadLayer(directory, "sectors", f => new Sector
        {
            SourceId = SourceId(f),
            DatasetId = dataset.Id,
            Code = Text(f, "code"),
            Name = Text(f, "name"),
            Geometry = AsMultiPolygon(f),
        });
        var sectorIds = IndexByCode(sectors, s => s.Code, s => s.Id, "sector");

        var blocks = ReadLayer(directory, "blocks", f => new Block
        {
            SourceId = SourceId(f),
            DatasetId = dataset.Id,
            SectorId = Resolve(sectorIds, Text(f, "sectorCode"), "sector", f),
            Code = Text(f, "code"),
            Name = Text(f, "name"),
            Geometry = AsMultiPolygon(f),
        });
        var blockIds = IndexByCode(blocks, b => b.Code, b => b.Id, "block");

        var streets = ReadLayer(directory, "streets", f => new Street
        {
            SourceId = SourceId(f),
            DatasetId = dataset.Id,
            BlockId = Resolve(blockIds, Text(f, "blockCode"), "block", f),
            Code = Text(f, "code"),
            Name = Text(f, "name"),
            Geometry = AsMultiLineString(f),
        });
        var streetIds = IndexByCode(streets, s => s.Code, s => s.Id, "street");

        var roads = ReadLayer(directory, "roads", f => new Road
        {
            SourceId = SourceId(f),
            DatasetId = dataset.Id,
            Code = Text(f, "code"),
            Name = Text(f, "name"),
            RoadType = ParseEnum<RoadType>(f, "roadType"),
            Geometry = AsMultiLineString(f),
        });
        var roadIds = IndexByCode(roads, r => r.Code, r => r.Id, "road");

        var plots = ReadLayer(directory, "plots", f =>
        {
            var geometry = AsMultiPolygon(f);
            return new Plot
            {
                SourceId = SourceId(f),
                DatasetId = dataset.Id,
                PlotNumber = Text(f, "plotNumber"),
                SectorId = Resolve(sectorIds, Text(f, "sectorCode"), "sector", f),
                BlockId = ResolveOptional(blockIds, OptionalText(f, "blockCode"), "block", f),
                StreetId = ResolveOptional(streetIds, OptionalText(f, "streetCode"), "street", f),
                RoadId = ResolveOptional(roadIds, OptionalText(f, "roadCode"), "road", f),
                PlotType = ParseEnum<PlotType>(f, "plotType"),
                Status = ParseEnum<PlotStatus>(f, "status"),
                AreaSquareMetres = OptionalDecimal(f, "areaSquareMetres"),
                Dimensions = OptionalText(f, "dimensions"),
                AuthorityReference = OptionalText(f, "authorityReference"),
                Geometry = geometry,
                CenterPoint = (Point)geometry.InteriorPoint.Copy(),
            };
        });

        var pointsOfInterest = ReadLayer(directory, "pointsOfInterest", f => new PointOfInterest
        {
            SourceId = SourceId(f),
            DatasetId = dataset.Id,
            Name = Text(f, "name"),
            Category = ParseEnum<PoiCategory>(f, "category"),
            Geometry = f.Geometry as Point ?? throw Error(f, "geometry must be a Point"),
        });

        return new DevelopmentFixture(dataset, sectors, blocks, streets, roads, plots, pointsOfInterest);
    }

    private static JsonSerializerOptions CreateJsonOptions()
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        options.Converters.Add(new GeoJsonConverterFactory(Factory));
        return options;
    }

    private static FixtureManifest ReadManifest(string directory)
    {
        var path = Path.Combine(directory, "dataset.json");
        if (!File.Exists(path))
        {
            throw new FixtureFormatException($"Fixture manifest not found: {path}");
        }

        return JsonSerializer.Deserialize<FixtureManifest>(File.ReadAllText(path), JsonOptions)
            ?? throw new FixtureFormatException($"Fixture manifest is empty: {path}");
    }

    private static List<TEntity> ReadLayer<TEntity>(string directory, string layer, Func<IFeature, TEntity> map)
        where TEntity : GisFeature
    {
        var path = Path.Combine(directory, $"{layer}.geojson");
        if (!File.Exists(path))
        {
            throw new FixtureFormatException($"Fixture layer not found: {path}");
        }

        var collection = JsonSerializer.Deserialize<FeatureCollection>(File.ReadAllText(path), JsonOptions)
            ?? throw new FixtureFormatException($"Fixture layer is empty: {path}");

        return collection.Select(feature =>
        {
            if (feature.Geometry is null)
            {
                throw Error(feature, "geometry is missing");
            }

            feature.Geometry.SRID = SpatialReference.Wgs84Srid;
            var entity = map(feature);
            entity.Id = Guid.NewGuid();
            return entity;
        }).ToList();
    }

    private static Dictionary<string, Guid> IndexByCode<T>(IEnumerable<T> items, Func<T, string> code, Func<T, Guid> id, string kind)
    {
        var index = new Dictionary<string, Guid>(StringComparer.Ordinal);
        foreach (var item in items)
        {
            if (!index.TryAdd(code(item), id(item)))
            {
                throw new FixtureFormatException($"Duplicate {kind} code '{code(item)}'.");
            }
        }

        return index;
    }

    private static Guid Resolve(Dictionary<string, Guid> index, string code, string kind, IFeature feature) =>
        index.TryGetValue(code, out var id) ? id : throw Error(feature, $"unknown {kind} code '{code}'");

    private static Guid? ResolveOptional(Dictionary<string, Guid> index, string? code, string kind, IFeature feature) =>
        code is null ? null : Resolve(index, code, kind, feature);

    private static MultiPolygon AsMultiPolygon(IFeature feature) => feature.Geometry switch
    {
        MultiPolygon multi => multi,
        Polygon polygon => Factory.CreateMultiPolygon([polygon]),
        _ => throw Error(feature, "geometry must be a Polygon or MultiPolygon"),
    };

    private static MultiLineString AsMultiLineString(IFeature feature) => feature.Geometry switch
    {
        MultiLineString multi => multi,
        LineString lineString => Factory.CreateMultiLineString([lineString]),
        _ => throw Error(feature, "geometry must be a LineString or MultiLineString"),
    };

    private static string SourceId(IFeature feature) => Text(feature, "id");

    private static string Text(IFeature feature, string name) =>
        OptionalText(feature, name) ?? throw Error(feature, $"property '{name}' is required");

    private static string? OptionalText(IFeature feature, string name)
    {
        var value = feature.Attributes.Exists(name) ? feature.Attributes[name] : null;
        return value switch
        {
            null => null,
            string text when string.IsNullOrWhiteSpace(text) => null,
            string text => text,
            _ => Convert.ToString(value, System.Globalization.CultureInfo.InvariantCulture),
        };
    }

    private static decimal? OptionalDecimal(IFeature feature, string name) =>
        feature.Attributes.Exists(name) && feature.Attributes[name] is { } value
            ? Convert.ToDecimal(value, System.Globalization.CultureInfo.InvariantCulture)
            : null;

    private static TEnum ParseEnum<TEnum>(IFeature feature, string name)
        where TEnum : struct, Enum =>
        Enum.TryParse<TEnum>(Text(feature, name), ignoreCase: false, out var value)
            ? value
            : throw Error(feature, $"invalid {typeof(TEnum).Name} '{Text(feature, name)}'");

    private static FixtureFormatException Error(IFeature feature, string problem)
    {
        var id = feature.Attributes?.Exists("id") == true ? feature.Attributes["id"] : "(no id)";
        return new FixtureFormatException($"Feature {id}: {problem}.");
    }

    private sealed record FixtureManifest(string Version, string Name, string Crs, bool IsDevelopmentData);
}
