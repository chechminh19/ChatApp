﻿using ChatApp;
using ChatApp.Hubs;
using Microsoft.Azure.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Tùy chọn cho Swagger xuất
    c.SwaggerDoc("v1", new() { Title = "Chat App API", Version = "v1" });
});
builder.Services.AddSignalR();
    
builder.Services.AddSingleton<IDictionary<string, UserRoomConnect>>(opt => new Dictionary<string, UserRoomConnect>());
builder.Logging.AddConsole().SetMinimumLevel(LogLevel.Debug);

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowMyOrigin", builder =>
    {
        //builder.WithOrigins("http://localhost:4200")
        builder.WithOrigins("https://chat-app-sandy-ten.vercel.app/join-room")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
var port = Environment.GetEnvironmentVariable("PORT") ?? "10000"; // Render yêu cầu PORT từ ENV

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Kích hoạt Swagger trong môi trường phát triển
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Chat App API V1"); // Kết nối với endpoint Swagger
        c.RoutePrefix = string.Empty; // Thiết lập Swagger UI xuất hiện tại root
    });
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowMyOrigin"); 
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chat");
});
// Lắng nghe trên tất cả địa chỉ IP (`0.0.0.0`)
app.Run($"http://0.0.0.0:{port}");
app.MapControllers();

app.Run();
