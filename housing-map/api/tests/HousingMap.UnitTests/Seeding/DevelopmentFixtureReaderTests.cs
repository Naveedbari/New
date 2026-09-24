using HousingMap.Domain.Gis;
using HousingMap.Infrastructure.Seeding;
using NetTopologySuite.Geometries;

namespace HousingMap.UnitTests.Seeding;

public class DevelopmentFixtureReaderTests
{
    // The synthetic scheme lives next to 0°N 0°E. Anything outside this box (degrees) would
    // mean real-looking coordinates slipped into the development fixture.
    private const double NullIslandMaxDegrees = 0.02;

    private static readonly DevelopmentFixture Fixture = DevelopmentFixtureReader.Read(FixturePaths.DevSampleScheme);

    [Fact]
    public void Reads_all_layers()
    {
        Assert.Equal("dev-sample-0.1", Fixture.Dataset.Version);
        Assert.True(Fixture.Dataset.IsDevelopmentData);
        Assert.Equal(SpatialReference.Wgs84Name, Fixture.Dataset.Crs);
        Assert.Equal(2, Fixture.Sectors.Count);
        Assert.Equal(4, Fixture.Blocks.Count);
        Assert.Equal(12, Fixture.Streets.Count);
        Assert.Equal(3, Fixture.Roads.Count);
        Assert.Equal(120, Fixture.Plots.Count);
        Assert.Equal(4, Fixture.PointsOfInterest.Count);
    }

    [Fact]
    public void All_geometries_are_valid_wgs84_and_stay_near_null_island()
    {
        foreach (var geometry in AllGeometries())
        {
            Assert.True(geometry.IsValid, $"Invalid geometry: {geometry}");
            Assert.Equal(SpatialReference.Wgs84Srid, geometry.SRID);
            foreach (var coordinate in geometry.Coordinates)
            {
                // X = longitude, Y = latitude.
                Assert.InRange(coordinate.X, -NullIslandMaxDegrees, NullIslandMaxDegrees);
                Assert.InRange(coordinate.Y, -NullIslandMaxDegrees, NullIslandMaxDegrees);
            }
        }
    }

    [Fact]
    public void Plots_lie_inside_their_block_and_sector()
    {
        var blocks = Fixture.Blocks.ToDictionary(b => b.Id);
        var sectors = Fixture.Sectors.ToDictionary(s => s.Id);

        foreach (var plot in Fixture.Plots)
        {
            Assert.NotNull(plot.BlockId);
            Assert.True(blocks[plot.BlockId.Value].Geometry.Covers(plot.Geometry), $"{plot.SourceId} outside block");
            Assert.True(sectors[plot.SectorId].Geometry.Covers(plot.Geometry), $"{plot.SourceId} outside sector");
            Assert.True(plot.Geometry.Covers(plot.CenterPoint), $"{plot.SourceId} centre point outside plot");
        }
    }

    [Fact]
    public void Plots_do_not_overlap()
    {
        var plots = Fixture.Plots;
        for (var i = 0; i < plots.Count; i++)
        {
            for (var j = i + 1; j < plots.Count; j++)
            {
                Assert.False(
                    plots[i].Geometry.Relate(plots[j].Geometry, "2********"),
                    $"{plots[i].SourceId} overlaps {plots[j].SourceId}");
            }
        }
    }

    [Fact]
    public void Plot_numbers_are_unique_per_sector_but_repeat_across_sectors()
    {
        foreach (var sector in Fixture.Plots.GroupBy(p => p.SectorId))
        {
            Assert.Equal(sector.Count(), sector.Select(p => p.PlotNumber).Distinct().Count());
        }

        // Deliberate ambiguity so search can be tested against AC-03.
        Assert.Contains(Fixture.Plots.GroupBy(p => p.PlotNumber), group => group.Count() > 1);
    }

    [Fact]
    public void Missing_manifest_is_rejected()
    {
        using var temp = TempFixture.CopyOf(FixturePaths.DevSampleScheme);
        File.Delete(Path.Combine(temp.Path, "dataset.json"));

        var error = Assert.Throws<FixtureFormatException>(() => DevelopmentFixtureReader.Read(temp.Path));
        Assert.Contains("manifest not found", error.Message, StringComparison.Ordinal);
    }

    [Fact]
    public void Unknown_sector_reference_is_rejected()
    {
        using var temp = TempFixture.CopyOf(FixturePaths.DevSampleScheme);
        var blocksPath = Path.Combine(temp.Path, "blocks.geojson");
        File.WriteAllText(blocksPath, File.ReadAllText(blocksPath).Replace("\"sectorCode\": \"A\"", "\"sectorCode\": \"Z\"", StringComparison.Ordinal));

        var error = Assert.Throws<FixtureFormatException>(() => DevelopmentFixtureReader.Read(temp.Path));
        Assert.Contains("unknown sector code 'Z'", error.Message, StringComparison.Ordinal);
    }

    [Fact]
    public void Non_development_manifest_is_rejected()
    {
        using var temp = TempFixture.CopyOf(FixturePaths.DevSampleScheme);
        var manifestPath = Path.Combine(temp.Path, "dataset.json");
        File.WriteAllText(manifestPath, File.ReadAllText(manifestPath).Replace("\"isDevelopmentData\": true", "\"isDevelopmentData\": false", StringComparison.Ordinal));

        Assert.Throws<FixtureFormatException>(() => DevelopmentFixtureReader.Read(temp.Path));
    }

    private static IEnumerable<Geometry> AllGeometries() =>
        Fixture.Sectors.Select(f => (Geometry)f.Geometry)
            .Concat(Fixture.Blocks.Select(f => f.Geometry))
            .Concat(Fixture.Streets.Select(f => f.Geometry))
            .Concat(Fixture.Roads.Select(f => f.Geometry))
            .Concat(Fixture.Plots.Select(f => f.Geometry))
            .Concat(Fixture.Plots.Select(f => f.CenterPoint))
            .Concat(Fixture.PointsOfInterest.Select(f => f.Geometry));

    private sealed class TempFixture : IDisposable
    {
        private TempFixture(string path) => Path = path;

        public string Path { get; }

        public static TempFixture CopyOf(string source)
        {
            var target = System.IO.Path.Combine(System.IO.Path.GetTempPath(), $"housingmap-fixture-{Guid.NewGuid():N}");
            Directory.CreateDirectory(target);
            foreach (var file in Directory.GetFiles(source))
            {
                File.Copy(file, System.IO.Path.Combine(target, System.IO.Path.GetFileName(file)));
            }

            return new TempFixture(target);
        }

        public void Dispose() => Directory.Delete(Path, recursive: true);
    }
}
