# Test simple du service d'authentification
Write-Host "=== Test du Service d'Authentification ===" -ForegroundColor Green

# Naviguer vers le répertoire du service
Set-Location "backend/auth-service"

Write-Host "`nCompilation du service..." -ForegroundColor Yellow
mvn clean compile -q

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de compilation" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilation réussie" -ForegroundColor Green

Write-Host "`nDémarrage du service (profil dev)..." -ForegroundColor Yellow
Write-Host "Le service utilisera H2 en mémoire pour éviter les dépendances externes" -ForegroundColor Cyan

# Configurer le profil dev avec H2
$env:SPRING_PROFILES_ACTIVE = "dev"
$env:SPRING_DATASOURCE_URL = "jdbc:h2:mem:testdb"
$env:SPRING_DATASOURCE_USERNAME = "sa"
$env:SPRING_DATASOURCE_PASSWORD = ""
$env:SPRING_DATASOURCE_DRIVER_CLASS_NAME = "org.h2.Driver"
$env:SPRING_JPA_HIBERNATE_DDL_AUTO = "create-drop"
$env:SPRING_H2_CONSOLE_ENABLED = "true"

Write-Host "Configuration H2 appliquée" -ForegroundColor Cyan
Write-Host "Console H2 accessible sur: http://localhost:8081/h2-console" -ForegroundColor Cyan

# Démarrer le service
mvn spring-boot:run 