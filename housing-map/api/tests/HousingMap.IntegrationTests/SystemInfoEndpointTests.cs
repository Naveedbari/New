using System.Net;
using System.Net.Http.Json;
using HousingMap.Api.Contracts;

namespace HousingMap.IntegrationTests;

[Collection(ApiTestGroup.Name)]
public class SystemInfoEndpointTests(HousingMapApiFactory factory)
{
    [Fact]
    public async Task Returns_active_development_dataset()
    {
        using var client = factory.CreateClient();

        var info = await client.GetFromJsonAsync<SystemInfoResponse>(new Uri("/api/v1/system/info", UriKind.Relative));

        Assert.NotNull(info);
        Assert.Equal("1", info.ApiVersion);
        Assert.NotNull(info.ActiveDataset);
        Assert.True(info.ActiveDataset.IsDevelopmentData);
        Assert.Equal("dev-sample-0.1", info.ActiveDataset.Version);
        Assert.Equal(120, info.ActiveDataset.FeatureCounts.Plots);
        Assert.Equal(2, info.ActiveDataset.FeatureCounts.Sectors);
    }

    [Fact]
    public async Task Reports_supported_api_versions()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync(new Uri("/api/v1/system/info", UriKind.Relative));

        Assert.Contains("1", response.Headers.GetValues("api-supported-versions").Single(), StringComparison.Ordinal);
    }

    [Fact]
    public async Task Unknown_api_version_returns_problem_details()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync(new Uri("/api/v99/system/info", UriKind.Relative));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }
}
