# Script de correction rapide pour Lombok
Write-Host "=== Correction des problèmes Lombok ===" -ForegroundColor Green

Set-Location "backend/auth-service"

Write-Host "`n1. Ajout de Lombok au pom.xml..." -ForegroundColor Yellow

# Vérifier si Lombok est dans le pom.xml
$pomContent = Get-Content "pom.xml" -Raw
if ($pomContent -notmatch "lombok") {
    Write-Host "Ajout de la dépendance Lombok..." -ForegroundColor Cyan
    
    # Ajouter Lombok avant le tag de fermeture des dependencies
    $newDependency = @"
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- H2 Database for development -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
"@
    
    $pomContent = $pomContent -replace '(\s+</dependencies>)', "`n$newDependency`n`$1"
    $pomContent | Set-Content "pom.xml"
    Write-Host "✅ Lombok ajouté au pom.xml" -ForegroundColor Green
} else {
    Write-Host "✅ Lombok déjà présent dans pom.xml" -ForegroundColor Green
}

Write-Host "`n2. Configuration du profil de développement..." -ForegroundColor Yellow

# Créer application-dev.yml
$devConfig = @"
spring:
  config:
    activate:
      on-profile: dev
      
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: 
    driver-class-name: org.h2.Driver
    
  h2:
    console:
      enabled: true
      path: /h2-console
      
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
        format_sql: true
        
  redis:
    host: localhost
    port: 6379
    timeout: 1000ms
    
  mail:
    host: localhost
    port: 25
    
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false

hypertube:
  email:
    verification:
      enabled: false

logging:
  level:
    com.hypertube.auth: DEBUG
    org.springframework.security: DEBUG
"@

$devConfig | Set-Content "src/main/resources/application-dev.yml"
Write-Host "✅ Profil de développement créé" -ForegroundColor Green

Write-Host "`n3. Test de compilation..." -ForegroundColor Yellow
$env:SPRING_PROFILES_ACTIVE = "dev"

# Nettoyer et compiler
mvn clean compile -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilation réussie !" -ForegroundColor Green
    Write-Host "`n=== Projet prêt ===" -ForegroundColor Cyan
    Write-Host "Pour démarrer le service :" -ForegroundColor White
    Write-Host "mvn spring-boot:run -Dspring-boot.run.profiles=dev" -ForegroundColor Yellow
    Write-Host "`nConsole H2 : http://localhost:8081/h2-console" -ForegroundColor Cyan
    Write-Host "JDBC URL : jdbc:h2:mem:testdb" -ForegroundColor Cyan
    Write-Host "Username : sa" -ForegroundColor Cyan
    Write-Host "Password : (vide)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erreurs de compilation détectées" -ForegroundColor Red
    Write-Host "Veuillez installer le plugin Lombok dans votre IDE :" -ForegroundColor Yellow
    Write-Host "- IntelliJ IDEA : File > Settings > Plugins > Rechercher 'Lombok'" -ForegroundColor White
    Write-Host "- VS Code : Extension 'Language Support for Java'" -ForegroundColor White
    Write-Host "Puis redémarrez votre IDE et réessayez." -ForegroundColor White
} 