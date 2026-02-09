using GemaGestor.Data;
using GemaGestor.Models.Users;
using GemaGestor.Services;
using GemaGestor.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<WhitelabelContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("WhitelabelContext") ?? throw new InvalidOperationException("Connection string 'WhitelabelContext' not found.")));

// Add services to the container.

builder.Services.AddCors(options => {
    options.AddPolicy(name: "FullCors",
        policy => {
            policy.AllowAnyOrigin();
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
        }
    );
});

builder.Services.AddIdentity<User, Role>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;

    options.SignIn.RequireConfirmedPhoneNumber = false;
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedAccount = false;
})
    .AddEntityFrameworkStores<WhitelabelContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<JWTConfiguration>(builder.Configuration.GetSection("JwtConfig"));
builder.Services.Configure<OTPConfiguration>(builder.Configuration.GetSection("OtpConfig"));

builder.Services.AddScoped<JWTService>();
builder.Services.AddScoped<OTPService>();

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.EnableAnnotations();
});

builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(jwtOptions => {
        jwtOptions.TokenValidationParameters = new TokenValidationParameters {
            //ValidateIssuer = true,
            //ValidateAudience = true,
            //ValidateIssuerSigningKey = true,
            ValidAudience = builder.Configuration["JwtConfig:Audience"],
            ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:SecretKey"] ?? throw new InvalidOperationException("JWT Secret not configured."))),
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if(app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseCors("FullCors");

IdentitySeeder.SeedRolesAndAdminAsync(app.Services.CreateScope().ServiceProvider.GetRequiredService<RoleManager<Role>>(), app.Services.CreateScope().ServiceProvider.GetRequiredService<UserManager<User>>()).Wait();

app.Run();
