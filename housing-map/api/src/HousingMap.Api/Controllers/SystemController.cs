using Asp.Versioning;
using HousingMap.Api.Contracts;
using HousingMap.Application.Datasets;
using Microsoft.AspNetCore.Mvc;

namespace HousingMap.Api.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/system")]
public sealed class SystemController(IDatasetQueries datasetQueries, IHostEnvironment environment) : ControllerBase
{
    /// <summary>API version, environment and the currently active GIS dataset.</summary>
    [HttpGet("info")]
    [ProducesResponseType<SystemInfoResponse>(StatusCodes.Status200OK)]
    public async Task<SystemInfoResponse> GetInfo(CancellationToken cancellationToken)
    {
        var dataset = await datasetQueries.GetActiveDatasetAsync(cancellationToken);
        return new SystemInfoResponse("1", environment.EnvironmentName, dataset);
    }
}
