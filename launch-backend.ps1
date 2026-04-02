# Script để khởi chạy Backend Microservices (Java Spring Boot)

Write-Host "--- Đang khởi động hệ thống Microservices bằng Java Spring Boot ---" -ForegroundColor Cyan

# Kiểm tra sự tồn tại của Java
try {
    $javaVersion = & java -version 2>&1
    Write-Host "Đã tìm thấy Java: $javaVersion" -ForegroundColor Gray
} catch {
    Write-Host "LỖI: Không tìm thấy Java. Bạn vui lòng cài đặt JDK 17 trước khi chạy script này." -ForegroundColor Red
    exit
}

$MVN_PATH = "C:\apache-maven-3.6.0\bin\mvn.cmd"

# 1. Khởi chạy Discovery Server (Eureka) - Cần chạy trước tiên
Write-Host "`n1. Đang khởi chạy Discovery Server (Port 8761)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/infrastructure/discovery-server; & '$MVN_PATH' spring-boot:run"

# Đợi Discovery Server khởi động trong 15 giây
Write-Host "Đang đợi Discovery Server ổn định (15 giây)..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# 2. Khởi chạy Hotel Service (Port 8081)
Write-Host "2. Đang khởi chạy Hotel Service (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/services/hotel-service; & '$MVN_PATH' spring-boot:run"

# 3. Khởi chạy Auth Service (Port 8080)
Write-Host "3. Đang khởi chạy Auth Service (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/services/auth-service; & '$MVN_PATH' spring-boot:run"

Write-Host "`n--- Hệ thống Java đang được khởi chạy trong cửa sổ mới! ---" -ForegroundColor Green
Write-Host "Discovery Server (Dashboard): http://localhost:8761"
Write-Host "Hotel Service API: http://localhost:8081/api/v1/hotels"
Write-Host "Auth Service API: http://localhost:8080/api/v1/auth"
