# Script de démarrage complet pour Hypertube
Write-Host "=== Démarrage de Hypertube ===" -ForegroundColor Green

# Vérifier si Docker est en cours d'exécution
Write-Host "`n1. Vérification de Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker est disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas disponible. Veuillez démarrer Docker Desktop." -ForegroundColor Red
    exit 1
}

# Démarrer les services de base (PostgreSQL et Redis)
Write-Host "`n2. Démarrage des services de base (PostgreSQL et Redis)..." -ForegroundColor Yellow
docker-compose up -d postgres redis

# Attendre que les services soient prêts
Write-Host "`n3. Attente que les services de base soient prêts..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Vérifier la connexion à PostgreSQL
Write-Host "`n4. Vérification de PostgreSQL..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
do {
    $attempt++
    try {
        $env:PGPASSWORD = "hypertubepassword"
        $result = psql -h localhost -p 5432 -U hypertube -d hypertube -c "SELECT 1;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL est prêt" -ForegroundColor Green
            break
        }
    } catch {
        # Continuer à essayer
    }
    
    if ($attempt -eq $maxAttempts) {
        Write-Host "❌ PostgreSQL n'est pas accessible après $maxAttempts tentatives" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Tentative $attempt/$maxAttempts - Attente de PostgreSQL..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
} while ($true)

# Démarrer les services Spring Boot en arrière-plan
Write-Host "`n5. Démarrage des services Spring Boot..." -ForegroundColor Yellow

# Auth Service
Write-Host "Démarrage du Auth Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/auth-service; mvn spring-boot:run" -WindowStyle Minimized

# Attendre un peu avant de démarrer le suivant
Start-Sleep -Seconds 5

# API Gateway
Write-Host "Démarrage de l'API Gateway..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/api-gateway; mvn spring-boot:run" -WindowStyle Minimized

# Attendre un peu avant de démarrer le suivant
Start-Sleep -Seconds 5

# Video Service
Write-Host "Démarrage du Video Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/video-service; mvn spring-boot:run" -WindowStyle Minimized

# Attendre que les services backend soient prêts
Write-Host "`n6. Attente que les services backend soient prêts..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Tester les services backend
Write-Host "`n7. Test des services backend..." -ForegroundColor Yellow

$services = @(
    @{Name="Auth Service"; Port=8081; Url="http://localhost:8081/actuator/health"},
    @{Name="API Gateway"; Port=8080; Url="http://localhost:8080/actuator/health"},
    @{Name="Video Service"; Port=8082; Url="http://localhost:8082/actuator/health"}
)

foreach ($service in $services) {
    $maxAttempts = 20
    $attempt = 0
    do {
        $attempt++
        try {
            $response = Invoke-WebRequest -Uri $service.Url -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $($service.Name) est prêt (Port $($service.Port))" -ForegroundColor Green
                break
            }
        } catch {
            # Continuer à essayer
        }
        
        if ($attempt -eq $maxAttempts) {
            Write-Host "⚠️ $($service.Name) n'est pas encore accessible (Port $($service.Port))" -ForegroundColor Yellow
            break
        }
        
        Write-Host "Tentative $attempt/$maxAttempts - Attente de $($service.Name)..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
    } while ($true)
}

# Démarrer le frontend Angular
Write-Host "`n8. Démarrage du frontend Angular..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/hypertube-app; ng serve --host 0.0.0.0 --port 4200" -WindowStyle Normal

Write-Host "`n=== Hypertube est en cours de démarrage ===" -ForegroundColor Green
Write-Host "`nURLs d'accès :" -ForegroundColor White
Write-Host "- Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "- API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "- Auth Service: http://localhost:8081" -ForegroundColor Cyan
Write-Host "- Video Service: http://localhost:8082" -ForegroundColor Cyan

Write-Host "`nComptes de test :" -ForegroundColor White
Write-Host "- Username: admin / Password: admin123" -ForegroundColor Cyan
Write-Host "- Username: user / Password: user123" -ForegroundColor Cyan

Write-Host "`nPour arrêter tous les services, utilisez: .\stop-all.ps1" -ForegroundColor Yellow
Write-Host "`nPour tester la connectivité, utilisez: .\test-connection.ps1" -ForegroundColor Yellow

# Attendre que l'utilisateur appuie sur une touche
Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 