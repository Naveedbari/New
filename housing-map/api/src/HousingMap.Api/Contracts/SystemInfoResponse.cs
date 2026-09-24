using HousingMap.Application.Datasets;

namespace HousingMap.Api.Contracts;

public sealed record SystemInfoResponse(string ApiVersion, string Environment, ActiveDatasetDto? ActiveDataset);
