using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class CategoryOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "num",
                table: "categories",
                newName: "order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "order",
                table: "categories",
                newName: "num");
        }
    }
}
