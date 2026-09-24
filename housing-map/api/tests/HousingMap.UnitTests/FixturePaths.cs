namespace HousingMap.UnitTests;

internal static class FixturePaths
{
    /// <summary>Finds housing-map/gis/fixtures/dev-sample-scheme by walking up from the test output folder.</summary>
    public static string DevSampleScheme { get; } = Find(Path.Combine("gis", "fixtures", "dev-sample-scheme"));

    private static string Find(string relative)
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            var candidate = Path.Combine(dir.FullName, relative);
            if (Directory.Exists(candidate))
            {
                return candidate;
            }
        }

        throw new DirectoryNotFoundException($"Could not locate '{relative}' above {AppContext.BaseDirectory}.");
    }
}
