# Script d'initialisation des fichiers Kubernetes pour Hypertube
Write-Host "🚀 Initialisation des fichiers Kubernetes pour Hypertube" -ForegroundColor Green

# Vérifier si nous sommes dans le bon répertoire
if (-not (Test-Path "namespace.yaml")) {
    Write-Host "❌ Veuillez exécuter ce script depuis le répertoire kubernetes/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichiers Kubernetes prêts pour le déploiement!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Fichiers disponibles:" -ForegroundColor Cyan
Get-ChildItem *.yaml | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }
Write-Host ""
Write-Host "🚀 Pour déployer Hypertube sur Kubernetes, exécutez:" -ForegroundColor Yellow
Write-Host "   .\deploy.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📚 Consultez README.md pour plus d'informations" -ForegroundColor Cyan 