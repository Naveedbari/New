using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

internal sealed class SectorConfiguration : IEntityTypeConfiguration<Sector>
{
    public void Configure(EntityTypeBuilder<Sector> builder)
    {
        builder.ConfigureFeature("sectors");
        builder.Property(s => s.Code).HasMaxLength(GisFeatureConfiguration.CodeMaxLength);
        builder.Property(s => s.Name).HasMaxLength(GisFeatureConfiguration.NameMaxLength);
        builder.Property(s => s.Geometry).IsSpatial("MultiPolygon");
        builder.HasIndex(s => new { s.DatasetId, s.Code }).IsUnique();
        builder.HasIndex(s => s.Geometry).HasMethod("gist");
    }
}
