using HousingMap.Domain.Datasets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

internal sealed class GisDatasetConfiguration : IEntityTypeConfiguration<GisDataset>
{
    public void Configure(EntityTypeBuilder<GisDataset> builder)
    {
        builder.ToTable("gis_datasets");
        builder.Property(d => d.Version).HasMaxLength(64);
        builder.Property(d => d.Name).HasMaxLength(256);
        builder.Property(d => d.Crs).HasMaxLength(32);
        builder.Property(d => d.Status).HasConversion<string>().HasMaxLength(32);
        builder.HasIndex(d => d.Version).IsUnique();

        // At most one production-active dataset.
        builder.HasIndex(d => d.IsActive).IsUnique().HasFilter("is_active");
    }
}
