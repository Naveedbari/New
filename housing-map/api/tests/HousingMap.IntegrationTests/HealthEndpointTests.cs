using System.Net;
using System.Text.Json;

namespace HousingMap.IntegrationTests;

[Collection(ApiTestGroup.Name)]
public class HealthEndpointTests(HousingMapApiFactory factory)
{
    [Fact]
    public async Task Live_reports_healthy_without_checking_dependencies()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync(new Uri("/health/live", UriKind.Relative));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("Healthy", body.RootElement.GetProperty("status").GetString());
    }

    [Fact]
    public async Task Ready_reports_postgis_healthy()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync(new Uri("/health/ready", UriKind.Relative));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("Healthy", body.RootElement.GetProperty("checks").GetProperty("postgis").GetString());
    }
}
