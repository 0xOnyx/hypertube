# Hypertube Video Service - Quick Start Guide

## 🚀 Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- Git repository cloned

### Development Environment

1. **Start all services with Docker Compose:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Check services status:**
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

3. **View logs:**
   ```bash
   # All services
   docker-compose -f docker-compose.dev.yml logs -f
   
   # Specific service
   docker-compose -f docker-compose.dev.yml logs -f video-service
   ```

4. **Test the API:**
   ```bash
   # Health check
   curl http://localhost:3002/api/v1/health
   
   # Swagger documentation
   open http://localhost:3002/api-docs
   ```

5. **Stop services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ running on localhost:5432
- Redis 7+ running on localhost:6379

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run start:dev
   ```

4. **Run tests:**
   ```bash
   npm run test
   npm run test:e2e
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm run start:prod
   ```

## 📊 Available Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Video Service | 3002 | http://localhost:3002 | Main API |
| PostgreSQL | 5432 | localhost:5432 | Database |
| Redis | 6379 | localhost:6379 | Cache & Queues |

## 📖 API Documentation

Once running, access the Swagger documentation at:
- **Local**: http://localhost:3002/api-docs
- **Docker**: http://localhost:3002/api-docs

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3002
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database connection failed:**
   ```bash
   # Check PostgreSQL is running
   docker-compose -f docker-compose.dev.yml logs postgres
   
   # Restart database
   docker-compose -f docker-compose.dev.yml restart postgres
   ```

3. **Build failed in Docker:**
   ```bash
   # Clean build
   docker-compose -f docker-compose.dev.yml build --no-cache video-service
   ```

4. **Module not found errors:**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl -X GET http://localhost:3002/api/v1/health

# Get movies (will be empty initially)
curl -X GET http://localhost:3002/api/v1/movies

# Create a movie
curl -X POST http://localhost:3002/api/v1/movies \
  -H "Content-Type: application/json" \
  -d '{
    "imdbId": "tt0111161",
    "title": "The Shawshank Redemption",
    "year": 1994,
    "rating": 9.3,
    "runtime": 142,
    "synopsis": "Two imprisoned men bond over a number of years...",
    "genres": ["Drama"],
    "directors": ["Frank Darabont"],
    "actors": ["Tim Robbins", "Morgan Freeman"]
  }'
```

### Using Postman

Import the OpenAPI specification from http://localhost:3002/api-docs-json

## 🔧 Development Commands

```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debug mode

# Building
npm run build          # Build for production
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint

# Testing
npm run test           # Unit tests
npm run test:watch     # Unit tests in watch mode
npm run test:cov       # Test coverage
npm run test:e2e       # End-to-end tests

# Database
npm run typeorm        # TypeORM CLI
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
```

## 📝 Next Steps

1. Check the main [README.md](./README.md) for detailed documentation
2. Explore the API endpoints in Swagger UI
3. Add your first movie via the API
4. Set up your frontend to consume the API
5. Configure external services (TMDB, Torrent APIs) 