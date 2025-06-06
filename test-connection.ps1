# Test de connexion Backend-Frontend Hypertube
Write-Host "=== Test de connexion Backend-Frontend Hypertube ===" -ForegroundColor Green

# 1. Test de l'API Gateway
Write-Host "`n1. Test de l'API Gateway..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API Gateway OK (Port 8080)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ API Gateway non accessible (Port 8080)" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Test du Service d'Auth
Write-Host "`n2. Test du Service d'Authentification..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Auth Service OK (Port 8081)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Auth Service non accessible (Port 8081)" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test du Service Vidéo
Write-Host "`n3. Test du Service Vidéo..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8082/actuator/health" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Video Service OK (Port 8082)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Video Service non accessible (Port 8082)" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test du Frontend
Write-Host "`n4. Test du Frontend Angular..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend OK (Port 4200)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend non accessible (Port 4200)" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test de la base de données
Write-Host "`n5. Test de la base de données PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "hypertubepassword"
    $result = psql -h localhost -p 5432 -U hypertube -d hypertube -c "SELECT 1;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL OK (Port 5432)" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL non accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ PostgreSQL non accessible ou psql non installé" -ForegroundColor Red
}

# 6. Test de Redis
Write-Host "`n6. Test de Redis..." -ForegroundColor Yellow
try {
    $response = Test-NetConnection -ComputerName localhost -Port 6379 -InformationLevel Quiet
    if ($response) {
        Write-Host "✅ Redis accessible (Port 6379)" -ForegroundColor Green
    } else {
        Write-Host "❌ Redis non accessible (Port 6379)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Redis non accessible" -ForegroundColor Red
}

# 7. Test de l'endpoint d'authentification via API Gateway
Write-Host "`n7. Test de l'endpoint d'authentification..." -ForegroundColor Yellow
try {
    $headers = @{
        'Content-Type' = 'application/json'
    }
    $body = @{
        username = "testuser"
        password = "testpassword"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/signin" -Method POST -Headers $headers -Body $body -TimeoutSec 10
    if ($response.StatusCode -eq 400 -or $response.StatusCode -eq 401) {
        Write-Host "✅ Endpoint d'auth accessible (erreur d'authentification attendue)" -ForegroundColor Green
    } elseif ($response.StatusCode -eq 200) {
        Write-Host "✅ Endpoint d'auth accessible et fonctionnel" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 400 -or $_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Endpoint d'auth accessible (erreur d'authentification attendue)" -ForegroundColor Green
    } else {
        Write-Host "❌ Endpoint d'auth non accessible" -ForegroundColor Red
        Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Résumé ===" -ForegroundColor Cyan
Write-Host "Pour démarrer tous les services :" -ForegroundColor White
Write-Host "1. docker-compose up -d (pour PostgreSQL et Redis)" -ForegroundColor White
Write-Host "2. cd backend/auth-service && mvn spring-boot:run" -ForegroundColor White
Write-Host "3. cd backend/api-gateway && mvn spring-boot:run" -ForegroundColor White
Write-Host "4. cd backend/video-service && mvn spring-boot:run" -ForegroundColor White
Write-Host "5. cd frontend/hypertube-app && ng serve" -ForegroundColor White

Write-Host "`nURLs importantes :" -ForegroundColor White
Write-Host "- Frontend: http://localhost:4200" -ForegroundColor White
Write-Host "- API Gateway: http://localhost:8080" -ForegroundColor White
Write-Host "- Auth Service: http://localhost:8081" -ForegroundColor White
Write-Host "- Video Service: http://localhost:8082" -ForegroundColor White 