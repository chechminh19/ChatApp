# Dockerfile cho SignalR (ASP.NET Core)
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ChatApp.csproj .     
RUN dotnet restore         

COPY . .                  
WORKDIR /src             
RUN dotnet build -c Release -o /app/build "ChatApp.csproj"

# Publish ứng dụng
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish "ChatApp.csproj" /p:UseAppHost=false

# Final image để chạy ứng dụng
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ChatApp.dll"]