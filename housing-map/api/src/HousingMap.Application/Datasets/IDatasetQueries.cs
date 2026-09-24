namespace HousingMap.Application.Datasets;

public interface IDatasetQueries
{
    /// <summary>Returns the production-active dataset, or null when none has been published.</summary>
    Task<ActiveDatasetDto?> GetActiveDatasetAsync(CancellationToken cancellationToken);
}
