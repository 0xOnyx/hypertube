#!/bin/bash

# Script d'arrêt complet pour Hypertube (Linux/WSL)
# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${RED}=== Arrêt de Hypertube ===${NC}"

# Arrêter les services en utilisant les PIDs sauvegardés
echo -e "\n${YELLOW}1. Arrêt des services Spring Boot et Angular...${NC}"

services=("auth-service" "api-gateway" "video-service" "frontend")

for service in "${services[@]}"; do
    if [ -f "logs/${service}.pid" ]; then
        pid=$(cat "logs/${service}.pid")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${CYAN}Arrêt de $service (PID: $pid)...${NC}"
            kill -TERM $pid 2>/dev/null
            
            # Attendre que le processus s'arrête gracieusement
            sleep 3
            
            # Si le processus est toujours là, le forcer à s'arrêter
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${YELLOW}Arrêt forcé de $service...${NC}"
                kill -KILL $pid 2>/dev/null
            fi
            
            echo -e "${GREEN}✅ $service arrêté${NC}"
        else
            echo -e "${GRAY}⚠️ $service n'était pas en cours d'exécution${NC}"
        fi
        rm -f "logs/${service}.pid"
    else
        echo -e "${GRAY}⚠️ Fichier PID pour $service non trouvé${NC}"
    fi
done

# Arrêter tous les processus Java restants (Spring Boot)
echo -e "\n${YELLOW}2. Nettoyage des processus Java (Spring Boot)...${NC}"
java_pids=$(pgrep -f "spring-boot")
if [ -n "$java_pids" ]; then
    echo -e "${CYAN}Arrêt des processus Java Spring Boot...${NC}"
    echo "$java_pids" | xargs kill -TERM 2>/dev/null
    sleep 3
    # Force kill si nécessaire
    java_pids=$(pgrep -f "spring-boot")
    if [ -n "$java_pids" ]; then
        echo "$java_pids" | xargs kill -KILL 2>/dev/null
    fi
    echo -e "${GREEN}✅ Processus Java arrêtés${NC}"
else
    echo -e "${GRAY}⚠️ Aucun processus Java Spring Boot trouvé${NC}"
fi

# Arrêter les processus Node.js (Angular)
echo -e "\n${YELLOW}3. Nettoyage des processus Node.js (Angular)...${NC}"
node_pids=$(pgrep -f "ng serve\|angular")
if [ -n "$node_pids" ]; then
    echo -e "${CYAN}Arrêt des processus Node.js Angular...${NC}"
    echo "$node_pids" | xargs kill -TERM 2>/dev/null
    sleep 3
    # Force kill si nécessaire
    node_pids=$(pgrep -f "ng serve\|angular")
    if [ -n "$node_pids" ]; then
        echo "$node_pids" | xargs kill -KILL 2>/dev/null
    fi
    echo -e "${GREEN}✅ Processus Node.js arrêtés${NC}"
else
    echo -e "${GRAY}⚠️ Aucun processus Node.js Angular trouvé${NC}"
fi

# Arrêter les conteneurs Docker
echo -e "\n${YELLOW}4. Arrêt des conteneurs Docker...${NC}"
if docker-compose down 2>/dev/null; then
    echo -e "${GREEN}✅ Conteneurs Docker arrêtés${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'arrêt des conteneurs Docker${NC}"
fi

# Nettoyer les ports (optionnel)
echo -e "\n${YELLOW}5. Nettoyage des ports...${NC}"
ports=(4200 8080 8081 8082 5432 6379)

for port in "${ports[@]}"; do
    # Trouver les processus utilisant le port
    pids=$(lsof -ti :$port 2>/dev/null)
    if [ -n "$pids" ]; then
        echo -e "${CYAN}Libération du port $port...${NC}"
        echo "$pids" | xargs kill -TERM 2>/dev/null
        sleep 1
        # Force kill si nécessaire
        pids=$(lsof -ti :$port 2>/dev/null)
        if [ -n "$pids" ]; then
            echo "$pids" | xargs kill -KILL 2>/dev/null
        fi
        echo -e "${GREEN}✅ Port $port libéré${NC}"
    fi
done

# Nettoyer les fichiers de logs anciens (optionnel)
echo -e "\n${YELLOW}6. Nettoyage des logs...${NC}"
if [ -d "logs" ]; then
    # Garder les logs mais nettoyer les gros fichiers
    find logs -name "*.log" -size +100M -delete 2>/dev/null
    echo -e "${GREEN}✅ Logs volumineux nettoyés${NC}"
fi

echo -e "\n${GREEN}=== Hypertube arrêté ===${NC}"
echo -e "${WHITE}Tous les services ont été arrêtés.${NC}"

echo -e "\n${CYAN}Commandes utiles :${NC}"
echo -e "${WHITE}- Redémarrer : ./start-all.sh${NC}"
echo -e "${WHITE}- Vérifier les ports : netstat -tlnp | grep -E ':(4200|8080|8081|8082|5432|6379)'${NC}"
echo -e "${WHITE}- Vérifier Docker : docker ps${NC}"
echo -e "${WHITE}- Nettoyer Docker : docker system prune -f${NC}" 