using Budgenix.Services;
using Budgenix.Services.Dashboard;
using Budgenix.Data;
using Budgenix.Helpers;
using Budgenix.Mapping;
using Budgenix.Models.Users;
using Budgenix.Services.Insights;
using Budgenix.Services.Recurring;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Budgenix.Services.Finance;
using Budgenix.Services.Budgets;
using Budgenix.Services.Goals;
using Budgenix.Services.Admin;
using Budgenix.Infrastructure.Identity;
using Budgenix.Services.Audit;
using Budgenix.Services.User;
using Budgenix.Services.System;
using Budgenix.Services.Email;
using Budgenix.Services.Shared;
using Budgenix.Services.Learning;
using Budgenix.Services.BankStatements.Banks;
using Budgenix.Services.BankStatements.NameSuggester;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Configure logging providers (optional: adjust as needed)
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
// Later: Add Application Insights or Serilog here if you want

// Load config
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile(Path.Combine("Configuration Files", "appsettings.json"), optional: false)
    .AddUserSecrets<Program>()
    .AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<BudgenixDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<RecurringItemService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IRecurringService, RecurringService>();
builder.Services.AddScoped<IInsightService, InsightService>();
builder.Services.AddScoped<IExpenseService, ExpenseService>();
builder.Services.AddScoped<IIncomeService, IncomeService>();
builder.Services.AddScoped<ICashflowService, CashflowService>();
builder.Services.AddScoped<IBudgetService, BudgetService>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<ISystemNotificationsService, SystemNotificationsService>();
builder.Services.AddScoped<ITransactionCorrectionService, TransactionCorrectionService>();
builder.Services.AddScoped<IBankStatementService, BankStatementService>();
builder.Services.AddScoped<Sparebank1BankParser>();
builder.Services.AddScoped<INameSuggesterService, AiNameSuggesterService>();



builder.Services.AddSingleton<ICacheInvalidatorService, CacheInvalidatorService>();


builder.Services.AddInsightRules();
builder.Services.AddTransient<NextOccurrenceResolver>();
builder.Services.AddAutoMapper(typeof(MappingProfile));


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

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { new CultureInfo("en"), new CultureInfo("no") };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

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

builder.Services.AddSingleton<StripeService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddScoped<JwtTokenService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "https://demo.vebjornbaustad.no",
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Localization
var localizationOptions = app.Services.GetService<IOptions<RequestLocalizationOptions>>()?.Value;
app.UseRequestLocalization(localizationOptions!);
app.UseCors("AllowFrontend");

// Seed default data
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<BudgenixDbContext>();
        var scopedLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        
        scopedLogger.LogInformation("Database seeded successfully.");
        
        await IdentitySeeder.SeedRolesAsync(scope.ServiceProvider);
        scopedLogger.LogInformation("Identity roles seeded successfully.");
    }
}
catch (Exception seedingEx)
{
    logger.LogError(seedingEx, "💥 Error during DB or Identity seeding.");
    throw;
}

// HTTP pipeline
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

try
{    
    app.Run();
}
catch (Exception ex)
{
    logger.LogCritical(ex, "💥 Unhandled exception during startup.");
    throw;
}
