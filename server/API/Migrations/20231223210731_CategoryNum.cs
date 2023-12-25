using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class CategoryNum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Weight",
                table: "food",
                newName: "weight");

            migrationBuilder.AddColumn<int>(
                name: "num",
                table: "categories",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "num",
                table: "categories");

            migrationBuilder.RenameColumn(
                name: "weight",
                table: "food",
                newName: "Weight");
        }
    }
}
