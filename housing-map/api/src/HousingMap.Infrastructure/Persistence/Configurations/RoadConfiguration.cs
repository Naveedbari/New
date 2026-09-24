using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

internal sealed class RoadConfiguration : IEntityTypeConfiguration<Road>
{
    public void Configure(EntityTypeBuilder<Road> builder)
    {
        builder.ConfigureFeature("roads");
        builder.Property(r => r.Code).HasMaxLength(GisFeatureConfiguration.CodeMaxLength);
        builder.Property(r => r.Name).HasMaxLength(GisFeatureConfiguration.NameMaxLength);
        builder.Property(r => r.RoadType).HasConversion<string>().HasMaxLength(32);
        builder.Property(r => r.Geometry).IsSpatial("MultiLineString");
        builder.HasIndex(r => new { r.DatasetId, r.Code }).IsUnique();
        builder.HasIndex(r => r.Geometry).HasMethod("gist");
    }
}
