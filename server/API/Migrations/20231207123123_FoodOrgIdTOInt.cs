using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class FoodOrgIdTOInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "organization",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    full_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    short_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("organization_pk", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "restaurants",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    address = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    org_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("restaurants_pk", x => x.id);
                    table.ForeignKey(
                        name: "restaurants_organization_id_fk",
                        column: x => x.org_id,
                        principalTable: "organization",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    full_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: true),
                    available = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("employees_pk", x => x.id);
                    table.ForeignKey(
                        name: "employees_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "food",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    is_available = table.Column<bool>(type: "boolean", nullable: false),
                    name = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("food_pk", x => x.id);
                    table.ForeignKey(
                        name: "food_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    table_id = table.Column<int>(type: "integer", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    assigned_employee_id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    payment_type = table.Column<short>(type: "smallint", nullable: true),
                    discount = table.Column<double>(type: "double precision", nullable: true),
                    payment_status = table.Column<short>(type: "smallint", nullable: true),
                    tip = table.Column<double>(type: "double precision", nullable: true),
                    total = table.Column<double>(type: "double precision", nullable: true),
                    payment_method = table.Column<short>(type: "smallint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("clients_pk", x => x.id);
                    table.ForeignKey(
                        name: "clients_employees_id_fk",
                        column: x => x.assigned_employee_id,
                        principalTable: "employees",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "clients_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "tables",
                columns: table => new
                {
                    num = table.Column<int>(type: "integer", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    assigned_employee_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("tables_pk", x => new { x.num, x.restaurant_id });
                    table.ForeignKey(
                        name: "tables_employees_id_fk",
                        column: x => x.assigned_employee_id,
                        principalTable: "employees",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "tables_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "food_queue",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    food_id = table.Column<int>(type: "integer", nullable: false),
                    state = table.Column<short>(type: "smallint", nullable: false),
                    created_at = table.Column<TimeOnly>(type: "time without time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("food_queue_pk", x => x.id);
                    table.ForeignKey(
                        name: "food_queue_clients_id_fk",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "food_queue_food_id_fk",
                        column: x => x.food_id,
                        principalTable: "food",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "food_queue_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_clients_assigned_employee_id",
                table: "clients",
                column: "assigned_employee_id");

            migrationBuilder.CreateIndex(
                name: "IX_clients_restaurant_id",
                table: "clients",
                column: "restaurant_id");

            migrationBuilder.CreateIndex(
                name: "IX_employees_restaurant_id",
                table: "employees",
                column: "restaurant_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_restaurant_id",
                table: "food",
                column: "restaurant_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_queue_client_id",
                table: "food_queue",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_queue_food_id",
                table: "food_queue",
                column: "food_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_queue_restaurant_id",
                table: "food_queue",
                column: "restaurant_id");

            migrationBuilder.CreateIndex(
                name: "IX_restaurants_org_id",
                table: "restaurants",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_tables_assigned_employee_id",
                table: "tables",
                column: "assigned_employee_id");

            migrationBuilder.CreateIndex(
                name: "IX_tables_restaurant_id",
                table: "tables",
                column: "restaurant_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "food_queue");

            migrationBuilder.DropTable(
                name: "tables");

            migrationBuilder.DropTable(
                name: "clients");

            migrationBuilder.DropTable(
                name: "food");

            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "restaurants");

            migrationBuilder.DropTable(
                name: "organization");
        }
    }
}
