﻿using ChatApp;
using ChatApp.Hubs;
using Microsoft.Azure.SignalR;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Cors; // Nếu chưa có, thêm dòng này
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
        builder.WithOrigins("https://chat-app-sandy-ten.vercel.app/join-room") //join-room
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

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
app.UseRouting();
app.UseCors("AllowMyOrigin"); 
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("/chat");
});
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000"; // Hoặc "8080" nếu bạn thích
app.Urls.Clear();
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();