using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class EmployeeAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Login",
                table: "employees",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "employees",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Login",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "employees");
        }
    }
}
