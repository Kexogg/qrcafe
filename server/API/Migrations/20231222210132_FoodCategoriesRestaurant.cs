using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class FoodCategoriesRestaurant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "restaurant_id",
                table: "food_categories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_food_categories_restaurant_id",
                table: "food_categories",
                column: "restaurant_id");

            migrationBuilder.AddForeignKey(
                name: "food_categories_restaurants_id_fk",
                table: "food_categories",
                column: "restaurant_id",
                principalTable: "restaurants",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "food_categories_restaurants_id_fk",
                table: "food_categories");

            migrationBuilder.DropIndex(
                name: "IX_food_categories_restaurant_id",
                table: "food_categories");

            migrationBuilder.DropColumn(
                name: "restaurant_id",
                table: "food_categories");
        }
    }
}
