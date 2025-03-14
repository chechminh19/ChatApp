# Giai đoạn 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . . 
RUN dotnet publish ChatApp/ChatApp.csproj -c Release -o out

# Giai đoạn 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# **EXPOSE cổng để Render tự động nhận diện**
EXPOSE 10000

ENTRYPOINT ["dotnet", "ChatApp.dll"]
