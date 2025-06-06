# Script de test des services Hypertube
param(
    [string]$BaseUrl = "http://localhost:8080"
)

Write-Host "🧪 Test des services Hypertube" -ForegroundColor Green
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan

# Function to make HTTP requests
function Invoke-ApiRequest {
    param(
        [string]$Method = "GET",
        [string]$Endpoint,
        [hashtable]$Body = @{},
        [hashtable]$Headers = @{}
    )
    
    $url = "$BaseUrl$Endpoint"
    Write-Host "  → $Method $url" -ForegroundColor Gray
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $Headers
        } else {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri $url -Method $Method -Body $jsonBody -ContentType "application/json" -Headers $Headers
        }
        Write-Host "  ✅ Success" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host ""
Write-Host "1. 🔍 Test des endpoints publics" -ForegroundColor Yellow

# Test health checks
Write-Host "Health checks:" -ForegroundColor Cyan
Invoke-ApiRequest -Endpoint "/health/auth"
Invoke-ApiRequest -Endpoint "/health/video"

# Test public movies endpoint
Write-Host "Public movies:" -ForegroundColor Cyan
$movies = Invoke-ApiRequest -Endpoint "/api/movies"

Write-Host ""
Write-Host "2. 👤 Test d'inscription" -ForegroundColor Yellow

$signupData = @{
    username = "testuser$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
    language = "en"
}

$signupResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/api/auth/signup" -Body $signupData

Write-Host ""
Write-Host "3. 🔐 Test de connexion" -ForegroundColor Yellow

$loginData = @{
    usernameOrEmail = "demo"
    password = "password"
}

$loginResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/api/auth/signin" -Body $loginData

if ($loginResponse -and $loginResponse.accessToken) {
    $token = $loginResponse.accessToken
    $headers = @{ "Authorization" = "Bearer $token" }
    
    Write-Host ""
    Write-Host "4. 🔒 Test des endpoints protégés" -ForegroundColor Yellow
    
    # Test user profile
    Write-Host "User profile:" -ForegroundColor Cyan
    Invoke-ApiRequest -Endpoint "/api/users/$($loginResponse.id)" -Headers $headers
    
    # Test movies with auth
    Write-Host "Movies (authenticated):" -ForegroundColor Cyan
    Invoke-ApiRequest -Endpoint "/api/movies" -Headers $headers
    
    # Test movie search
    Write-Host "Movie search:" -ForegroundColor Cyan
    Invoke-ApiRequest -Endpoint "/api/movies/search?q=avengers" -Headers $headers
    
    Write-Host ""
    Write-Host "5. 💬 Test des commentaires" -ForegroundColor Yellow
    
    # Get comments
    Write-Host "Get comments:" -ForegroundColor Cyan
    Invoke-ApiRequest -Endpoint "/api/comments" -Headers $headers
    
    # Post a comment (if we have a movie)
    if ($movies -and $movies.Count -gt 0) {
        $movieId = $movies[0].id
        $commentData = @{
            comment = "Test comment from API test"
            movieId = $movieId
        }
        
        Write-Host "Post comment:" -ForegroundColor Cyan
        Invoke-ApiRequest -Method "POST" -Endpoint "/api/comments" -Body $commentData -Headers $headers
    }
    
    Write-Host ""
    Write-Host "6. 🚪 Test de déconnexion" -ForegroundColor Yellow
    Invoke-ApiRequest -Method "POST" -Endpoint "/api/auth/signout" -Headers $headers
    
} else {
    Write-Host "❌ Connexion échouée, impossible de tester les endpoints protégés" -ForegroundColor Red
}

Write-Host ""
Write-Host "7. 🔄 Test de validation de token" -ForegroundColor Yellow
Invoke-ApiRequest -Endpoint "/api/auth/validate" -Headers @{ "Authorization" = "Bearer invalid-token" }

Write-Host ""
Write-Host "✅ Tests terminés!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Pour plus de tests détaillés:" -ForegroundColor Cyan
Write-Host "  - Swagger UI: $BaseUrl/swagger-ui.html" -ForegroundColor White
Write-Host "  - Actuator: $BaseUrl/actuator" -ForegroundColor White
Write-Host "  - Gateway routes: $BaseUrl/actuator/gateway/routes" -ForegroundColor White 