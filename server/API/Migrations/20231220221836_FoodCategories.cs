using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class FoodCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_categories_restaurants_RestaurantId1",
                table: "categories");

            migrationBuilder.DropIndex(
                name: "IX_categories_RestaurantId1",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "RestaurantId1",
                table: "categories");

            migrationBuilder.AddColumn<int>(
                name: "restaurant_id",
                table: "categories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_categories_restaurant_id",
                table: "categories",
                column: "restaurant_id");

            migrationBuilder.AddForeignKey(
                name: "categories_restaurants_fk",
                table: "categories",
                column: "restaurant_id",
                principalTable: "restaurants",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "categories_restaurants_fk",
                table: "categories");

            migrationBuilder.DropIndex(
                name: "IX_categories_restaurant_id",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "restaurant_id",
                table: "categories");

            migrationBuilder.AddColumn<int>(
                name: "RestaurantId1",
                table: "categories",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_categories_RestaurantId1",
                table: "categories",
                column: "RestaurantId1");

            migrationBuilder.AddForeignKey(
                name: "FK_categories_restaurants_RestaurantId1",
                table: "categories",
                column: "RestaurantId1",
                principalTable: "restaurants",
                principalColumn: "id");
        }
    }
}
