# Giai đoạn 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN dotnet publish ChatApp/ChatApp.csproj -c Release -o out

# Giai đoạn 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Cho phép đọc PORT từ ENV khi chạy container
ENV PORT=10000
EXPOSE 10000

# Chạy app với PORT từ ENV
CMD ["sh", "-c", "dotnet ChatApp.dll --urls http://0.0.0.0:$PORT"]
