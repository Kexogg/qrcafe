using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using QrCafe.Models;

namespace QrCafe;

public partial class QrCafeDbContext : DbContext
{
    public QrCafeDbContext()
    {
        Database.EnsureDeleted();
    }

    public QrCafeDbContext(DbContextOptions<QrCafeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Food> Foods { get; set; }

    public virtual DbSet<FoodQueue> FoodQueues { get; set; }

    public virtual DbSet<Organization> Organizations { get; set; }

    public virtual DbSet<Restaurant> Restaurants { get; set; }

    public virtual DbSet<Table> Tables { get; set; }
    
    public virtual DbSet<FoodCategory> FoodCategories { get; set; }
    
    public virtual DbSet<Category> Categories { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseNpgsql("Host=kexogg.ru;Port=61433;Database=QR_Cafe;Username=kexogg;Password=3k3s38Ku7MPFgT5MAmbQ8TdwLJ2ZHfxZ2w3VYa7tonkCt9q6nPTYtQEiNhF3y7GTsgYZw2auhwX5UBEXLjSABMtkJX9g6E9funQnHBdREohELQYp8JYuD6cKkh2Yr4zk");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("clients_pk");

            entity.ToTable("clients");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.AssignedEmployeeId)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("assigned_employee_id");
            entity.Property(e => e.Discount).HasColumnName("discount");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.PaymentMethod).HasColumnName("payment_method");
            entity.Property(e => e.PaymentStatus).HasColumnName("payment_status");
            entity.Property(e => e.PaymentType).HasColumnName("payment_type");
            entity.Property(e => e.RestaurantId).HasColumnName("restaurant_id");
            entity.Property(e => e.TableId).HasColumnName("table_id");
            entity.Property(e => e.Tip).HasColumnName("tip");
            entity.Property(e => e.Total).HasColumnName("total");

            entity.HasOne(d => d.AssignedEmployee).WithMany(p => p.Clients)
                .HasForeignKey(d => d.AssignedEmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("clients_employees_id_fk");

            entity.HasOne(d => d.Restaurant).WithMany(p => p.Clients)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("clients_restaurants_id_fk");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("employees_pk");

            entity.ToTable("employees");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Available).HasColumnName("available");
            entity.Property(e => e.FullName)
                .HasMaxLength(50)
                .HasColumnName("full_name");
            entity.Property(e => e.RestaurantId).HasColumnName("restaurant_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Restaurant).WithMany(p => p.Employees)
                .HasForeignKey(d => d.RestaurantId)
                .HasConstraintName("employees_restaurants_id_fk");
        });

        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("food_pk");

            entity.ToTable("food");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsAvailable).HasColumnName("is_available");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.RestaurantId).HasColumnName("restaurant_id");
            entity.Property(e => e.Weight).HasColumnName("weight");

            entity.HasOne(d => d.Restaurant).WithMany(p => p.Foods)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_restaurants_id_fk");
        });

        modelBuilder.Entity<FoodQueue>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("food_queue_pk");

            entity.ToTable("food_queue");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.FoodId).HasColumnName("food_id");
            entity.Property(e => e.RestaurantId).HasColumnName("restaurant_id");
            entity.Property(e => e.State).HasColumnName("state");

            entity.HasOne(d => d.Client).WithMany(p => p.FoodQueues)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_queue_clients_id_fk");

            entity.HasOne(d => d.Food).WithMany(p => p.FoodQueues)
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_queue_food_id_fk");

            entity.HasOne(d => d.Restaurant).WithMany(p => p.FoodQueues)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_queue_restaurants_id_fk");
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("organization_pk");

            entity.ToTable("organization");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.FullName)
                .HasMaxLength(50)
                .HasColumnName("full_name");
            entity.Property(e => e.ShortName)
                .HasMaxLength(50)
                .HasColumnName("short_name");
        });

        modelBuilder.Entity<Restaurant>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("restaurants_pk");

            entity.ToTable("restaurants");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(50)
                .HasColumnName("address");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.OrgId).HasColumnName("org_id");

            entity.HasOne(d => d.Org).WithMany(p => p.Restaurants)
                .HasForeignKey(d => d.OrgId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("restaurants_organization_id_fk");
        });

        modelBuilder.Entity<Table>(entity =>
        {
            entity.HasKey(e => new { e.Num, e.RestaurantId }).HasName("tables_pk");

            entity.ToTable("tables");

            entity.Property(e => e.Num).HasColumnName("num");
            entity.Property(e => e.RestaurantId).HasColumnName("restaurant_id");
            entity.Property(e => e.AssignedEmployeeId).HasColumnName("assigned_employee_id");

            entity.HasOne(d => d.AssignedEmployee).WithMany(p => p.Tables)
                .HasForeignKey(d => d.AssignedEmployeeId)
                .HasConstraintName("tables_employees_id_fk");

            entity.HasOne(d => d.Restaurant).WithMany(p => p.Tables)
                .HasForeignKey(d => d.RestaurantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tables_restaurants_id_fk");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("categories_pk");

            entity.ToTable("categories");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(20)
                .HasColumnName("name");
            entity.Property(e => e.Description).HasMaxLength(50)
                .HasColumnName("description");
            entity.Property(e => e.Separate)
                .HasColumnName("separate");
            entity.Property(e => e.RestaurantId)
                .HasColumnName("restaurant_id");
            entity.Property(e => e.Order)
                .HasColumnName("order");

            entity.HasOne(e => e.Restaurant).WithMany(p => p.Categories)
                .HasForeignKey(d => d.RestaurantId)
                .HasConstraintName("categories_restaurants_fk");
        });

        modelBuilder.Entity<FoodCategory>(entity =>
        {
            entity.HasKey(e => new {e.FoodId, e.CategoryId}).HasName("food_categories_pk");
            
            entity.ToTable("food_categories");
            
            entity.Property(e => e.CategoryId)
                .HasColumnName("category_id");
            entity.Property(e => e.FoodId)
                .HasColumnName("food_id");
            entity.Property(e => e.RestaurantId)
                .HasColumnName("restaurant_id");
            
            entity.HasOne(d => d.Food).WithMany(p => p.FoodCategories)
                .HasForeignKey(d => d.FoodId)
                .HasConstraintName("food_categories_food_id_fk");
            
            entity.HasOne(d => d.Category).WithMany(p => p.FoodCategories)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("food_categories_categories_id_fk");
            
            entity.HasOne(d => d.Restaurant).WithMany(p => p.FoodCategories)
                .HasForeignKey(d => d.RestaurantId)
                .HasConstraintName("food_categories_restaurants_id_fk");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
