using SignalRStocksBackend.Entities;
using SignalRStocksBackend.Hubs;
using SignalRStocksBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<StockTickerService>();
builder.Services.AddSingleton<StockContext>();
builder.Services.AddSingleton<StockHub>();
builder.Services.AddSignalR();
builder.Services.AddMvc(options => options.EnableEndpointRouting = false);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x.SetIsOriginAllowed(_ => true).AllowAnyMethod().AllowAnyHeader().AllowCredentials());

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints => endpoints.MapHub<StockHub>("/stock"));

app.MapControllers();

app.Run();
