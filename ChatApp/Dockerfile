# Chạy môi trường ASP.NET 8.0
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Build project bằng SDK 8.0
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ChatApp/ChatApp.csproj", "ChatApp/"]
RUN dotnet restore "ChatApp/ChatApp.csproj"
COPY . .
WORKDIR "/src/ChatApp"
RUN dotnet publish -c Release -o /app

# Chạy ứng dụng
FROM base AS final
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "ChatApp.dll"]
