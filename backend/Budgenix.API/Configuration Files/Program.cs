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

var builder = WebApplication.CreateBuilder(args);


// Load config from environment (e.g. appsettings.Development.json, secrets, Azure settings, etc.)
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("Configuration Files/appsettings.json", optional: false, reloadOnChange: true)

    .AddJsonFile($"Configuration Files/appsettings.{builder.Environment.EnvironmentName}.json", optional: true)

    .AddUserSecrets<Program>() // ✅ Enables user secrets
    .AddEnvironmentVariables();

// Access connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Setup DB context
builder.Services.AddDbContext<BudgenixDbContext>(options =>
    options.UseSqlServer(connectionString));


Console.WriteLine($"🔌 DB: {connectionString}");

// Add services to the container.
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

// Configure Identity options if needed
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
});

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { new CultureInfo("en"), new CultureInfo("no") };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

// Add Authentication
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


builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtTokenService>();

var app = builder.Build();

var localizationOptions = app.Services.GetService<IOptions<RequestLocalizationOptions>>()?.Value;
app.UseRequestLocalization(localizationOptions);

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

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


app.Run();


