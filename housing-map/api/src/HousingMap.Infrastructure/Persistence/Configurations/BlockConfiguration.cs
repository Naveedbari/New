using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

internal sealed class BlockConfiguration : IEntityTypeConfiguration<Block>
{
    public void Configure(EntityTypeBuilder<Block> builder)
    {
        builder.ConfigureFeature("blocks");
        builder.Property(b => b.Code).HasMaxLength(GisFeatureConfiguration.CodeMaxLength);
        builder.Property(b => b.Name).HasMaxLength(GisFeatureConfiguration.NameMaxLength);
        builder.Property(b => b.Geometry).IsSpatial("MultiPolygon");
        builder.HasOne(b => b.Sector).WithMany().HasForeignKey(b => b.SectorId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(b => new { b.DatasetId, b.Code }).IsUnique();
        builder.HasIndex(b => b.Geometry).HasMethod("gist");
    }
}
