using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "KC-POC-API", Version = "v1" });

    // Define el esquema OAuth2 para OpenID Connect
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri("http://localhost:8080/realms/POC/protocol/openid-connect/auth"),
                TokenUrl = new Uri("http://localhost:8080/realms/POC/protocol/openid-connect/token"),
                Scopes = new Dictionary<string, string>
                {
                    // { "openid", "OpenID" },
                    // { "profile", "Profile" },
                    // { "email", "Email" },
                    { "KOC-POC-API", "Access to POC API" }
                }
            }
        }
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "oauth2" }
            },
            new[] { "KOC-POC-API" }
        }
    });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "http://localhost:8080/realms/POC"; 
        options.Audience = "account"; 
        options.RequireHttpsMetadata = false; 
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("KocPocScope", policy =>
    {
        policy.RequireAssertion(context =>
        {
            var scopeClaim = context.User.FindFirst("scope")?.Value;
            return scopeClaim != null && scopeClaim.Split(' ').Contains("KOC-POC-API");
        });
    });
});
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new AuthorizeFilter("KocPocScope"));
});




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "KC-POC-API v1");

        c.OAuthClientId("swagger-ui");
        c.OAuthUsePkce(); 
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();