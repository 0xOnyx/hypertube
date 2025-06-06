#!/bin/bash

# Test de connexion Backend-Frontend Hypertube (Linux/WSL)
# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Test de connexion Backend-Frontend Hypertube ===${NC}"

# 1. Test de l'API Gateway
echo -e "\n${YELLOW}1. Test de l'API Gateway...${NC}"
if curl -s --max-time 10 "http://localhost:8080/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway OK (Port 8080)${NC}"
else
    echo -e "${RED}❌ API Gateway non accessible (Port 8080)${NC}"
fi

# 2. Test du Service d'Auth
echo -e "\n${YELLOW}2. Test du Service d'Authentification...${NC}"
if curl -s --max-time 10 "http://localhost:8081/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth Service OK (Port 8081)${NC}"
else
    echo -e "${RED}❌ Auth Service non accessible (Port 8081)${NC}"
fi

# 3. Test du Service Vidéo
echo -e "\n${YELLOW}3. Test du Service Vidéo...${NC}"
if curl -s --max-time 10 "http://localhost:8082/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Video Service OK (Port 8082)${NC}"
else
    echo -e "${RED}❌ Video Service non accessible (Port 8082)${NC}"
fi

# 4. Test du Frontend
echo -e "\n${YELLOW}4. Test du Frontend Angular...${NC}"
if curl -s --max-time 10 "http://localhost:4200" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend OK (Port 4200)${NC}"
else
    echo -e "${RED}❌ Frontend non accessible (Port 4200)${NC}"
fi

# 5. Test de la base de données
echo -e "\n${YELLOW}5. Test de la base de données PostgreSQL...${NC}"
if command -v psql > /dev/null 2>&1; then
    if PGPASSWORD=hypertube_password psql -h localhost -p 5432 -U hypertube_user -d hypertube -c "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL OK (Port 5432)${NC}"
    else
        echo -e "${RED}❌ PostgreSQL non accessible${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ psql non installé, tentative de connexion simple...${NC}"
    if nc -z localhost 5432 2>/dev/null; then
        echo -e "${GREEN}✅ PostgreSQL accessible (Port 5432)${NC}"
    else
        echo -e "${RED}❌ PostgreSQL non accessible (Port 5432)${NC}"
    fi
fi

# 6. Test de Redis
echo -e "\n${YELLOW}6. Test de Redis...${NC}"
if command -v redis-cli > /dev/null 2>&1; then
    if redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis OK (Port 6379)${NC}"
    else
        echo -e "${RED}❌ Redis non accessible (Port 6379)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ redis-cli non installé, tentative de connexion simple...${NC}"
    if nc -z localhost 6379 2>/dev/null; then
        echo -e "${GREEN}✅ Redis accessible (Port 6379)${NC}"
    else
        echo -e "${RED}❌ Redis non accessible (Port 6379)${NC}"
    fi
fi

# 7. Test de l'endpoint d'authentification via API Gateway
echo -e "\n${YELLOW}7. Test de l'endpoint d'authentification...${NC}"
auth_response=$(curl -s --max-time 10 -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","password":"testpassword"}' \
    -w "%{http_code}" \
    "http://localhost:8080/api/auth/signin" 2>/dev/null)

http_code="${auth_response: -3}"
if [[ "$http_code" == "400" || "$http_code" == "401" ]]; then
    echo -e "${GREEN}✅ Endpoint d'auth accessible (erreur d'authentification attendue)${NC}"
elif [[ "$http_code" == "200" ]]; then
    echo -e "${GREEN}✅ Endpoint d'auth accessible et fonctionnel${NC}"
else
    echo -e "${RED}❌ Endpoint d'auth non accessible${NC}"
fi

# 8. Test des ports occupés
echo -e "\n${YELLOW}8. Vérification des ports utilisés...${NC}"
ports=(4200 8080 8081 8082 5432 6379)
for port in "${ports[@]}"; do
    if nc -z localhost $port 2>/dev/null; then
        echo -e "${GREEN}✅ Port $port : utilisé${NC}"
    else
        echo -e "${RED}❌ Port $port : libre${NC}"
    fi
done

# 9. Test Docker
echo -e "\n${YELLOW}9. Test de Docker...${NC}"
if docker version > /dev/null 2>&1; then
    running_containers=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(postgres|redis)")
    if [ -n "$running_containers" ]; then
        echo -e "${GREEN}✅ Docker et conteneurs actifs${NC}"
        echo -e "${CYAN}Conteneurs en cours :${NC}"
        echo "$running_containers"
    else
        echo -e "${YELLOW}⚠️ Docker actif mais pas de conteneurs Hypertube${NC}"
    fi
else
    echo -e "${RED}❌ Docker non accessible${NC}"
fi

echo -e "\n${CYAN}=== Résumé ===${NC}"
echo -e "${WHITE}Pour démarrer tous les services :${NC}"
echo -e "${CYAN}1. ./start-all.sh${NC}"

echo -e "\n${WHITE}Pour démarrer manuellement :${NC}"
echo -e "${CYAN}1. docker-compose up -d postgres redis${NC}"
echo -e "${CYAN}2. cd backend/auth-service && mvn spring-boot:run -Dspring-boot.run.profiles=dev &${NC}"
echo -e "${CYAN}3. cd backend/api-gateway && mvn spring-boot:run &${NC}"
echo -e "${CYAN}4. cd backend/video-service && mvn spring-boot:run &${NC}"
echo -e "${CYAN}5. cd frontend/hypertube-app && ng serve &${NC}"

echo -e "\n${WHITE}URLs importantes :${NC}"
echo -e "${CYAN}- Frontend: http://localhost:4200${NC}"
echo -e "${CYAN}- API Gateway: http://localhost:8080${NC}"
echo -e "${CYAN}- Auth Service: http://localhost:8081${NC}"
echo -e "${CYAN}- Video Service: http://localhost:8082${NC}"

echo -e "\n${WHITE}Debugging :${NC}"
echo -e "${CYAN}- Logs services: tail -f logs/*.log${NC}"
echo -e "${CYAN}- Processus Java: pgrep -f spring-boot${NC}"
echo -e "${CYAN}- Processus Node: pgrep -f 'ng serve'${NC}"
echo -e "${CYAN}- Ports occupés: netstat -tlnp | grep -E ':(4200|8080|8081|8082|5432|6379)'${NC}" 