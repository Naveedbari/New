namespace HousingMap.Api.Startup;

internal sealed class DatabaseStartupOptions
{
    public const string SectionName = "Database";

    /// <summary>Apply EF Core migrations at startup. Development convenience only.</summary>
    public bool ApplyMigrationsOnStartup { get; set; }

    /// <summary>Load the synthetic development dataset. Only allowed in the Development environment.</summary>
    public bool SeedDevelopmentData { get; set; }

    /// <summary>Fixture directory, relative to the content root (src/HousingMap.Api).</summary>
    public string DevelopmentFixturePath { get; set; } = "../../../gis/fixtures/dev-sample-scheme";
}
