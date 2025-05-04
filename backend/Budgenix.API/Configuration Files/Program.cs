using Budgenix.Data;
using Budgenix.Helpers;
using Budgenix.Mapping;
using Budgenix.Models.Users;
using Budgenix.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Manually load appsettings.json from Configuration Files folder
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("Configuration Files/appsettings.json", optional: false, reloadOnChange: true);

Console.WriteLine("Connection String (Forced Load): " + builder.Configuration.GetConnectionString("DefaultConnection"));



// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddAutoMapper(typeof(MappingProfile));
// Add DbContext
builder.Services.AddDbContext<BudgenixDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<BudgenixDbContext>()
    .AddDefaultTokenProviders();

// Configure Identity options if needed
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
});

// Add Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("authToken"))
            {
                context.Token = context.Request.Cookies["authToken"];
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddScoped<JwtTokenService>();

var app = builder.Build();
// Seed DB with default categories
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BudgenixDbContext>();
    SeedData.Initialize(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthentication();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


app.Run();


