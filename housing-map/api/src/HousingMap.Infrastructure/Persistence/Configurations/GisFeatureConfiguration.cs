using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

/// <summary>Mapping shared by every feature table: dataset ownership and source-id uniqueness.</summary>
internal static class GisFeatureConfiguration
{
    public const int CodeMaxLength = 64;
    public const int NameMaxLength = 256;

    public static void ConfigureFeature<TFeature>(this EntityTypeBuilder<TFeature> builder, string tableName)
        where TFeature : GisFeature
    {
        builder.ToTable(tableName);
        builder.Property(f => f.SourceId).HasMaxLength(128);
        builder.HasOne(f => f.Dataset).WithMany().HasForeignKey(f => f.DatasetId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(f => new { f.DatasetId, f.SourceId }).IsUnique();
    }

    public static PropertyBuilder<TGeometry> IsSpatial<TGeometry>(this PropertyBuilder<TGeometry> property, string postgisType)
    {
        return property.HasColumnType($"geometry({postgisType},{SpatialReference.Wgs84Srid})");
    }
}
