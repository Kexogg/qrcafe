﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using QrCafe;

#nullable disable

namespace QrCafe.Migrations
{
    [DbContext(typeof(QrCafeDbContext))]
    partial class QrCafeDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("QrCafe.Models.Category", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("description");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)")
                        .HasColumnName("name");

                    b.Property<int>("Order")
                        .HasColumnType("integer")
                        .HasColumnName("order");

                    b.Property<int>("RestaurantId")
                        .HasColumnType("integer")
                        .HasColumnName("restaurant_id");

                    b.Property<bool>("Separate")
                        .HasColumnType("boolean")
                        .HasColumnName("separate");

                    b.HasKey("Id")
                        .HasName("categories_pk");

                    b.HasIndex("RestaurantId");

                    b.ToTable("categories", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.Client", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<Guid>("AssignedEmployeeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("assigned_employee_id")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<double?>("Discount")
                        .HasColumnType("double precision")
                        .HasColumnName("discount");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean")
                        .HasColumnName("is_active");

                    b.Property<string>("Name")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("name");

                    b.Property<short?>("PaymentMethod")
                        .HasColumnType("smallint")
                        .HasColumnName("payment_method");

                    b.Property<short?>("PaymentStatus")
                        .HasColumnType("smallint")
                        .HasColumnName("payment_status");

                    b.Property<short?>("PaymentType")
                        .HasColumnType("smallint")
                        .HasColumnName("payment_type");

                    b.Property<int>("RestaurantId")
                        .HasColumnType("integer")
                        .HasColumnName("restaurant_id");

                    b.Property<int>("TableId")
                        .HasColumnType("integer")
                        .HasColumnName("table_id");

                    b.Property<double?>("Tip")
                        .HasColumnType("double precision")
                        .HasColumnName("tip");

                    b.Property<double?>("Total")
                        .HasColumnType("double precision")
                        .HasColumnName("total");

                    b.HasKey("Id")
                        .HasName("clients_pk");

                    b.HasIndex("AssignedEmployeeId");

                    b.HasIndex("RestaurantId");

                    b.ToTable("clients", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.Employee", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<bool>("Available")
                        .HasColumnType("boolean")
                        .HasColumnName("available");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("full_name");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("RestaurantId")
                        .HasColumnType("integer")
                        .HasColumnName("restaurant_id");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer")
                        .HasColumnName("role_id");

                    b.HasKey("Id")
                        .HasName("employees_pk");

                    b.HasIndex("RestaurantId");

                    b.ToTable("employees", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.Food", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("boolean")
                        .HasColumnName("is_available");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("character varying(30)")
                        .HasColumnName("name");

                    b.Property<int>("Price")
                        .HasColumnType("integer")
                        .HasColumnName("price");

                    b.Property<int>("RestaurantId")
                        .HasColumnType("integer")
                        .HasColumnName("restaurant_id");

                    b.Property<int>("Weight")
                        .HasColumnType("integer")
                        .HasColumnName("weight");

                    b.HasKey("Id")
                        .HasName("food_pk");

                    b.HasIndex("RestaurantId");

                    b.ToTable("food", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.FoodCategory", b =>
                {
                    b.Property<int>("FoodId")
                        .HasColumnType("integer")
                        .HasColumnName("food_id");

                    b.Property<int>("CategoryId")
                        .HasColumnType("integer")
                        .HasColumnName("category_id");

                    b.Property<int>("RestaurantId")
                        .HasColumnType("integer")
                        .HasColumnName("restaurant_id");

                    b.HasKey("FoodId", "CategoryId")
                        .HasName("food_categories_pk");

                    b.HasIndex("CategoryId");

                    b.HasIndex("RestaurantId");

                    b.ToTable("food_categories", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.FoodQueue", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<Guid>("ClientId")
                        .HasColumnType("uuid")
                        .HasColumnName("client_id");

                    b.Property<TimeOnly>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("time without time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("now()");

                    b.Property<int>("FoodId")
                        .HasColumnType("integer")
                        .HasColumnName("food_id");

                    b.Property<int>("RestaurantId")
                        .HasColumnType("integer")
                        .HasColumnName("restaurant_id");

                    b.Property<short>("State")
                        .HasColumnType("smallint")
                        .HasColumnName("state");

                    b.HasKey("Id")
                        .HasName("food_queue_pk");

                    b.HasIndex("ClientId");

                    b.HasIndex("FoodId");

                    b.HasIndex("RestaurantId");

                    b.ToTable("food_queue", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.Organization", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("full_name");

                    b.Property<string>("ShortName")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("short_name");

                    b.HasKey("Id")
                        .HasName("organization_pk");

                    b.ToTable("organization", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.Restaurant", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("address");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("character varying(30)")
                        .HasColumnName("name");

                    b.Property<int>("OrgId")
                        .HasColumnType("integer")
                        .HasColumnName("org_id");

                    b.HasKey("Id")
                        .HasName("restaurants_pk");

                    b.HasIndex("OrgId");

                    b.ToTable("restaurants", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.Table", b =>
                {
                    b.Property<int>("Num")
                        .HasColumnType("integer")
                        .HasColumnName("num");

                    b.Property<int>("RestaurantId")
                        .HasColumnType("integer")
                        .HasColumnName("restaurant_id");

                    b.Property<Guid?>("AssignedEmployeeId")
                        .HasColumnType("uuid")
                        .HasColumnName("assigned_employee_id");

                    b.HasKey("Num", "RestaurantId")
                        .HasName("tables_pk");

                    b.HasIndex("AssignedEmployeeId");

                    b.HasIndex("RestaurantId");

                    b.ToTable("tables", (string)null);
                });

            modelBuilder.Entity("QrCafe.Models.Category", b =>
                {
                    b.HasOne("QrCafe.Models.Restaurant", "Restaurant")
                        .WithMany("Categories")
                        .HasForeignKey("RestaurantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("categories_restaurants_fk");

                    b.Navigation("Restaurant");
                });

            modelBuilder.Entity("QrCafe.Models.Client", b =>
                {
                    b.HasOne("QrCafe.Models.Employee", "AssignedEmployee")
                        .WithMany("Clients")
                        .HasForeignKey("AssignedEmployeeId")
                        .IsRequired()
                        .HasConstraintName("clients_employees_id_fk");

                    b.HasOne("QrCafe.Models.Restaurant", "Restaurant")
                        .WithMany("Clients")
                        .HasForeignKey("RestaurantId")
                        .IsRequired()
                        .HasConstraintName("clients_restaurants_id_fk");

                    b.Navigation("AssignedEmployee");

                    b.Navigation("Restaurant");
                });

            modelBuilder.Entity("QrCafe.Models.Employee", b =>
                {
                    b.HasOne("QrCafe.Models.Restaurant", "Restaurant")
                        .WithMany("Employees")
                        .HasForeignKey("RestaurantId")
                        .HasConstraintName("employees_restaurants_id_fk");

                    b.Navigation("Restaurant");
                });

            modelBuilder.Entity("QrCafe.Models.Food", b =>
                {
                    b.HasOne("QrCafe.Models.Restaurant", "Restaurant")
                        .WithMany("Foods")
                        .HasForeignKey("RestaurantId")
                        .IsRequired()
                        .HasConstraintName("food_restaurants_id_fk");

                    b.Navigation("Restaurant");
                });

            modelBuilder.Entity("QrCafe.Models.FoodCategory", b =>
                {
                    b.HasOne("QrCafe.Models.Category", "Category")
                        .WithMany("FoodCategories")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("food_categories_categories_id_fk");

                    b.HasOne("QrCafe.Models.Food", "Food")
                        .WithMany("FoodCategories")
                        .HasForeignKey("FoodId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("food_categories_food_id_fk");

                    b.HasOne("QrCafe.Models.Restaurant", "Restaurant")
                        .WithMany("FoodCategories")
                        .HasForeignKey("RestaurantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("food_categories_restaurants_id_fk");

                    b.Navigation("Category");

                    b.Navigation("Food");

                    b.Navigation("Restaurant");
                });

            modelBuilder.Entity("QrCafe.Models.FoodQueue", b =>
                {
                    b.HasOne("QrCafe.Models.Client", "Client")
                        .WithMany("FoodQueues")
                        .HasForeignKey("ClientId")
                        .IsRequired()
                        .HasConstraintName("food_queue_clients_id_fk");

                    b.HasOne("QrCafe.Models.Food", "Food")
                        .WithMany("FoodQueues")
                        .HasForeignKey("FoodId")
                        .IsRequired()
                        .HasConstraintName("food_queue_food_id_fk");

                    b.HasOne("QrCafe.Models.Restaurant", "Restaurant")
                        .WithMany("FoodQueues")
                        .HasForeignKey("RestaurantId")
                        .IsRequired()
                        .HasConstraintName("food_queue_restaurants_id_fk");

                    b.Navigation("Client");

                    b.Navigation("Food");

                    b.Navigation("Restaurant");
                });

            modelBuilder.Entity("QrCafe.Models.Restaurant", b =>
                {
                    b.HasOne("QrCafe.Models.Organization", "Org")
                        .WithMany("Restaurants")
                        .HasForeignKey("OrgId")
                        .IsRequired()
                        .HasConstraintName("restaurants_organization_id_fk");

                    b.Navigation("Org");
                });

            modelBuilder.Entity("QrCafe.Models.Table", b =>
                {
                    b.HasOne("QrCafe.Models.Employee", "AssignedEmployee")
                        .WithMany("Tables")
                        .HasForeignKey("AssignedEmployeeId")
                        .HasConstraintName("tables_employees_id_fk");

                    b.HasOne("QrCafe.Models.Restaurant", "Restaurant")
                        .WithMany("Tables")
                        .HasForeignKey("RestaurantId")
                        .IsRequired()
                        .HasConstraintName("tables_restaurants_id_fk");

                    b.Navigation("AssignedEmployee");

                    b.Navigation("Restaurant");
                });

            modelBuilder.Entity("QrCafe.Models.Category", b =>
                {
                    b.Navigation("FoodCategories");
                });

            modelBuilder.Entity("QrCafe.Models.Client", b =>
                {
                    b.Navigation("FoodQueues");
                });

            modelBuilder.Entity("QrCafe.Models.Employee", b =>
                {
                    b.Navigation("Clients");

                    b.Navigation("Tables");
                });

            modelBuilder.Entity("QrCafe.Models.Food", b =>
                {
                    b.Navigation("FoodCategories");

                    b.Navigation("FoodQueues");
                });

            modelBuilder.Entity("QrCafe.Models.Organization", b =>
                {
                    b.Navigation("Restaurants");
                });

            modelBuilder.Entity("QrCafe.Models.Restaurant", b =>
                {
                    b.Navigation("Categories");

                    b.Navigation("Clients");

                    b.Navigation("Employees");

                    b.Navigation("FoodCategories");

                    b.Navigation("FoodQueues");

                    b.Navigation("Foods");

                    b.Navigation("Tables");
                });
#pragma warning restore 612, 618
        }
    }
}
