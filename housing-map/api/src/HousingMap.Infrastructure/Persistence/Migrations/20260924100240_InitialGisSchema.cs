using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace HousingMap.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialGisSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.CreateTable(
                name: "gis_datasets",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    version = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    crs = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    is_development_data = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    published_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_gis_datasets", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "points_of_interest",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    category = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    geometry = table.Column<Point>(type: "geometry(Point,4326)", nullable: false),
                    dataset_id = table.Column<Guid>(type: "uuid", nullable: false),
                    source_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_points_of_interest", x => x.id);
                    table.ForeignKey(
                        name: "fk_points_of_interest_gis_datasets_dataset_id",
                        column: x => x.dataset_id,
                        principalTable: "gis_datasets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "roads",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    code = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    road_type = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    geometry = table.Column<MultiLineString>(type: "geometry(MultiLineString,4326)", nullable: false),
                    dataset_id = table.Column<Guid>(type: "uuid", nullable: false),
                    source_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_roads", x => x.id);
                    table.ForeignKey(
                        name: "fk_roads_gis_datasets_dataset_id",
                        column: x => x.dataset_id,
                        principalTable: "gis_datasets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sectors",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    code = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    geometry = table.Column<MultiPolygon>(type: "geometry(MultiPolygon,4326)", nullable: false),
                    dataset_id = table.Column<Guid>(type: "uuid", nullable: false),
                    source_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sectors", x => x.id);
                    table.ForeignKey(
                        name: "fk_sectors_gis_datasets_dataset_id",
                        column: x => x.dataset_id,
                        principalTable: "gis_datasets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "blocks",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    sector_id = table.Column<Guid>(type: "uuid", nullable: false),
                    code = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    geometry = table.Column<MultiPolygon>(type: "geometry(MultiPolygon,4326)", nullable: false),
                    dataset_id = table.Column<Guid>(type: "uuid", nullable: false),
                    source_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_blocks", x => x.id);
                    table.ForeignKey(
                        name: "fk_blocks_gis_datasets_dataset_id",
                        column: x => x.dataset_id,
                        principalTable: "gis_datasets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_blocks_sectors_sector_id",
                        column: x => x.sector_id,
                        principalTable: "sectors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "streets",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    block_id = table.Column<Guid>(type: "uuid", nullable: false),
                    code = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    geometry = table.Column<MultiLineString>(type: "geometry(MultiLineString,4326)", nullable: false),
                    dataset_id = table.Column<Guid>(type: "uuid", nullable: false),
                    source_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_streets", x => x.id);
                    table.ForeignKey(
                        name: "fk_streets_blocks_block_id",
                        column: x => x.block_id,
                        principalTable: "blocks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_streets_gis_datasets_dataset_id",
                        column: x => x.dataset_id,
                        principalTable: "gis_datasets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "plots",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    plot_number = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    sector_id = table.Column<Guid>(type: "uuid", nullable: false),
                    block_id = table.Column<Guid>(type: "uuid", nullable: true),
                    street_id = table.Column<Guid>(type: "uuid", nullable: true),
                    road_id = table.Column<Guid>(type: "uuid", nullable: true),
                    plot_type = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    area_square_metres = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    dimensions = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    authority_reference = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    geometry = table.Column<MultiPolygon>(type: "geometry(MultiPolygon,4326)", nullable: false),
                    center_point = table.Column<Point>(type: "geometry(Point,4326)", nullable: false),
                    dataset_id = table.Column<Guid>(type: "uuid", nullable: false),
                    source_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_plots", x => x.id);
                    table.ForeignKey(
                        name: "fk_plots_blocks_block_id",
                        column: x => x.block_id,
                        principalTable: "blocks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_plots_gis_datasets_dataset_id",
                        column: x => x.dataset_id,
                        principalTable: "gis_datasets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_plots_roads_road_id",
                        column: x => x.road_id,
                        principalTable: "roads",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_plots_sectors_sector_id",
                        column: x => x.sector_id,
                        principalTable: "sectors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_plots_streets_street_id",
                        column: x => x.street_id,
                        principalTable: "streets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_blocks_dataset_id_code",
                table: "blocks",
                columns: new[] { "dataset_id", "code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_blocks_dataset_id_source_id",
                table: "blocks",
                columns: new[] { "dataset_id", "source_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_blocks_geometry",
                table: "blocks",
                column: "geometry")
                .Annotation("Npgsql:IndexMethod", "gist");

            migrationBuilder.CreateIndex(
                name: "ix_blocks_sector_id",
                table: "blocks",
                column: "sector_id");

            migrationBuilder.CreateIndex(
                name: "ix_gis_datasets_is_active",
                table: "gis_datasets",
                column: "is_active",
                unique: true,
                filter: "is_active");

            migrationBuilder.CreateIndex(
                name: "ix_gis_datasets_version",
                table: "gis_datasets",
                column: "version",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_plots_block_id",
                table: "plots",
                column: "block_id");

            migrationBuilder.CreateIndex(
                name: "ix_plots_dataset_id_sector_id_plot_number",
                table: "plots",
                columns: new[] { "dataset_id", "sector_id", "plot_number" });

            migrationBuilder.CreateIndex(
                name: "ix_plots_dataset_id_source_id",
                table: "plots",
                columns: new[] { "dataset_id", "source_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_plots_geometry",
                table: "plots",
                column: "geometry")
                .Annotation("Npgsql:IndexMethod", "gist");

            migrationBuilder.CreateIndex(
                name: "ix_plots_road_id",
                table: "plots",
                column: "road_id");

            migrationBuilder.CreateIndex(
                name: "ix_plots_sector_id",
                table: "plots",
                column: "sector_id");

            migrationBuilder.CreateIndex(
                name: "ix_plots_street_id",
                table: "plots",
                column: "street_id");

            migrationBuilder.CreateIndex(
                name: "ix_points_of_interest_dataset_id_source_id",
                table: "points_of_interest",
                columns: new[] { "dataset_id", "source_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_points_of_interest_geometry",
                table: "points_of_interest",
                column: "geometry")
                .Annotation("Npgsql:IndexMethod", "gist");

            migrationBuilder.CreateIndex(
                name: "ix_roads_dataset_id_code",
                table: "roads",
                columns: new[] { "dataset_id", "code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_roads_dataset_id_source_id",
                table: "roads",
                columns: new[] { "dataset_id", "source_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_roads_geometry",
                table: "roads",
                column: "geometry")
                .Annotation("Npgsql:IndexMethod", "gist");

            migrationBuilder.CreateIndex(
                name: "ix_sectors_dataset_id_code",
                table: "sectors",
                columns: new[] { "dataset_id", "code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_sectors_dataset_id_source_id",
                table: "sectors",
                columns: new[] { "dataset_id", "source_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_sectors_geometry",
                table: "sectors",
                column: "geometry")
                .Annotation("Npgsql:IndexMethod", "gist");

            migrationBuilder.CreateIndex(
                name: "ix_streets_block_id",
                table: "streets",
                column: "block_id");

            migrationBuilder.CreateIndex(
                name: "ix_streets_dataset_id_code",
                table: "streets",
                columns: new[] { "dataset_id", "code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_streets_dataset_id_source_id",
                table: "streets",
                columns: new[] { "dataset_id", "source_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_streets_geometry",
                table: "streets",
                column: "geometry")
                .Annotation("Npgsql:IndexMethod", "gist");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "plots");

            migrationBuilder.DropTable(
                name: "points_of_interest");

            migrationBuilder.DropTable(
                name: "roads");

            migrationBuilder.DropTable(
                name: "streets");

            migrationBuilder.DropTable(
                name: "blocks");

            migrationBuilder.DropTable(
                name: "sectors");

            migrationBuilder.DropTable(
                name: "gis_datasets");
        }
    }
}
