using ChatApp;
using ChatApp.Hubs;

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
builder.Services.AddSignalR()
    .AddAzureSignalR("Endpoint=https://siuuu.service.signalr.net;AccessKey=49DDe1FVOxoQndSGLADqfUJjAfWEBK10RusvziVevhhRymZc1VLDJQQJ99AKAC3pKaRXJ3w3AAAAASRSHv3C;Version=1.0;");
builder.Services.AddSingleton<IDictionary<string, UserRoomConnect>>(opt => new Dictionary<string, UserRoomConnect>());
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowMyOrigin", builder =>
    {
        builder.WithOrigins("https://chat-app-sandy-ten.vercel.app")
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

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowMyOrigin"); 
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chat");
});

app.MapControllers();

app.Run();
