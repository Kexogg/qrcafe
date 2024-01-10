using System.Text;
using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QrCafe;


var builder = WebApplication.CreateBuilder(args);
string connection = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Host=kexogg.ru;Port=61433;Database=QR_Cafe;Username=kexogg;Password=3k3s38Ku7MPFgT5MAmbQ8TdwLJ2ZHfxZ2w3VYa7tonkCt9q6nPTYtQEiNhF3y7GTsgYZw2auhwX5UBEXLjSABMtkJX9g6E9funQnHBdREohELQYp8JYuD6cKkh2Yr4zk";

builder.Services.AddDbContext<QrCafeDbContext>(options => options.UseNpgsql(connection));
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = AuthOptions.ISSUER,
            ValidateAudience = true,
            ValidAudience = AuthOptions.AUDIENCE,
            ValidateLifetime = true,
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            ValidateIssuerSigningKey = true
        };
    });
builder.Services.AddSwaggerGen(option =>
{
    option.AddServer(new OpenApiServer
        {
            Url = "/",
            Description = "Local server"
        }
    );
    option.AddServer(new OpenApiServer
        {
            Url = "https://nyashdev.stk8s.66bit.ru",
            Description = "Production server"
        }
    );
    option.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "API.xml"));
    option.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "QR Cafe API",
        Version = "v1",
    });
    option.DescribeAllParametersInCamelCase();
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<QrCafeDbContext>();
    //context.Database.EnsureDeleted();
    context.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public class AuthOptions
{
    public const string ISSUER = "Server"; // издатель токена
    public const string AUDIENCE = "Employee"; // потребитель токена
    const string KEY = "Ashg31jh32gg3jhjhh23bb3bbjj23gg1j3g23gj1g3j1g3g13bj6k79lj3bj23jhj";   // ключ для шифрации
    public static SymmetricSecurityKey GetSymmetricSecurityKey() => 
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}