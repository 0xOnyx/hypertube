"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:4200',
            'https://localhost:8443',
            'https://hypertube.com',
            'https://hypertube.com:8443',
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Hypertube Video Service API')
        .setDescription('API for video management and streaming')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    app.setGlobalPrefix('');
    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`🚀 Video Service started on port ${port}`);
    console.log(`📖 Swagger documentation available at http://localhost:${port}/api-docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map