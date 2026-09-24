using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

internal sealed class StreetConfiguration : IEntityTypeConfiguration<Street>
{
    public void Configure(EntityTypeBuilder<Street> builder)
    {
        builder.ConfigureFeature("streets");
        builder.Property(s => s.Code).HasMaxLength(GisFeatureConfiguration.CodeMaxLength);
        builder.Property(s => s.Name).HasMaxLength(GisFeatureConfiguration.NameMaxLength);
        builder.Property(s => s.Geometry).IsSpatial("MultiLineString");
        builder.HasOne(s => s.Block).WithMany().HasForeignKey(s => s.BlockId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(s => new { s.DatasetId, s.Code }).IsUnique();
        builder.HasIndex(s => s.Geometry).HasMethod("gist");
    }
}
