using HousingMap.Domain.Gis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HousingMap.Infrastructure.Persistence.Configurations;

internal sealed class PlotConfiguration : IEntityTypeConfiguration<Plot>
{
    public void Configure(EntityTypeBuilder<Plot> builder)
    {
        builder.ConfigureFeature("plots");
        builder.Property(p => p.PlotNumber).HasMaxLength(32);
        builder.Property(p => p.PlotType).HasConversion<string>().HasMaxLength(32);
        builder.Property(p => p.Status).HasConversion<string>().HasMaxLength(32);
        builder.Property(p => p.AreaSquareMetres).HasPrecision(12, 2);
        builder.Property(p => p.Dimensions).HasMaxLength(64);
        builder.Property(p => p.AuthorityReference).HasMaxLength(128);
        builder.Property(p => p.Geometry).IsSpatial("MultiPolygon");
        builder.Property(p => p.CenterPoint).IsSpatial("Point");

        builder.HasOne(p => p.Sector).WithMany().HasForeignKey(p => p.SectorId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(p => p.Block).WithMany().HasForeignKey(p => p.BlockId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(p => p.Street).WithMany().HasForeignKey(p => p.StreetId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(p => p.Road).WithMany().HasForeignKey(p => p.RoadId).OnDelete(DeleteBehavior.Restrict);

        // Not unique: real authority data may repeat plot numbers; imports validate that instead.
        builder.HasIndex(p => new { p.DatasetId, p.SectorId, p.PlotNumber });
        builder.HasIndex(p => p.Geometry).HasMethod("gist");
    }
}
