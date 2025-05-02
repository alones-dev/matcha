import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from "dotenv";
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true
    }));

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });

    app.enableCors({
        origin: "http://localhost:3000",
        credentials: true,
    });

    await app.listen(process.env.PORT || 4000);
}

bootstrap();