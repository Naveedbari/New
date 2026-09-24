namespace HousingMap.IntegrationTests;

public class EnvironmentGuardTests
{
    [Fact]
    public void Production_refuses_to_seed_development_data()
    {
        using var factory = new ProductionSeedingFactory();

        var error = Assert.Throws<InvalidOperationException>(() => factory.CreateClient());

        Assert.Contains("only allowed in Development", error.Message, StringComparison.Ordinal);
    }

    private sealed class ProductionSeedingFactory : HousingMapApiFactory
    {
        protected override string EnvironmentName => "Production";
    }
}
