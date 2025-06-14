using Budgenix.API.Services;
using Budgenix.Data;
using Budgenix.Helpers;
using Budgenix.Mapping;
using Budgenix.Models.Users;
using Budgenix.Services;
using Budgenix.Services.Insights;
using Budgenix.Services.Insights.Rules;
using Budgenix.Services.Recurring;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

try
{
    var path = Path.Combine(Directory.GetCurrentDirectory(), "logs", "early-start.txt");
    Directory.CreateDirectory(Path.GetDirectoryName(path)!);
    File.WriteAllText(path, $"Started at {DateTime.UtcNow:O}");
}
catch (Exception ex)
{
    File.WriteAllText("/home/LogFiles/early-crash.txt", $"Early crash: {ex}");
}


var builder = WebApplication.CreateBuilder(args);

// Load config from environment
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile(Path.Combine("Configuration Files", "appsettings.json"), optional: false)
    .AddJsonFile(Path.Combine("Configuration Files", $"appsettings.{builder.Environment.EnvironmentName}.json"), optional: true)
    .AddUserSecrets<Program>()
    .AddEnvironmentVariables();

// Access connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Setup DB context
builder.Services.AddDbContext<BudgenixDbContext>(options =>
    options.UseSqlServer(connectionString));


// Add services
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<RecurringItemService>();
builder.Services.AddScoped<IInsightService, InsightService>();
builder.Services.AddInsightRules();
builder.Services.AddTransient<NextOccurrenceResolver>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<BudgenixDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
});

// Localization
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { new CultureInfo("en"), new CultureInfo("no") };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

// Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
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

//Stripe
builder.Services.AddSingleton<StripeService>();


builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtTokenService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://demo.vebjornbaustad.no",
                "http://localhost:5173"
            )

            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();

    });
});



var app = builder.Build();

// Localization
var localizationOptions = app.Services.GetService<IOptions<RequestLocalizationOptions>>()?.Value;
app.UseRequestLocalization(localizationOptions);
app.UseCors("AllowFrontend");

// Seed default data
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<BudgenixDbContext>();
        SeedData.Initialize(context);
        Console.WriteLine("✅ Database seeded successfully.");
    }
}
catch (Exception seedingEx)
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<BudgenixDbContext>();
        SeedData.Initialize(context);
        Console.WriteLine("✅ Database seeded successfully.");
    }

    var logPath = Path.Combine(Directory.GetCurrentDirectory(), "startup-seeding-error.log");
    File.WriteAllText(logPath, seedingEx.ToString());
    Console.WriteLine("💥 Error during DB seeding.");
    throw;
}

// HTTP pipeline

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

try
{
    Console.WriteLine("🚀 Starting Budgenix.API...");


    app.Run();
}
catch (Exception ex)
{
    var logPath = Path.Combine(Directory.GetCurrentDirectory(), "logs", "startup-error.txt");
    Directory.CreateDirectory(Path.GetDirectoryName(logPath)!);
    File.WriteAllText(logPath, ex.ToString());
    Console.WriteLine("💥 Startup exception: " + ex.Message);
    throw;
}
