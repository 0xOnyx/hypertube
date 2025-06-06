# Script d'arrêt complet pour Hypertube
Write-Host "=== Arrêt de Hypertube ===" -ForegroundColor Red

# Arrêter les processus Java (Spring Boot)
Write-Host "`n1. Arrêt des services Spring Boot..." -ForegroundColor Yellow
try {
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*spring-boot*" } | Stop-Process -Force
    Write-Host "✅ Services Spring Boot arrêtés" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Aucun service Spring Boot trouvé" -ForegroundColor Yellow
}

# Arrêter les processus Node.js (Angular)
Write-Host "`n2. Arrêt du frontend Angular..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*ng serve*" -or $_.CommandLine -like "*angular*" } | Stop-Process -Force
    Write-Host "✅ Frontend Angular arrêté" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Aucun processus Angular trouvé" -ForegroundColor Yellow
}

# Arrêter les conteneurs Docker
Write-Host "`n3. Arrêt des conteneurs Docker..." -ForegroundColor Yellow
try {
    docker-compose down
    Write-Host "✅ Conteneurs Docker arrêtés" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'arrêt des conteneurs Docker" -ForegroundColor Red
}

# Nettoyer les ports (optionnel)
Write-Host "`n4. Nettoyage des ports..." -ForegroundColor Yellow
$ports = @(4200, 8080, 8081, 8082, 5432, 6379)

foreach ($port in $ports) {
    try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($process) {
            $processId = (Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue).Id
            if ($processId) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "✅ Port $port libéré" -ForegroundColor Green
            }
        }
    } catch {
        # Ignorer les erreurs
    }
}

Write-Host "`n=== Hypertube arrêté ===" -ForegroundColor Green
Write-Host "Tous les services ont été arrêtés." -ForegroundColor White 