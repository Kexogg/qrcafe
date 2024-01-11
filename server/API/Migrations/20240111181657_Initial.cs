using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace QrCafe.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
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
                name: "categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    separate = table.Column<bool>(type: "boolean", nullable: false),
                    name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    description = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    available = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("categories_pk", x => x.id);
                    table.ForeignKey(
                        name: "categories_restaurants_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    full_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Login = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: true),
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
                name: "extras",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    price = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("extras_pk", x => x.id);
                    table.ForeignKey(
                        name: "extras_restaurants_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "food",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    available = table.Column<bool>(type: "boolean", nullable: false),
                    name = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    weight = table.Column<int>(type: "integer", nullable: false),
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
                name: "food_categories",
                columns: table => new
                {
                    food_id = table.Column<int>(type: "integer", nullable: false),
                    category_id = table.Column<int>(type: "integer", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("food_categories_pk", x => new { x.food_id, x.category_id });
                    table.ForeignKey(
                        name: "food_categories_categories_id_fk",
                        column: x => x.category_id,
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "food_categories_food_id_fk",
                        column: x => x.food_id,
                        principalTable: "food",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "food_categories_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "food_extras",
                columns: table => new
                {
                    food_id = table.Column<int>(type: "integer", nullable: false),
                    extra_id = table.Column<int>(type: "integer", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("food_extras_pk", x => new { x.food_id, x.extra_id });
                    table.ForeignKey(
                        name: "food_extras_extras_id_fk",
                        column: x => x.extra_id,
                        principalTable: "extras",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "food_extras_food_id_fk",
                        column: x => x.food_id,
                        principalTable: "food",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "food_extras_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
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
                    created_at = table.Column<TimeOnly>(type: "time without time zone", nullable: false, defaultValueSql: "now()"),
                    Count = table.Column<int>(type: "integer", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "tables",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: true),
                    assigned_employee_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("tables_pk", x => new { x.id, x.restaurant_id });
                    table.ForeignKey(
                        name: "tables_clients_id_fk",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id");
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
                name: "food_queue_extras",
                columns: table => new
                {
                    food_queue_id = table.Column<Guid>(type: "uuid", nullable: false),
                    extra_id = table.Column<int>(type: "integer", nullable: false),
                    restaurant_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("food_queue_extras_pk", x => new { x.food_queue_id, x.extra_id });
                    table.ForeignKey(
                        name: "food_queue_extras_extras_id_fk",
                        column: x => x.extra_id,
                        principalTable: "extras",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "food_queue_extras_food_queue_id_fk",
                        column: x => x.food_queue_id,
                        principalTable: "food_queue",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "food_queue_extras_restaurants_id_fk",
                        column: x => x.restaurant_id,
                        principalTable: "restaurants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "organization",
                columns: new[] { "id", "full_name", "short_name" },
                values: new object[] { 0, "TestOrg", "testOrg" });

            migrationBuilder.InsertData(
                table: "restaurants",
                columns: new[] { "id", "address", "name", "org_id" },
                values: new object[] { 0, "Home", "TestRest", 0 });

            migrationBuilder.InsertData(
                table: "employees",
                columns: new[] { "id", "available", "full_name", "Login", "Password", "restaurant_id", "role_id" },
                values: new object[] { new Guid("aa249b46-cf7c-4b1e-9ff4-38053ae67677"), true, "admin", "admin", "IGI$arFiH~RXf9k", 0, 0 });

            migrationBuilder.CreateIndex(
                name: "IX_categories_restaurant_id",
                table: "categories",
                column: "restaurant_id");

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
                name: "IX_extras_restaurant_id",
                table: "extras",
                column: "restaurant_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_restaurant_id",
                table: "food",
                column: "restaurant_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_categories_category_id",
                table: "food_categories",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_categories_restaurant_id",
                table: "food_categories",
                column: "restaurant_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_extras_extra_id",
                table: "food_extras",
                column: "extra_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_extras_restaurant_id",
                table: "food_extras",
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
                name: "IX_food_queue_extras_extra_id",
                table: "food_queue_extras",
                column: "extra_id");

            migrationBuilder.CreateIndex(
                name: "IX_food_queue_extras_restaurant_id",
                table: "food_queue_extras",
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
                name: "IX_tables_client_id",
                table: "tables",
                column: "client_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tables_restaurant_id",
                table: "tables",
                column: "restaurant_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "food_categories");

            migrationBuilder.DropTable(
                name: "food_extras");

            migrationBuilder.DropTable(
                name: "food_queue_extras");

            migrationBuilder.DropTable(
                name: "tables");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "extras");

            migrationBuilder.DropTable(
                name: "food_queue");

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
