"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`\n🚀 FM Digital Bank API running at: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map