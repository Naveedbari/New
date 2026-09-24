using Asp.Versioning;
using HousingMap.Api.Startup;
using HousingMap.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();
builder.Services
    .AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(1);
        options.ReportApiVersions = true;
        options.ApiVersionReader = new UrlSegmentApiVersionReader();
    })
    .AddMvc();
builder.Services.AddMobileCors(builder.Configuration);
builder.Services.AddOptions<DatabaseStartupOptions>()
    .Bind(builder.Configuration.GetSection(DatabaseStartupOptions.SectionName));

var app = builder.Build();

// Unhandled exceptions become RFC 7807 problem responses without stack traces.
app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors(CorsSetup.MobilePolicy);
app.MapHealthEndpoints();
app.MapControllers();

await app.InitialiseDatabaseAsync();
await app.RunAsync();

/// <summary>Entry point; public so integration tests can use WebApplicationFactory.</summary>
public partial class Program;
