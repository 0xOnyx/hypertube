#!/bin/bash

# Script de démarrage complet pour Hypertube (Linux/WSL)
# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Démarrage de Hypertube ===${NC}"

# Vérifier si Docker est en cours d'exécution
echo -e "\n${YELLOW}1. Vérification de Docker...${NC}"
if docker version &> /dev/null; then
    echo -e "${GREEN}✅ Docker est disponible${NC}"
else
    echo -e "${RED}❌ Docker n'est pas disponible. Veuillez démarrer Docker.${NC}"
    exit 1
fi

# Démarrer les services de base (PostgreSQL et Redis)
echo -e "\n${YELLOW}2. Démarrage des services de base (PostgreSQL et Redis)...${NC}"
docker-compose up -d postgres redis

# Attendre que les services soient prêts
echo -e "\n${YELLOW}3. Attente que les services de base soient prêts...${NC}"
sleep 10

# Vérifier la connexion à PostgreSQL
echo -e "\n${YELLOW}4. Vérification de PostgreSQL...${NC}"
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    attempt=$((attempt + 1))
    
    # Vérifier si PostgreSQL est prêt
    if PGPASSWORD=hypertube_password psql -h localhost -p 5432 -U hypertube_user -d hypertube -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL est prêt${NC}"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}❌ PostgreSQL n'est pas accessible après $max_attempts tentatives${NC}"
        exit 1
    fi
    
    echo -e "${GRAY}Tentative $attempt/$max_attempts - Attente de PostgreSQL...${NC}"
    sleep 2
done

# Démarrer les services Spring Boot en arrière-plan
echo -e "\n${YELLOW}5. Démarrage des services Spring Boot...${NC}"

# Créer des logs directories
mkdir -p logs

# Auth Service
echo -e "${CYAN}Démarrage du Auth Service...${NC}"
(cd backend/auth-service && mvn spring-boot:run -Dspring-boot.run.profiles=dev > ../../logs/auth-service.log 2>&1) &
AUTH_PID=$!
echo $AUTH_PID > logs/auth-service.pid

# Attendre un peu avant de démarrer le suivant
sleep 5

# API Gateway
echo -e "${CYAN}Démarrage de l'API Gateway...${NC}"
(cd backend/api-gateway && mvn spring-boot:run > ../../logs/api-gateway.log 2>&1) &
GATEWAY_PID=$!
echo $GATEWAY_PID > logs/api-gateway.pid

# Attendre un peu avant de démarrer le suivant
sleep 5

# Video Service
echo -e "${CYAN}Démarrage du Video Service...${NC}"
(cd backend/video-service && mvn spring-boot:run > ../../logs/video-service.log 2>&1) &
VIDEO_PID=$!
echo $VIDEO_PID > logs/video-service.pid

# Attendre que les services backend soient prêts
echo -e "\n${YELLOW}6. Attente que les services backend soient prêts...${NC}"
sleep 30

# Tester les services backend
echo -e "\n${YELLOW}7. Test des services backend...${NC}"

declare -a services=(
    "Auth Service:8081:http://localhost:8081/actuator/health"
    "API Gateway:8080:http://localhost:8080/actuator/health"
    "Video Service:8082:http://localhost:8082/actuator/health"
)

for service_info in "${services[@]}"; do
    IFS=':' read -r name port url <<< "$service_info"
    max_attempts=20
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        attempt=$((attempt + 1))
        
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name est prêt (Port $port)${NC}"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${YELLOW}⚠️ $name n'est pas encore accessible (Port $port)${NC}"
            break
        fi
        
        echo -e "${GRAY}Tentative $attempt/$max_attempts - Attente de $name...${NC}"
        sleep 3
    done
done

# Démarrer le frontend Angular
echo -e "\n${YELLOW}8. Démarrage du frontend Angular...${NC}"
(cd frontend/hypertube-app && ng serve --host 0.0.0.0 --port 4200 > ../../logs/frontend.log 2>&1) &
FRONTEND_PID=$!
echo $FRONTEND_PID > logs/frontend.pid

echo -e "\n${GREEN}=== Hypertube est en cours de démarrage ===${NC}"
echo -e "\n${WHITE}URLs d'accès :${NC}"
echo -e "${CYAN}- Frontend: http://localhost:4200${NC}"
echo -e "${CYAN}- API Gateway: http://localhost:8080${NC}"
echo -e "${CYAN}- Auth Service: http://localhost:8081${NC}"
echo -e "${CYAN}- Video Service: http://localhost:8082${NC}"

echo -e "\n${WHITE}Comptes de test :${NC}"
echo -e "${CYAN}- Username: admin / Password: admin123${NC}"
echo -e "${CYAN}- Username: user / Password: user123${NC}"

echo -e "\n${WHITE}Logs des services :${NC}"
echo -e "${CYAN}- Auth Service: tail -f logs/auth-service.log${NC}"
echo -e "${CYAN}- API Gateway: tail -f logs/api-gateway.log${NC}"
echo -e "${CYAN}- Video Service: tail -f logs/video-service.log${NC}"
echo -e "${CYAN}- Frontend: tail -f logs/frontend.log${NC}"

echo -e "\n${YELLOW}Pour arrêter tous les services, utilisez: ./stop-all.sh${NC}"
echo -e "${YELLOW}Pour tester la connectivité, utilisez: ./test-connection.sh${NC}"

echo -e "\n${WHITE}PIDs des services sauvegardés dans logs/*.pid${NC}"
echo -e "${GRAY}Appuyez sur Ctrl+C pour arrêter ce script (les services continueront en arrière-plan)${NC}"

# Attendre que l'utilisateur appuie sur Ctrl+C
trap 'echo -e "\n${GREEN}Script arrêté. Les services continuent en arrière-plan.${NC}"; exit 0' INT
while true; do
    sleep 1
done 