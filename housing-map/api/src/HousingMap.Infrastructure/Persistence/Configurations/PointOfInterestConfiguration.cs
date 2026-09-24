using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

internal sealed class PointOfInterestConfiguration : IEntityTypeConfiguration<PointOfInterest>
{
    public void Configure(EntityTypeBuilder<PointOfInterest> builder)
    {
        builder.ConfigureFeature("points_of_interest");
        builder.Property(p => p.Name).HasMaxLength(GisFeatureConfiguration.NameMaxLength);
        builder.Property(p => p.Category).HasConversion<string>().HasMaxLength(32);
        builder.Property(p => p.Geometry).IsSpatial("Point");
        builder.HasIndex(p => p.Geometry).HasMethod("gist");
    }
}
