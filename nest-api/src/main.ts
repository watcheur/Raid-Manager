import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get<ConfigService>(ConfigService);

	const options = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("Raid-Manager API")
		.setVersion("0.0.1")
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({
		origin: 'http://localhost:3000'
	});
	app.use(helmet());
	app.use(cookieParser());
	app.use(rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 150000 // 100 request per window
	}))

  	await app.listen(config.get('PORT', 3005));
}
bootstrap();
