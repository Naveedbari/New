using HousingMap.Application.Datasets;
using Microsoft.EntityFrameworkCore;

namespace HousingMap.Infrastructure.Persistence;

internal sealed class DatasetQueries(HousingMapDbContext db) : IDatasetQueries
{
    public async Task<ActiveDatasetDto?> GetActiveDatasetAsync(CancellationToken cancellationToken)
    {
        var dataset = await db.GisDatasets.AsNoTracking()
            .SingleOrDefaultAsync(d => d.IsActive, cancellationToken);
        if (dataset is null)
        {
            return null;
        }

        var counts = new DatasetFeatureCounts(
            await db.Sectors.CountAsync(f => f.DatasetId == dataset.Id, cancellationToken),
            await db.Blocks.CountAsync(f => f.DatasetId == dataset.Id, cancellationToken),
            await db.Streets.CountAsync(f => f.DatasetId == dataset.Id, cancellationToken),
            await db.Roads.CountAsync(f => f.DatasetId == dataset.Id, cancellationToken),
            await db.Plots.CountAsync(f => f.DatasetId == dataset.Id, cancellationToken),
            await db.PointsOfInterest.CountAsync(f => f.DatasetId == dataset.Id, cancellationToken));

        return new ActiveDatasetDto(
            dataset.Version,
            dataset.Name,
            dataset.Crs,
            dataset.IsDevelopmentData,
            dataset.PublishedAt,
            counts);
    }
}
