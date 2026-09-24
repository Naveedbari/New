namespace HousingMap.Api.Startup;

internal static class CorsSetup
{
    public const string MobilePolicy = "mobile";

    /// <summary>Allows the Ionic dev server and Capacitor WebView origins listed in configuration.</summary>
    public static IServiceCollection AddMobileCors(this IServiceCollection services, IConfiguration configuration)
    {
        var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        return services.AddCors(options => options.AddPolicy(MobilePolicy, policy => policy
            .WithOrigins(origins)
            .WithMethods("GET", "POST", "PUT", "DELETE")
            .AllowAnyHeader()));
    }
}
