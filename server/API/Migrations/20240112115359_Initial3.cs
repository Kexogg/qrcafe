using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class Initial3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "food_queue_clients_id_fk",
                table: "food_queue");

            migrationBuilder.RenameColumn(
                name: "role_id",
                table: "employees",
                newName: "role");

            migrationBuilder.AddForeignKey(
                name: "food_queue_clients_id_fk",
                table: "food_queue",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "food_queue_clients_id_fk",
                table: "food_queue");

            migrationBuilder.RenameColumn(
                name: "role",
                table: "employees",
                newName: "role_id");

            migrationBuilder.AddForeignKey(
                name: "food_queue_clients_id_fk",
                table: "food_queue",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id");
        }
    }
}
