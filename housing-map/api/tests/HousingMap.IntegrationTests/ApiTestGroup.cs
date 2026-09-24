namespace HousingMap.IntegrationTests;

/// <summary>Tests in this collection share one database, so they must not run in parallel.</summary>
[CollectionDefinition(Name)]
public sealed class ApiTestGroup : ICollectionFixture<HousingMapApiFactory>
{
    public const string Name = "api";
}
